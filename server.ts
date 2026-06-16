import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import nodemailer from "nodemailer";

async function sendSpecEmail(data: any) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";
  const from = process.env.SMTP_FROM || "no-reply@bellows-systems.com";

  const selectedFeatures = Object.entries(data.optionalFeatures || {})
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
    .join(', ') || 'None selected';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Fabric Expansion Joints - Enquiry</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; background-color: #f8fafc; padding: 20px; margin: 0; }
        .container { max-width: 650px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .header { background-color: #0f172a; padding: 24px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #ff3b30; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
        .section { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
        .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #012e67; margin-bottom: 14px; border-bottom: 2px solid #f1f5f9; padding-bottom: 4px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { margin-bottom: 8px; }
        .label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.02em; }
        .value { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px; }
        .full-width { grid-column: span 2; }
        .features { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; color: #b45309; }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fabric Expansion Joint Enquiry Specs</h1>
          <p>Submitted via Joint Configurator on ${new Date().toLocaleString()}</p>
        </div>
        
        <!-- Contact Details -->
        <div class="section">
          <div class="section-title" style="color: #ff3b30;">Contact Information</div>
          <div class="grid">
            <div class="field"><div class="label">Contact Name</div><div class="value">${data.contactDetails?.name || 'N/A'}</div></div>
            <div class="field"><div class="label">Email Address</div><div class="value">${data.contactDetails?.email || 'N/A'}</div></div>
            <div class="field"><div class="label">Phone Number</div><div class="value">${data.contactDetails?.phone || 'N/A'}</div></div>
            <div class="field"><div class="label">Company Name</div><div class="value">${data.contactDetails?.companyName || 'N/A'}</div></div>
            <div class="field"><div class="label">Country</div><div class="value">${data.contactDetails?.country || 'N/A'}</div></div>
          </div>
        </div>

        <!-- Configuration Summary -->
        <div class="section">
          <div class="section-title">Joint Configuration</div>
          <div class="grid">
            <div class="field"><div class="label">Joint Style</div><div class="value">${data.selectedStyle || 'N/A'}</div></div>
            <div class="field"><div class="label">Bellow Shape</div><div class="value" style="text-transform: capitalize;">${data.shape || 'N/A'}</div></div>
            <div class="field"><div class="label">Quantity Required</div><div class="value">${data.quantity || '1'}</div></div>
          </div>
        </div>

        <!-- Fabric Details -->
        <div class="section">
          <div class="section-title">Fabric Details</div>
          <div class="grid">
            <div class="field"><div class="label">"A" Inside Belt Dim. / Inside Diameter (in)</div><div class="value">${data.fabricDetails?.dimA || 'N/A'}</div></div>
            <div class="field"><div class="label">"B" Inside Belt Dim. (in)</div><div class="value">${data.fabricDetails?.dimB || 'N/A'}</div></div>
            <div class="field"><div class="label">"C" Width Between Clamp Bars (in)</div><div class="value">${data.fabricDetails?.dimC || 'N/A'}</div></div>
            <div class="field"><div class="label">Width of Clamp Bars (in)</div><div class="value">${data.fabricDetails?.clampBarWidth || 'N/A'}</div></div>
            <div class="field"><div class="label">Overall Belt Width (in)</div><div class="value">${data.fabricDetails?.overallBeltWidth || 'N/A'}</div></div>
            <div class="field"><div class="label">Corner Radius (in)</div><div class="value">${data.fabricDetails?.cornerRadius || 'N/A'}</div></div>
          </div>
        </div>

        <!-- Duct Info -->
        <div class="section">
          <div class="section-title">Duct Info</div>
          <div class="grid">
            <div class="field"><div class="label">"D" (One Side or Dia.) (in)</div><div class="value">${data.ductInfo?.dimD || 'N/A'}</div></div>
            <div class="field"><div class="label">"W" Other Side (in)</div><div class="value">${data.ductInfo?.dimW || 'N/A'}</div></div>
            <div class="field"><div class="label">Width Between Clamps (in)</div><div class="value">${data.ductInfo?.widthBetweenClamps || 'N/A'}</div></div>
            <div class="field"><div class="label">Flange (If Applicable) (in)</div><div class="value">${data.ductInfo?.flange || 'N/A'}</div></div>
            <div class="field"><div class="label">Duct Thickness (in)</div><div class="value">${data.ductInfo?.ductThickness || 'N/A'}</div></div>
            <div class="field"><div class="label">Duct Material</div><div class="value">${data.ductInfo?.ductMaterial || 'N/A'}</div></div>
          </div>
        </div>

        <!-- Design & Movements -->
        <div class="section">
          <div class="section-title">Design Parameters & Movements</div>
          <div class="grid">
            <div class="field"><div class="label">P, Pressure</div><div class="value">${data.design?.pressure || 'N/A'}</div></div>
            <div class="field"><div class="label">T, Temperature</div><div class="value">${data.design?.temperature || 'N/A'}</div></div>
            <div class="field"><div class="label">Axial Compression (in)</div><div class="value">${data.movements?.axialCompression || 'N/A'}</div></div>
            <div class="field"><div class="label">Axial Expansion (in)</div><div class="value">${data.movements?.axialExpansion || 'N/A'}</div></div>
            <div class="field"><div class="label">Lateral (in)</div><div class="value">${data.movements?.lateral || 'N/A'}</div></div>
          </div>
        </div>

        <!-- Options & Notes -->
        <div class="section">
          <div class="section-title">Optional Features & Notes</div>
          <div class="field">
            <div class="label">Selected Accessories / Options</div>
            <div class="value features">${selectedFeatures}</div>
          </div>
          <div class="field" style="margin-top: 12px;">
            <div class="label">Application / Engineering Notes</div>
            <div class="value" style="font-weight: normal; white-space: pre-line; background: #f8fafc; border-radius: 8px; padding: 12px; border: 1px solid #e2e8f0;">${data.applicationNotes || 'No notes provided.'}</div>
          </div>
        </div>

        <div class="footer">
          This specification request was generated automatically through the online configuration panel.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!host || !user || !pass) {
    console.log("---------------- SMTP NOT CONFIGURED ----------------");
    console.log("If SMTP_HOST, SMTP_USER, and SMTP_PASS are set in env, the email would be sent.");
    console.log("Planned Target: webmaster@bellows-systems.com");
    console.log("Subject: Fabric Expansion Joints -Enquiry");
    console.log(`Contact fields: ${data.contactDetails?.name} <${data.contactDetails?.email}> - Co: ${data.contactDetails?.companyName}`);
    console.log("-----------------------------------------------------");
    return { sent: false, info: "SMTP details missing. Simulated delivery printed above." };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  const mailOptions = {
    from,
    to: "webmaster@bellows-systems.com",
    subject: "Fabric Expansion Joints -Enquiry",
    html: htmlContent
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email Sent Successfully to webmaster@bellows-systems.com:", info.messageId);
  return { sent: true, info: info };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Submit to Google Sheets and Send Webmaster Email Inquiry Notification
  app.post("/api/submit-spec", async (req, res) => {
    try {
      const data = req.body;
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

      // Send the high priority email immediately
      let emailResult;
      try {
        emailResult = await sendSpecEmail(data);
      } catch (emailErr) {
        console.error("Failed to send webmaster notification email:", emailErr);
        emailResult = { sent: false, error: (emailErr as Error).message };
      }

      if (!spreadsheetId || !credentialsJson) {
        console.warn("Google Sheets configuration missing. Logging data to console.");
        return res.status(200).json({ 
          status: "success", 
          message: "Technical specification submitted successfully.",
          email: emailResult,
          note: "Google Sheets configuration was missing; data persisted over email only."
        });
      }

      let parsedCredentials;
      try {
        if (typeof credentialsJson === "string") {
          const trimmed = credentialsJson.trim();
          if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            parsedCredentials = JSON.parse(trimmed);
          } else if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            // Unwrapping double-serialized JSON strings
            const inner = JSON.parse(trimmed);
            parsedCredentials = typeof inner === "string" ? JSON.parse(inner) : inner;
          } else {
            throw new Error("JSON structure is malformed or lacks typical braces.");
          }
        } else {
          parsedCredentials = credentialsJson;
        }
      } catch (parseError: any) {
        console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON env variable:", parseError);
        return res.status(400).json({
          status: "error",
          message: `Google Sheets configuration format is invalid: ${parseError.message || parseError}`
        });
      }

      const auth = new google.auth.GoogleAuth({
        credentials: parsedCredentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // Formatted date
      const timestamp = new Date().toLocaleString();

      // Format checkboxes: only show checked items
      const selectedFeatures = Object.entries(data.optionalFeatures || {})
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
        .join(', ');

      // Headers for the sheet
      const headers = [
        "Timestamp",
        "Style",
        "Shape",
        "Contact Name",
        "Contact Phone",
        "Contact Email",
        "Company Name",
        "Country",
        "Dim A",
        "Dim B",
        "Dim C",
        "Clamp Bar Width",
        "Overall Belt Width",
        "Corner Radius",
        "Duct Dim D",
        "Duct Dim W",
        "Width Between Clamps",
        "Flange",
        "Duct Thickness",
        "Duct Material",
        "Pressure",
        "Temperature",
        "Axial Compression",
        "Axial Expansion",
        "Lateral Movement",
        "Quantity",
        "Notes",
        "Optional Features"
      ];

      // Flatten the data for Google Sheets row
      const row = [
        timestamp,
        data.selectedStyle,
        data.shape,
        data.contactDetails?.name || "",
        data.contactDetails?.phone || "",
        data.contactDetails?.email || "",
        data.contactDetails?.companyName || "",
        data.contactDetails?.country || "",
        data.fabricDetails?.dimA || "",
        data.fabricDetails?.dimB || "",
        data.fabricDetails?.dimC || "",
        data.fabricDetails?.clampBarWidth || "",
        data.fabricDetails?.overallBeltWidth || "",
        data.fabricDetails?.cornerRadius || "",
        data.ductInfo?.dimD || "",
        data.ductInfo?.dimW || "",
        data.ductInfo?.widthBetweenClamps || "",
        data.ductInfo?.flange || "",
        data.ductInfo?.ductThickness || "",
        data.ductInfo?.ductMaterial || "",
        data.design?.pressure || "",
        data.design?.temperature || "",
        data.movements?.axialCompression || "",
        data.movements?.axialExpansion || "",
        data.movements?.lateral || "",
        data.quantity || "",
        data.applicationNotes || "",
        selectedFeatures
      ];

      // To ensure any newly added fields (like contact details or quantity) are correctly represented in the Google Sheet 
      // even if the spreadsheet was already created previously, we dynamically write or update the header row (Row 1) with 
      // the complete set of headers on every submission. This extends/updates columns without clearing existing row data under it.
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: "Sheet1!A1",
          valueInputOption: "RAW",
          requestBody: {
            values: [headers],
          },
        });
      } catch (headerErr) {
        console.warn("Could not dynamically update header row (Sheet1!A1):", headerErr);
      }

      // Appending the filled spec entry row at the end of the sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A1",
        valueInputOption: "RAW",
        requestBody: {
          values: [row],
        },
      });

      res.status(200).json({ status: "success", message: "Successfully saved to Google Sheets and sent email alert", email: emailResult });
    } catch (error: any) {
      console.error("Error submitting spec or updating sheets:", error);
      const errorMsg = error?.message || String(error);
      res.status(500).json({ 
        status: "error", 
        message: `Failed to save specification to Google Sheets: ${errorMsg}` 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
