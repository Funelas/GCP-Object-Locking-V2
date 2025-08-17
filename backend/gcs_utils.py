import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import json
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv, set_key

def get_credentials(bucket_name):
    load_dotenv()
    creds = None
    TOKEN_FILE = os.getenv(f"TOKEN_FILE_{bucket_name}")
    SCOPES = [os.getenv(f"SCOPES_{bucket_name}")]
    CREDENTIALS_FILE = os.getenv(f"CREDENTIALS_FILE_{bucket_name}")
    if TOKEN_FILE:
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        os.makedirs("./tokens", exist_ok=True)  
        with open(f"./tokens/token_{bucket_name}.pkl", 'wb') as token:
            pickle.dump(creds, token)
            
    key_name = f"TOKEN_FILE_{bucket_name}"
    if not os.getenv(key_name):
        env_path = ".env"
        set_key(env_path, key_name, f"./tokens/token_{bucket_name}.pkl")

    return creds

def list_gcs_objects(bucket_name, client):
    bucket = client.bucket(bucket_name)
    blobs = bucket.list_blobs()
    return {blob.name : {
        "temporary_hold": blob.temporary_hold, 
        "metadata": blob.metadata}
        for blob in blobs }

def update_blob_entry_in_locked_json(bucket, filename, blob):
    lock_blob = bucket.get_blob(f"{bucket.name}_locked_objects.json")
    generation = lock_blob.generation
    try:
        locked_data = json.loads(lock_blob.download_as_bytes())
    except Exception:
        locked_data = {}

    # Refresh blob metadata
    blob.reload()
    lock_blob.temporary_hold = False
    lock_blob.patch()
    
    locked_data[filename] = {
        "temporary_hold": blob.temporary_hold,
        "expiration_date": blob.retention_expiration_time.isoformat() if blob.retention_expiration_time else None,
        "metadata": blob.metadata or {},
        "updated_at": blob.updated.isoformat() if blob.updated else None,
        "metageneration": blob.metageneration,
    }

    # Write it back using generation check
    lock_blob.upload_from_string(
        json.dumps(locked_data, indent=2),
        content_type="application/json",
        if_generation_match=generation
    )
    lock_blob.temporary_hold = True
    lock_blob.patch()

def get_locked_file_with_generation(bucket, buckets = "", gcs_client = ""):
    blob = bucket.get_blob(f"{bucket.name}_locked_objects.json")
    # If file already exists, just read and return, automatically gets the latest version
    if blob:
        blob.reload()
        data = blob.download_as_bytes()
        return json.loads(data), blob.generation
    # ⏳ File does not exist: scan all blobs to find locked ones
    now = datetime.now(timezone.utc) + timedelta(seconds=30)  # Expiry buffer
    locked_data = {}
    for each_bucket in buckets:
        try:
            current_bucket = gcs_client.get_bucket(bucket_or_name = each_bucket)
        except:
            continue
        for b in current_bucket.list_blobs():
            b.reload()
            if "locked_objects" in b.name:
                continue
            is_locked = (
                b.temporary_hold is True or
                (b.retention_expiration_time and b.retention_expiration_time > now)
            )

            if is_locked:
                item_id = b.name.split("/").pop().split(".")[0]
                if item_id not in list(locked_data.keys()):
                    locked_data[item_id] = {
                        "temporary_hold": b.temporary_hold,
                        "expiration_date": b.retention_expiration_time.isoformat() if b.retention_expiration_time else None,
                        "metadata": b.metadata or {},
                        "buckets" : [each_bucket]
                    }
                elif each_bucket not in locked_data[item_id]["buckets"]:
                    locked_data[item_id]["buckets"].append(each_bucket)
    blob = bucket.blob(f"{bucket.name}_locked_objects.json")
    try:
        blob.upload_from_string(
            json.dumps(locked_data, indent=2),
            content_type="application/json"
        )
    except Exception as e:
        print(e)
    blob.temporary_hold = True
    blob.patch()
    blob.reload()

    return locked_data, blob.generation


def update_locked_file(bucket, new_data: dict):
    blob = bucket.blob(f"{bucket.name}_locked_objects.json")

    # 1. Release temporary hold (and commit it)
    blob.temporary_hold = False
    blob.patch()

    # 2. Upload updated content (with generation check)
    blob.upload_from_string(
        json.dumps(new_data, indent=2),
        content_type="application/json"
    )

    # 3. Reapply temporary hold (optional)
    blob.temporary_hold = True
    blob.patch()



