// Vercel Serverless Function — Lead Submission & Notification Handler
// Endpoint: POST /api/submit-lead

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Please use POST.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      sellerName,
      fbPage,
      bizCategory,
      monthlyConv,
      contactInfo,
      salesProblem
    } = body || {};

    // Validate required fields
    if (!sellerName || !fbPage || !contactInfo) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Seller Name, Facebook Page, and Contact Info.'
      });
    }

    const timestamp = new Date().toISOString();
    const leadId = 'IC-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const leadData = {
      leadId,
      sellerName: String(sellerName).trim(),
      fbPage: String(fbPage).trim(),
      bizCategory: String(bizCategory || 'E-Commerce').trim(),
      monthlyConv: String(monthlyConv || 'Unspecified').trim(),
      contactInfo: String(contactInfo).trim(),
      salesProblem: String(salesProblem || 'General Optimization').trim(),
      submittedAt: timestamp,
      source: 'InboxCopilot Landing Page'
    };

    console.log('[LEAD RECEIVED]', JSON.stringify(leadData));

    // Optional: Forward to Webhook (e.g. Discord, Telegram, Google Sheets, Make.com, Zapier)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });
      } catch (webhookErr) {
        console.warn('[WEBHOOK ERROR]', webhookErr);
      }
    }

    // Optional: Send via Web3Forms if ACCESS_KEY configured
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3Key) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `🚀 New Early Access Lead: ${leadData.sellerName} (${leadData.fbPage})`,
            from_name: 'InboxCopilot Lead Alert',
            to_name: 'InboxCopilot Team',
            ...leadData
          })
        });
      } catch (emailErr) {
        console.warn('[EMAIL NOTIFICATION ERROR]', emailErr);
      }
    }

    // Success response
    return res.status(200).json({
      success: true,
      leadId,
      message: `Audit request confirmed for ${leadData.sellerName}!`,
      data: {
        leadId,
        sellerName: leadData.sellerName,
        fbPage: leadData.fbPage,
        bizCategory: leadData.bizCategory,
        contactInfo: leadData.contactInfo,
        submittedAt: timestamp
      }
    });

  } catch (error) {
    console.error('[API SUBMIT ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while saving your lead request.'
    });
  }
}
