# MongoDB Setup

The backend supports MongoDB through `pymongo`.

## Local MongoDB

Use a local MongoDB server with:

```text
mongodb://127.0.0.1:27017
```

Create `backend/.env` from `backend/.env.example`:

```text
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=medical_imaging_portal
```

Collections used by the API:

- `scans`
- `reports`
- `users`
- `doctorRemarks`

If MongoDB is not configured or unavailable, the backend falls back to `backend/data/portal_db.json` so the project can still run for demos.
