import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Submit to Google Sheets
  app.post("/api/submit-spec", async (req, res) => {
    try {
      const data = req.body;
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

      if (!spreadsheetId || !credentialsJson) {
        console.warn("Google Sheets configuration missing. Logging data to console instead.");
        console.log("Specification Data:", JSON.stringify(data, null, 2));
        return res.status(200).json({ 
          status: "simulated", 
          message: "Configuration missing. Data logged to server console.",
          data: data 
        });
      }

      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(credentialsJson),
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
        data.fabricDetails?.dimA,
        data.fabricDetails?.dimB,
        data.fabricDetails?.dimC,
        data.fabricDetails?.clampBarWidth,
        data.fabricDetails?.overallBeltWidth,
        data.fabricDetails?.cornerRadius,
        data.ductInfo?.dimD,
        data.ductInfo?.dimW,
        data.ductInfo?.widthBetweenClamps,
        data.ductInfo?.flange,
        data.ductInfo?.ductThickness,
        data.ductInfo?.ductMaterial,
        data.design?.pressure,
        data.design?.temperature,
        data.movements?.axialCompression,
        data.movements?.axialExpansion,
        data.movements?.lateral,
        data.quantity,
        data.applicationNotes,
        selectedFeatures
      ];

      // Check if sheet is empty by getting first row
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A1:A1",
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Sheet is empty, add headers first
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Sheet1!A1",
          valueInputOption: "RAW",
          requestBody: {
            values: [headers, row],
          },
        });
      } else {
        // Appending entry
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Sheet1!A1",
          valueInputOption: "RAW",
          requestBody: {
            values: [row],
          },
        });
      }

      res.status(200).json({ status: "success", message: "Successfully saved to Google Sheets" });
    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
      res.status(500).json({ status: "error", message: "Failed to save data" });
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
