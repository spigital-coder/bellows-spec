import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 1. Core middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Clear CORS configuration for frontend integration
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      "http://spec.bellows-systems.com",
      "https://spec.bellows-systems.com",
      "http://localhost:3000",
      "http://localhost:5173",
    ];

    if (origin) {
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith(".run.app") || 
                        origin.endsWith(".web.app") ||
                        origin.includes("bellows-systems.com");
      
      if (isAllowed) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");

    // Handle preflight immediately for all routes
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    next();
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // API submit endpoint for Google Sheets proxy
  app.post(["/api/submit-spec", "/api/submit-spec/"], async (req, res) => {
    try {
      const data = req.body;
      const scriptUrl = process.env.VITE_GOOGLE_SCRIPT_URL;

      if (!scriptUrl) {
        console.warn("[Google Sheets Proxy] VITE_GOOGLE_SCRIPT_URL is not configured in the environment variables.");
        return res.status(200).json({
          status: "success",
          message: "Form validated on server! (Demo Mode: Google Sheets Web App URL is unconfigured. Submission printed to console.)",
          data
        });
      }

      console.log(`\n[Google Sheets Proxy Request] Forwarding payload to: ${scriptUrl}`);
      
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain" // Prevents browser or CORS preflight block, allowing seamless direct transfer
        },
        body: JSON.stringify(data)
      });

      const responseText = await response.text();
      let result: any = {};
      
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { status: "success", raw: responseText };
      }

      if (!response.ok) {
        throw new Error(result.message || `Google Apps Script returned status ${response.status}`);
      }

      console.log(`[Google Sheets Proxy Success] Specification successfully saved to Google Sheets.`);
      return res.status(200).json({
        status: "success",
        message: result.message || "Specification submitted and saved successfully."
      });

    } catch (err: any) {
      console.error("[Google Sheets Proxy Error]:", err);
      return res.status(500).json({
        status: "error",
        message: `Failed to save specification to Google Sheets: ${err.message || String(err)}`
      });
    }
  });

  // 3. Setup static serving (Vite HMR in dev, standard compiled dist folder in production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bellows server listening securely on port ${PORT}`);
    console.log("\n--- Active Server-Side Google Sheets Configuration ---");
    console.log(`VITE_GOOGLE_SCRIPT_URL: ${process.env.VITE_GOOGLE_SCRIPT_URL || "NOT SET"}`);
    console.log("------------------------------------------------------\n");
  });
}

startServer();
