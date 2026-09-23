# Google Cloud Run Deployment Guide 🚀

This guide explains how to deploy **Python Quest MVP** to **Google Cloud Run** using the CLI (Option 2).

---

## Prerequisites

1. A Google Cloud account with an active project (sign up / log in at [console.cloud.google.com](https://console.cloud.google.com)).
2. Your Supabase project URL and anon key:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Method 1: Via Google Cloud Shell (Recommended — No Local Installation)

1. Open [console.cloud.google.com](https://console.cloud.google.com).
2. Click the **Cloud Shell** icon (`>_` in the top right header).
3. Run the following command (replace with your Supabase values):

```bash
gcloud run deploy python-quest \
  --source https://github.com/blskumar/PythonQuest.git \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co",NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

4. When prompted to enable APIs (e.g. `run.googleapis.com`, `cloudbuild.googleapis.com`), press `y` to allow.
5. In ~2 minutes, the terminal outputs your live public HTTPS URL:
   ```text
   Service [python-quest] has been deployed and is serving 100 percent of traffic.
   Service URL: https://python-quest-xxxxxx-uc.a.run.app
   ```

---

## Method 2: Via Local Terminal (If Google Cloud SDK is installed)

1. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   ```

2. Set your active Google Cloud Project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. Deploy from the project root:
   ```bash
   gcloud run deploy python-quest \
     --source . \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated \
     --port 8080 \
     --set-env-vars NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co",NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## Automated CI/CD Trigger (Optional)

If you want every `git push origin main` to automatically deploy to Cloud Run:
```bash
gcloud builds triggers create github \
  --repo-name=PythonQuest \
  --repo-owner=blskumar \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```
