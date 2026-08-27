/**
 * ==============================================================================
 * INBOXCOPILOT AI — GOOGLE APPS SCRIPT FOR GOOGLE SHEETS & GMAIL AUTOMATION
 * ==============================================================================
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Automatically logs every incoming lead into your Google Sheet.
 * 2. Sends an instant lead notification alert to YOUR Gmail.
 * 3. (Optional) Sends an automated confirmation email to the customer.
 * 
 * HOW TO SET THIS UP (Takes 2 minutes):
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click "Extensions" > "Apps Script" in the top menu.
 * 3. Delete any code in Code.gs and PASTE THIS ENTIRE SCRIPT.
 * 4. Replace 'YOUR_EMAIL@gmail.com' on line 20 with your actual Gmail address.
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Description: "InboxCopilot Lead Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL: Must be "Anyone" so Vercel can post to it)
 * 8. Click "Deploy", authorize permissions, and COPY the Web App URL.
 * 9. In your Vercel Dashboard -> Environment Variables:
 *    - Add key: GOOGLE_SHEET_WEBHOOK
 *    - Value: [Your copied Web App URL]
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------------------
const OWNER_EMAIL = "YOUR_EMAIL@gmail.com"; // <-- PUT YOUR GMAIL HERE
const SEND_CUSTOMER_CONFIRMATION = true;    // Set to false if you don't want auto-reply

// ------------------------------------------------------------------------------
// POST HANDLER
// ------------------------------------------------------------------------------
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Setup headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submitted Date",
        "Lead ID",
        "Owner Name",
        "Facebook Page / Store",
        "Category",
        "Monthly Volume",
        "WhatsApp / Email",
        "Key Sales Challenge"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Format fields
    const submittedAt = data.submittedAt || new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    const leadId = data.leadId || "IC-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    const sellerName = data.sellerName || "N/A";
    const fbPage = data.fbPage || "N/A";
    const bizCategory = data.bizCategory || "N/A";
    const monthlyConv = data.monthlyConv || "N/A";
    const contactInfo = data.contactInfo || "N/A";
    const salesProblem = data.salesProblem || "N/A";

    // 1. Append Row to Google Sheet
    sheet.appendRow([
      submittedAt,
      leadId,
      sellerName,
      fbPage,
      bizCategory,
      monthlyConv,
      contactInfo,
      salesProblem
    ]);

    // 2. Send Lead Notification Email to Shop Owner (You)
    if (OWNER_EMAIL && OWNER_EMAIL !== "YOUR_EMAIL@gmail.com") {
      const ownerSubject = `🚀 [New Lead] ${sellerName} — ${fbPage} (#${leadId})`;
      const ownerBody = `
=========================================
⚡ NEW EARLY ACCESS LEAD RECEIVED
=========================================

📌 Lead Reference ID: #${leadId}
👤 Owner Name: ${sellerName}
🛍️ Facebook Page / Store: ${fbPage}
🏷️ Business Category: ${bizCategory}
💬 Monthly Inquiries: ${monthlyConv}
📱 WhatsApp / Email: ${contactInfo}
⚠️ Main Sales Challenge: ${salesProblem}
🕒 Submitted At: ${submittedAt}

Open Google Sheet to view all leads:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
      `;
      
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: ownerSubject,
        body: ownerBody
      });
    }

    // 3. Optional: Send Auto-Reply Confirmation to Customer (if contact is an email)
    if (SEND_CUSTOMER_CONFIRMATION && contactInfo.includes("@")) {
      const customerSubject = `Your Free AI Shop Analysis Request is Confirmed (#${leadId}) — InboxCopilot AI`;
      const customerBody = `
Hi ${sellerName},

Thank you for requesting a Free AI Conversation Audit for "${fbPage}"!

We have successfully logged your application in our Founding Member Cohort (Request ID: #${leadId}).

Here is what our team is currently preparing for your shop:
1. Category-specific conversation bottleneck breakdown (${bizCategory})
2. Custom closing response scripts for price objections & delayed follow-ups
3. Actionable recommendations to recover lost Messenger sales

Our team will reach out to you directly with your personalized analysis summary and private beta invitation.

If you have any urgent questions, feel free to reply directly to this email or reach us on WhatsApp.

Best regards,
Founder & The InboxCopilot Team
https://inbox-copilot-ai.vercel.app
      `;

      try {
        MailApp.sendEmail({
          to: contactInfo.trim(),
          subject: customerSubject,
          body: customerBody
        });
      } catch (custMailErr) {
        console.warn("Could not send customer auto-reply:", custMailErr);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      leadId: leadId,
      message: "Lead logged and notification dispatched successfully!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Optional GET handler to verify the script is online
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "InboxCopilot AI Lead Collector Webhook"
  })).setMimeType(ContentService.MimeType.JSON);
}
