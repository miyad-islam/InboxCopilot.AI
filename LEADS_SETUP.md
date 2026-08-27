# InboxCopilot AI — Lead Collection & Automation Guide

Your landing page now has a **Vercel Serverless Backend (`/api/submit-lead`)** connected to your Early Access Form.

---

## ⚡ How It Works Now

1. **When a Visitor Submits the Form:**
   - The form sends all data (`Seller Name`, `Facebook Page`, `Category`, `Monthly Inquiries`, `WhatsApp/Email`, `Sales Challenge`, `Timestamp`) to `/api/submit-lead`.
   - The API generates a unique Lead ID (e.g. `#IC-8A2F9`).
   - The visitor sees an interactive confirmation modal with their Reference ID.
   - The modal provides an **instant WhatsApp priority handshake button** pre-filled with their store details so they can message you immediately.
   - The lead is also safely preserved in browser `localStorage`.

---

## 📬 Instant Email & Google Sheets Notifications (Optional & Free)

If you want every lead delivered to your personal **Email Inbox** or **Google Sheet**, follow these simple steps in Vercel:

### Option A: Email Delivery via Web3Forms (Free, 1 Minute)
1. Go to [web3forms.com](https://web3forms.com) and enter your email address to get a free Access Key.
2. Go to your **Vercel Dashboard** -> Project Settings -> **Environment Variables**.
3. Add:
   - **Key**: `WEB3FORMS_ACCESS_KEY`
   - **Value**: `your-access-key-here`
4. Redeploy. Now, every submission lands straight in your email!

---

### Option B: Automatic Google Sheets Logging (Free)
1. Create a Google Sheet with columns: `Date`, `Lead ID`, `Owner Name`, `Facebook Page`, `Category`, `Volume`, `Contact`, `Problem`.
2. In Google Sheets, click **Extensions > Apps Script** and deploy a web app with a `doPost(e)` script.
3. In Vercel Environment Variables, add:
   - **Key**: `GOOGLE_SHEET_WEBHOOK`
   - **Value**: `https://script.google.com/macros/s/your-script-id/exec`
4. All incoming leads will automatically create new rows in your private Google Sheet in real-time!

---

### Option C: Telegram / Discord / Zapier Webhook
You can also set:
- **Key**: `LEAD_WEBHOOK_URL`
- **Value**: `your-discord-or-zapier-webhook-url`
