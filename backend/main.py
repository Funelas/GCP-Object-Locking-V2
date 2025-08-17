from fastapi import FastAPI, Query, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from gcs_utils import get_credentials, get_locked_file_with_generation, update_locked_file
from google.cloud import storage
from pydantic import BaseModel
from typing import Dict, Optional, List
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL"),
        os.getenv("FRONTEND_URL1"),
        os.getenv("FRONTEND_URL2")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/files")
def get_files(
    query: str = "",
    bucket: str = "",
):
    try:
        load_dotenv()
        # lock_blob always true
        creds = get_credentials(bucket)
        gcs_client = storage.Client(project="bucketdemoproject", credentials=creds)
        bucket_name = bucket
        bucket = gcs_client.bucket(bucket_name)
        all_buckets = get_buckets()
        lock_blob, lock_generation = get_locked_file_with_generation(bucket, all_buckets, gcs_client)
    except Exception as e:
        print(f"Goes Here: {e}")
        return {
        "files": [],
        "currentGeneration" : 0,
    }

    # 🔍 Apply filtering based on filename or metadata
    query = query.lower()
    filtered = []
    for filename, info in lock_blob.items():
        if not isinstance(info, dict):
            continue

        # Combine all searchable fields
        searchable = [filename] + list(info.get("metadata", {}).keys()) + list(info.get("metadata", {}).values())
        searchable = [str(x).lower() for x in searchable]

        if any(query in item for item in searchable):
            filtered.append({
                "name": filename,
                "temporary_hold": info.get("temporary_hold", False),
                "expiration_date": info.get("expiration_date"),
                "metadata": info.get("metadata", {}),
                "buckets": info.get("buckets")
            })
    return {
        "files": filtered,
        "currentGeneration" : lock_generation,
    }

class LockStatus(BaseModel):
    temporary_hold: bool
    hold_expiry: Optional[str] = None  # ISO string format expected

class UpdateObject(BaseModel):
    filename: str
    metadata: Optional[Dict[str, str]] = None
    lockstatus: Optional[LockStatus] = None

# Final payload is a dict of bucketName: list of update objects
UpdateAllBucketsPayload = Dict[str, List[UpdateObject]]

@app.patch("/update-all-buckets")
def update_all_buckets(data: UpdateAllBucketsPayload = Body(...)):
    
    total_files_updated = 0
    print(data)
    for bucket_entry in data.keys():
        print(f"Bucket Entry: {bucket_entry}")
        bucket_name = bucket_entry
        updates = data[bucket_name]
        creds = get_credentials(bucket_name)
        gcs_client = storage.Client(project="bucketdemoproject", credentials=creds)
        try:
            bucket = gcs_client.get_bucket(bucket_or_name= bucket_name)
        except:
            continue
        locked_map, _ = get_locked_file_with_generation(bucket)

        now = datetime.now(timezone.utc)
        for update in updates:
            filename = update.filename
            all_matching_files = list(bucket.list_blobs(match_glob= f"**{filename}**"))
            if len(all_matching_files) > 0:
                for blob in all_matching_files:
                    blob.reload()
                    retain_until = now + timedelta(seconds=30) 

                    # 🔐 Lock update
                    if update.lockstatus:
                        blob.temporary_hold = update.lockstatus.temporary_hold
                        blob.patch()

                        expiry = update.lockstatus.hold_expiry
                        if expiry:
                            expiry_dt = datetime.fromisoformat(expiry).replace(tzinfo=timezone.utc)
                            if expiry_dt > now:
                                retain_until = expiry_dt

                        blob.retention.mode = "Unlocked"
                        blob.retention.retain_until_time = retain_until
                        blob.patch(override_unlocked_retention=True)

                    # 📝 Metadata update
                    if update.metadata or update.metadata == {}:
                        blob.reload()
                        blob.metadata = update.metadata
                        blob.retention.mode = "Unlocked"
                        blob.retention.retain_until_time = retain_until if blob.retention.retain_until_time < retain_until else blob.retention.retain_until_time
                        blob.update(override_unlocked_retention=True)

                    # 🔁 Update locked_map
                    expiry_time = blob.retention.retain_until_time
                    now_plus_30s = datetime.now(timezone.utc) + timedelta(seconds=30)
                    if blob.temporary_hold or (expiry_time and expiry_time > now_plus_30s):
                        locked_map[filename] = {
                            "temporary_hold": blob.temporary_hold,
                            "expiration_date": expiry_time.isoformat() if expiry_time else None,
                            "metadata": blob.metadata or {},
                            # "buckets" : locked_map[filename]["buckets"].append(bucket_name) if locked_map[filename].get("buckets") else [bucket_name]
                        }
                        if locked_map[filename].get("buckets") and bucket_name not in locked_map[filename]["buckets"]:
                            locked_map[filename]["buckets"].append(bucket_name)
                        else:
                            locked_map[filename]["buckets"] = [bucket_name]
                    elif filename in locked_map:
                        del locked_map[filename]

                    total_files_updated += 1
            else:
                del locked_map[filename]

        # 📝 Save updated locked_objects.json for this bucket
        update_locked_file(bucket, locked_map)

    return {"message": f"✅ Successfully updated {total_files_updated} files across {len(data.keys())} buckets"}

@app.get("/search-objects")
def search_objects(query: str = Query("")):
    

    all_results = {}
    buckets = get_buckets()
    buckets_that_contains = []
    objects_count = 0
    for bucket_name in buckets:
        try:
            creds = get_credentials(bucket_name)
            client = storage.Client(project="bucketdemoproject", credentials=creds)
            bucket = client.bucket(bucket_name)
            print(f"Bucket Name: {bucket_name}")
            print(list(bucket.list_blobs()))
            matching = [blob.name for blob in bucket.list_blobs(match_glob= f"**{query}**")]
            if matching:
                buckets_that_contains.append(bucket_name)
                objects_count += len(matching)
        except:
            continue
    if buckets_that_contains:
        all_results[query] = buckets_that_contains
    print(f"All Results: {all_results}")
    return all_results, objects_count


def get_buckets():
    # If given credentials are for the whole project
    # project_id = "projectidstring"
    # creds = get_credentials(TOKEN_FILE = TOKEN_FILE, CREDENTIALS_FILE= CREDENTIALS_FILE, SCOPES= SCOPES)
    # client = storage.Client(project=project_id, credentials= creds)
    # buckets = client.list_buckets()

    # bucket_names = [bucket.name for bucket in buckets]
    # return bucket_names
    number_of_buckets = 5
    bucket_names = [os.getenv(f"BUCKET{i}")for i in range(1,number_of_buckets + 1)]
    return bucket_names 