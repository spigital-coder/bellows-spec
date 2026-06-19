import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS middleware: allow cross-origin requests from external web servers/hosts (e.g., spec.bellows-systems.com)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API Route: Submit directly to Google Sheets
  app.post("/api/submit-spec", async (req, res) => {
    try {
      const data = req.body;
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

      if (!spreadsheetId || !credentialsJson) {
        console.error("Google Sheets configuration is missing (GOOGLE_SHEET_ID or GOOGLE_SERVICE_ACCOUNT_JSON is not set). Data logged:", data);
        return res.status(400).json({ 
          status: "error", 
          message: "Google Sheets configuration (GOOGLE_SHEET_ID or GOOGLE_SERVICE_ACCOUNT_JSON) is missing from server env. Please check your system settings."
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

      // Generate localized date/time; prefer client's regional value or default to US Central Time
      const timestamp = data.submissionDate || new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });

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

      res.status(200).json({ status: "success", message: "Successfully saved to Google Sheets" });
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
