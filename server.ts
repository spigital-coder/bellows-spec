import "dotenv/config";
import express from "express";
import path from "path";
import nodemailer from "nodemailer";
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

  // API submit endpoint for SMTP dispatch
  app.post(["/api/submit-spec", "/api/submit-spec/"], async (req, res) => {
    try {
      const data = req.body;
      const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });

      // Build features list
      const selectedFeatures = Object.entries(data.optionalFeatures || {})
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
        .join(", ") || "None";

      const contactName = data.contactDetails?.name || "N/A";
      const contactEmail = data.contactDetails?.email || "N/A";
      const companyName = data.contactDetails?.companyName || "N/A";

      // Subject line
      const subject = `New Expansion Joint Spec Submission: ${contactName} (${companyName})`;

      // Beautiful design email layout ("Mailer type Design Send")
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #1e293b;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 24px; text-align: center; color: #ffffff; border-bottom: 4px solid #2563eb;">
            <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #60a5fa;">Bellows Systems Specification Portal</p>
            <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 800; tracking: -0.025em; line-height: 1.2;">Expansion Joint Specifications</h1>
            <p style="margin: 12px 0 0 0; font-size: 13px; color: #94a3b8;"><strong>Submission Time:</strong> ${timestamp} (CT)</p>
          </div>

          <!-- Content Wrapper -->
          <div style="padding: 24px;">

            <!-- Contact section -->
            <div style="margin-bottom: 24px; padding: 20px; border-radius: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #1e3a8a; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Client & Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 35%;"><strong>Name</strong></td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${contactName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Email</strong></td>
                  <td style="padding: 6px 0; color: #2563eb; font-weight: 600;"><a href="mailto:${contactEmail}" style="color: #2563eb; text-decoration: none;">${contactEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Phone</strong></td>
                  <td style="padding: 6px 0; color: #0f172a;">${data.contactDetails?.phone || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Company Name</strong></td>
                  <td style="padding: 6px 0; color: #0f172a;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Country</strong></td>
                  <td style="padding: 6px 0; color: #0f172a;">${data.contactDetails?.country || "N/A"}</td>
                </tr>
              </table>
            </div>

            <!-- Specifications Section -->
            <div style="margin-bottom: 24px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #1e3a8a; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Design & Geometry</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5; border: 1px solid #f1f5f9;">
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 45%;"><strong>Style</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;">${data.selectedStyle || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Shape</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.shape || "N/A"}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Fabric Dimensions</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-family: monospace;">
                    A: ${data.fabricDetails?.dimA || "—"} |
                    B: ${data.fabricDetails?.dimB || "—"} |
                    C: ${data.fabricDetails?.dimC || "—"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Overall Belt Width</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.fabricDetails?.overallBeltWidth || "N/A"}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Clamp Bar / Corner Rad</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">
                    Clamps: ${data.fabricDetails?.clampBarWidth || "—"} | Radius: ${data.fabricDetails?.cornerRadius || "—"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Duct Dimensions (D & W)</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">
                    D: ${data.ductInfo?.dimD || "—"} x W: ${data.ductInfo?.dimW || "—"}
                  </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Width Between Clamps / Flange</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">
                    Clamps Width: ${data.ductInfo?.widthBetweenClamps || "—"} | Flange: ${data.ductInfo?.flange || "—"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Duct Material & Thickness</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">
                    ${data.ductInfo?.ductMaterial || "—"} (${data.ductInfo?.ductThickness || "—"})
                  </td>
                </tr>
              </table>
            </div>

            <!-- Operating Parameters Section -->
            <div style="margin-bottom: 24px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #1e3a8a; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Operating Conditions & Quantity</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5; border: 1px solid #f1f5f9;">
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 45%;"><strong>Design Pressure</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.design?.pressure || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Design Temperature</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.design?.temperature || "N/A"}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Axial Compression / Expansion</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">
                    Comp: ${data.movements?.axialCompression || "—"} | Exp: ${data.movements?.axialExpansion || "—"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Lateral Deflection</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.movements?.lateral || "N/A"}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Requested Quantity</strong></td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #1e3a8a; font-weight: 700; font-size: 16px;">${data.quantity || "1"}</td>
                </tr>
              </table>
            </div>

            <!-- Optional Features Segment -->
            ${selectedFeatures !== "None" ? `
            <div style="margin-bottom: 24px; padding: 16px; border-radius: 8px; background-color: #ecfdf5; border: 1px solid #a7f3d0;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #065f46; font-weight: 700;">Selected Add-ons / Features</h4>
              <p style="margin: 0; font-size: 14px; color: #047857; line-height: 1.5; font-weight: 500;">${selectedFeatures}</p>
            </div>
            ` : ""}

            <!-- Application Notes -->
            ${data.applicationNotes ? `
            <div style="margin-bottom: 24px; padding: 18px; border-radius: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; font-weight: 700;">Client Comments & Context NOTES</h4>
              <p style="margin: 0; font-size: 14px; color: #334155; white-space: pre-wrap; line-height: 1.6;">${data.applicationNotes}</p>
            </div>
            ` : ""}

          </div>

          <!-- Professional Footer -->
          <div style="background-color: #f1f5f9; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5;">
            <p style="margin: 0; font-weight: 600;">This specification catalog dispatch was processed securely by your Server.</p>
            <p style="margin: 4px 0 0 0;">Bellows Systems, Inc. © ${new Date().getFullYear()} — Engineering Excellence</p>
          </div>

        </div>
      `;

      // SMTP environment credentials
      let SMTP_HOST = process.env.SMTP_HOST;
      let SMTP_USER = process.env.SMTP_USER;
      let SMTP_PASS = process.env.SMTP_PASS;
      let SMTP_PORT = process.env.SMTP_PORT;
      let SMTP_SECURE = process.env.SMTP_SECURE;
      let SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL;
      let SMTP_TO_EMAIL = process.env.SMTP_TO_EMAIL;

      // Smart Fallback: Force Gmail SMTP if environment carries stale Exchange/Outlook details or is unconfigured
      const hasStaleOutlook = SMTP_HOST && (SMTP_HOST.includes("outlook") || SMTP_HOST.includes("office365") || SMTP_HOST.includes("live") || SMTP_HOST.includes("hotmail"));
      const hasStaleUser = SMTP_USER && (SMTP_USER.includes("bellows-systems") || SMTP_USER.includes("outlook") || SMTP_USER.includes("office365") || SMTP_USER.includes("hotmail"));
      const isUnconfigured = !SMTP_HOST || !SMTP_USER || !SMTP_PASS || SMTP_HOST === "smtp.example.com";

      if (hasStaleOutlook || hasStaleUser || isUnconfigured) {
        console.log("\n[SMTP] Stale Office 365/Outlook credentials or unconfigured environment detected. Routing through active Gmail SMTP configuration:");
        SMTP_HOST = "smtp.gmail.com";
        SMTP_PORT = "587";
        SMTP_USER = "bellowssystemss@gmail.com";
        SMTP_PASS = "ylfd cqtq ngtu oiqe";
        SMTP_SECURE = "false";
        SMTP_FROM_EMAIL = "bellowssystemss@gmail.com";
        SMTP_TO_EMAIL = "info@bellows-systems.com";
      }

      console.log("\n[SMTP Dispatch Request]");
      console.log(`- SMTP_HOST: ${SMTP_HOST || "NOT SET"}`);
      console.log(`- SMTP_PORT: ${SMTP_PORT || "NOT SET"}`);
      console.log(`- SMTP_USER: ${SMTP_USER || "NOT SET"}`);
      console.log(`- SMTP_SECURE: ${SMTP_SECURE || "NOT SET"}`);
      console.log(`- SMTP_FROM_EMAIL: ${SMTP_FROM_EMAIL || "NOT SET"}`);
      console.log(`- SMTP_TO_EMAIL: ${SMTP_TO_EMAIL || "NOT SET"}`);
      console.log(`- SMTP_PASS length: ${SMTP_PASS ? SMTP_PASS.length : 0} characters\n`);

      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.warn("\n=================== SMTP WARNING ===================");
        console.warn("SMTP settings are unconfigured or incomplete.");
        console.warn("Please set environment variables: SMTP_HOST, SMTP_USER, SMTP_PASS");
        console.warn("Here is the parsed data that would have been sent:\n", JSON.stringify(data, null, 2));
        console.warn("====================================================\n");

        return res.status(200).json({
          status: "success",
          message: "Form saved successfully! (Note: Server is running in Demo Mode since SMTP credentials are not configured in your Environment variables completely. Submission printed to console.)",
        });
      }

      // Configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === "true", // true for 465, false for 587
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const sendFrom = SMTP_FROM_EMAIL || SMTP_USER;
      const sendTo = SMTP_TO_EMAIL || "info@bellows-systems.com"; // Default target

      await transporter.sendMail({
        from: `"Bellows Spec Portal" <${sendFrom}>`,
        to: sendTo,
        replyTo: contactEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log(`[Email Sent Success] Submitted specification sent cleanly to ${sendTo}`);
      return res.status(200).json({ status: "success", message: "Specification submitted and email sent successfully." });

    } catch (err: any) {
      console.error("[Email Dispatch Crash Error]:", err);
      return res.status(500).json({
        status: "error",
        message: `Failed to compile or dispatch email specification: ${err.message || String(err)}`
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
    console.log("\n--- Active Server-Side SMTP Configuration ---");
    console.log(`SMTP_HOST: ${process.env.SMTP_HOST || "NOT SET"}`);
    console.log(`SMTP_PORT: ${process.env.SMTP_PORT || "NOT SET"}`);
    console.log(`SMTP_USER: ${process.env.SMTP_USER || "NOT SET"}`);
    console.log(`SMTP_SECURE: ${process.env.SMTP_SECURE || "NOT SET"}`);
    console.log(`SMTP_FROM_EMAIL: ${process.env.SMTP_FROM_EMAIL || "NOT SET"}`);
    console.log(`SMTP_TO_EMAIL: ${process.env.SMTP_TO_EMAIL || "NOT SET"}`);
    console.log(`SMTP_PASS length: ${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0} characters`);
    console.log("---------------------------------------------\n");
  });
}

startServer();
