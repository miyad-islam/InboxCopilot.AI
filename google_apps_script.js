/**
 * ==============================================================================
 * INBOXCOPILOT AI — GOOGLE APPS SCRIPT FOR GOOGLE SHEETS & GMAIL AUTOMATION
 * ==============================================================================
 * 
 * WHAT THIS SCRIPT DOES:
 * 1. Automatically logs every incoming lead into your Google Sheet.
 * 2. Sends an instant lead notification alert to YOUR Gmail.
 * 3. Sends a stunning, premium HTML confirmation email to the customer.
 * 
 * HOW TO SET THIS UP (Takes 2 minutes):
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click "Extensions" > "Apps Script" in the top menu.
 * 3. Delete any code in Code.gs and PASTE THIS ENTIRE SCRIPT.
 * 4. Replace 'YOUR_EMAIL@gmail.com' on line 32 with your actual Gmail address.
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
    const sellerName = data.sellerName || "Store Owner";
    const fbPage = data.fbPage || "Your Facebook Page";
    const bizCategory = data.bizCategory || "E-Commerce";
    const monthlyConv = data.monthlyConv || "Unspecified";
    const contactInfo = data.contactInfo || "N/A";
    const salesProblem = data.salesProblem || "General Optimization";

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

    // 3. Send Premium, Branded Confirmation Email to Customer (if contact is an email)
    if (SEND_CUSTOMER_CONFIRMATION && contactInfo.includes("@")) {
      const customerSubject = `Analysis Confirmed: Your AI Sales Audit for ${fbPage} (#${leadId})`;
      
      // Plain-text Fallback
      const customerPlainText = `
Hi ${sellerName},

Thank you for requesting your Free AI Conversation Audit for "${fbPage}" on InboxCopilot AI!

Your application has been confirmed in our Founding Member Cohort (Request ID: #${leadId}).

WHAT WE ARE PREPARING FOR YOUR STORE:
1. Category-Specific Messenger Drop-off Analysis (${bizCategory})
2. Custom Closing Response Scripts for price objections & delayed follow-ups
3. Actionable playbooks to recover lost sales opportunities

Our team is reviewing your inbox profile and will deliver your customized audit playbook via WhatsApp / Email.

Need immediate support? Reply directly to this email or visit our live demo:
https://inbox-copilot-ai.vercel.app

Best regards,
The InboxCopilot AI Team
      `.trim();

      // Premium HTML Email Template
      const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AI Sales Audit Request is Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080c16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080c16; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Top Gradient Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #10b981 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 20px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Brand Logo -->
                    <div style="display: inline-block; vertical-align: middle;">
                      <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                        InboxCopilot<span style="color: #38bdf8;">.AI</span>
                      </span>
                    </div>
                  </td>
                  <td align="right">
                    <!-- Badge -->
                    <span style="display: inline-block; background-color: rgba(99, 102, 241, 0.18); border: 1px solid rgba(99, 102, 241, 0.4); color: #c7d2fe; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Founding Cohort
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding: 10px 36px 24px;">
              <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #6ee7b7; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 14px;">
                ✓ Request Confirmed &amp; Queued
              </div>
              <h1 style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                Your AI Shop Audit is in Progress
              </h1>
              <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                Hi <strong>${sellerName}</strong>, thank you for submitting <strong>${fbPage}</strong>. Our analysis team has received your shop profile and is reviewing your conversational sales flow.
              </p>
            </td>
          </tr>

          <!-- Lead Summary Box -->
          <tr>
            <td style="padding: 0 36px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b1120; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px;">
                <tr>
                  <td style="padding: 6px 0;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Audit Reference ID</span>
                    <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #38bdf8; margin-top: 2px;">#${leadId}</div>
                  </td>
                  <td style="padding: 6px 0;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Target Store</span>
                    <div style="font-size: 13px; font-weight: 600; color: #f8fafc; margin-top: 2px;">${fbPage}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Category</span>
                    <div style="font-size: 13px; color: #cbd5e1; margin-top: 2px;">${bizCategory}</div>
                  </td>
                  <td style="padding: 6px 0; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Priority Status</span>
                    <div style="font-size: 13px; font-weight: 700; color: #10b981; margin-top: 2px;">● Top 50 Priority Queue</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What Happens Next / Roadmap -->
          <tr>
            <td style="padding: 0 36px 28px;">
              <h3 style="margin: 0 0 14px; font-size: 15px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">
                What our team is analyzing for you:
              </h3>
              
              <!-- Step 1 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                <tr>
                  <td width="28" valign="top">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background-color: rgba(99, 102, 241, 0.25); color: #a5b4fc; font-size: 11px; font-weight: 700; text-align: center; line-height: 22px;">1</div>
                  </td>
                  <td style="padding-left: 10px;">
                    <div style="font-size: 13px; font-weight: 700; color: #ffffff;">Messenger Sales Bottlenecks</div>
                    <div style="font-size: 12px; color: #94a3b8; line-height: 1.4; margin-top: 2px;">We examine common reasons Bangladeshi buyers go silent after inquiring about price or delivery.</div>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                <tr>
                  <td width="28" valign="top">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background-color: rgba(56, 189, 248, 0.25); color: #7dd3fc; font-size: 11px; font-weight: 700; text-align: center; line-height: 22px;">2</div>
                  </td>
                  <td style="padding-left: 10px;">
                    <div style="font-size: 13px; font-weight: 700; color: #ffffff;">Custom Objection Closing Scripts</div>
                    <div style="font-size: 12px; color: #94a3b8; line-height: 1.4; margin-top: 2px;">Tailored Bangla &amp; Banglish reply templates designed to close high-intent leads on the spot.</div>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="28" valign="top">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.25); color: #6ee7b7; font-size: 11px; font-weight: 700; text-align: center; line-height: 22px;">3</div>
                  </td>
                  <td style="padding-left: 10px;">
                    <div style="font-size: 13px; font-weight: 700; color: #ffffff;">Personalized Action Report &amp; Beta Invite</div>
                    <div style="font-size: 12px; color: #94a3b8; line-height: 1.4; margin-top: 2px;">Delivered directly to your provided WhatsApp / Email with Founding Member pricing locked in.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Call to Action Banner -->
          <tr>
            <td style="padding: 0 36px 32px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.10) 100%); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">Want to explore how Copilot works in the meantime?</div>
                    <div style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Test our interactive sales scanner with real Messenger simulated scenarios.</div>
                    <a href="https://inbox-copilot-ai.vercel.app/#demo" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 8px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
                      Launch Interactive Demo &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #080c16; padding: 24px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #64748b;">
                You received this email because you requested an early access AI audit for <strong>${fbPage}</strong>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; 2026 InboxCopilot AI. Built specifically for conversational commerce sellers.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();

      try {
        MailApp.sendEmail({
          to: contactInfo.trim(),
          subject: customerSubject,
          body: customerPlainText,
          htmlBody: customerHtml,
          name: "InboxCopilot AI"
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

// Optional verification endpoint
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "InboxCopilot AI Lead Collector Webhook"
  })).setMimeType(ContentService.MimeType.JSON);
}
