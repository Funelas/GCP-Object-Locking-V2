# GCP Object Locking V2

A web application for managing Google Cloud Platform (GCP) object locking, retention policies, and metadata editing across multiple buckets.

## Features

- Object-level retention policy management
- Metadata editing capabilities  
- Multi-bucket support
- Modern web interface with FastAPI backend and React frontend

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.7+
- Node.js 16+
- npm or yarn
- Git

## Installation and Setup

### 1. Environment Variables Setup

#### Getting SCOPES
For full functionality (overwriting retention policies and editing metadata):
```
https://www.googleapis.com/auth/devstorage.full_control
```

#### Getting CREDENTIALS_FILE

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with a Google account that has permission to access your bucket(s)
3. Click the **"Project"** button in the top menu
4. Select **"New Project"** or choose an existing project
5. Open the **Navigation Menu** (☰ icon in top-left corner)
6. Under **"APIs & Services"**, click **"Credentials"**
7. Click **"+ Create Credentials"**
8. Select **"OAuth client ID"**
9. Choose **"Web Application"** for the Application Type
10. Customize the "Name" (optional)
11. Click **"Create"**
12. In the popup modal, click **"Download JSON"**
13. Store the downloaded file in a folder named `creds` inside the `backend` directory

#### Getting TOKEN_FILE (Optional)

Token files are **automatically created** on the first run of the application. However, if you have existing token files:

1. Create a folder named `tokens` in the `backend` directory
2. Place your token files in this folder
3. Ensure they follow the naming convention: `token_<bucketname>.pkl`

### 2. Clone the Repository

```bash
git clone https://github.com/Funelas/GCP-Object-Locking-V2.git
cd GCP-Object-Locking-V2
```

### 3. Backend Setup

#### Navigate to backend folder
```bash
cd backend
```

#### Create environment file
Create a `.env` file in the `backend` folder with the following structure:

```env
FRONTEND_URL=http://localhost:5173

# Bucket Configuration Pattern:
# BUCKET<N> = <bucket_name>
# SCOPES_<bucket_name> = <scope_url>
# CREDENTIALS_FILE_<bucket_name> = <path_to_credentials>
# TOKEN_FILE_<bucket_name> = <path_to_token> (optional)

# Example configuration:
BUCKET1=bucket_name1
SCOPES_bucket_name1=https://www.googleapis.com/auth/devstorage.full_control
CREDENTIALS_FILE_bucket_name1=./creds/bucket_name1_credentials.json
TOKEN_FILE_bucket_name1=./tokens/bucket_name1_token.pkl

BUCKET2=bucket_name2
SCOPES_bucket_name2=https://www.googleapis.com/auth/devstorage.read_only
CREDENTIALS_FILE_bucket_name2=./creds/bucket_name2_credentials.json
```

#### Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Run the FastAPI server
```bash
uvicorn main:app --reload
```

The backend server will start at `http://localhost:8000`

### 4. Frontend Setup

#### Open a new terminal and navigate to frontend folder
```bash
cd frontend
```

#### Create environment file
Create a `.env` file in the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:8000
```

#### Install frontend dependencies
```bash
npm install
```

#### Run the development server
```bash
npm run dev
```

The frontend application will start at `http://localhost:5173`

## Project Structure

```
GCP-Object-Locking-V2/
├── backend/
│   ├── creds/           # Store credential JSON files here
│   ├── tokens/          # Token files (auto-generated)
│   ├── main.py          # FastAPI application
│   ├── requirements.txt # Python dependencies
│   └── .env            # Backend environment variables
├── frontend/
│   ├── src/            # React source code
│   ├── package.json    # Node.js dependencies
│   └── .env           # Frontend environment variables
└── README.md
```

## Usage

1. Ensure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:5173`
3. The application will guide you through Google OAuth authentication if needed
4. Start managing your GCP object locks and metadata

## Configuration Notes

- **Full Control Scope**: Required for editing metadata and overwriting retention policies
- **Read-Only Scope**: Use `https://www.googleapis.com/auth/devstorage.read_only` for read-only access
- **Multiple Buckets**: Add additional bucket configurations following the same pattern (`BUCKET3`, `BUCKET4`, etc.)
- **Token Files**: Will be automatically generated during first authentication

## Troubleshooting

- Ensure your Google Cloud project has the Cloud Storage API enabled
- Verify that your service account has the necessary permissions for your buckets
- Check that all environment variables are correctly set
- Make sure both servers are running on the specified ports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Add your license information here]