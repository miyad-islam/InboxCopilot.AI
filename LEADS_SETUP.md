# InboxCopilot AI — Lead Collection & Automation Guide

Your landing page has a **Vercel Serverless Backend (`/api/submit-lead`)** that automatically receives every submission and can log it to **Google Sheets** and send instant alerts to your **Gmail**.

---

## ⚡ Google Sheets + Gmail Automation (Takes 2 Minutes)

We have created the complete script in [`google_apps_script.js`](file:///c:/Users/Dark_Knight/Desktop/landing%20page%20for%20vercle/google_apps_script.js).

### Step 1: Open Google Sheets
1. Go to [sheets.new](https://sheets.new) to create a new blank Google Sheet.
2. Name your sheet: `InboxCopilot AI Leads`.

### Step 2: Open Apps Script
1. In Google Sheets top menu, click **Extensions > Apps Script**.
2. Delete everything inside the editor.
3. Open [`google_apps_script.js`](file:///c:/Users/Dark_Knight/Desktop/landing%20page%20for%20vercle/google_apps_script.js), copy the entire code, and paste it into Apps Script.
4. Replace `YOUR_EMAIL@gmail.com` near the top of the file with **your real Gmail address**.

### Step 3: Deploy as Web App
1. In the top right corner of Apps Script, click **Deploy > New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `InboxCopilot Lead Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(⚠️ IMPORTANT: Must be set to Anyone so Vercel can deliver leads)*
4. Click **Deploy**.
5. Click **Authorize access**, choose your Google account, click *Advanced > Go to Untitled project (unsafe)*, and click **Allow**.
6. **Copy the Web App URL** (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

### Step 4: Add to Vercel
1. Open your **Vercel Dashboard** -> Project -> **Settings** -> **Environment Variables**.
2. Add a new variable:
   - **Key**: `GOOGLE_SHEET_WEBHOOK`
   - **Value**: `[Paste your Web App URL here]`
3. Click **Save** and trigger a redeploy (or push a commit).

---

## 🎯 What Happens Automatically After Setup:

1. **In Your Google Sheet**:
   - A new row is added immediately with: `Date`, `Lead ID`, `Owner Name`, `Facebook Page`, `Category`, `Monthly Inquiries`, `WhatsApp/Email`, `Sales Challenge`.
2. **In Your Gmail**:
   - You receive an instant email notification with all the lead's information and a direct link to open the sheet.
3. **In the Customer's Email**:
   - If the customer provided an email address, they automatically receive a personalized confirmation email welcoming them to the Founding Cohort with their unique Request ID.
