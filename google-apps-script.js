/**
 * Google Apps Script Backend for Bellows Systems Specification Form
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. In Google Sheets, go to "Extensions" > "Apps Script".
 * 3. Delete any default code in the editor and paste this code.
 * 4. Click the "Save" icon (or Ctrl+S / Cmd+S).
 * 5. Click "Deploy" > "New deployment".
 * 6. Under "Select type", click the Gear icon and choose "Web app".
 * 7. Set:
 *    - Description: "Bellows Spec Submission API"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (crucial for form submissions from the web)
 * 8. Click "Deploy".
 * 9. Authorize the script if prompted (click "Review Permissions", select your Google Account, click "Advanced" and "Go to Untitled project (unsafe)", then click "Allow").
 * 10. Copy the "Web app URL" (it ends with /exec).
 * 11. Add this Web App URL to your frontend's environment variable `VITE_GOOGLE_SCRIPT_URL` or replace the URL directly in the submit handler in `App.tsx`.
 */

// Handle GET request to verify API is active
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Bellows Systems Specification API is active and ready for POST submissions."
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders({
    "Access-Control-Allow-Origin": "*"
  });
}

// Handle POST request from the specification form
function doPost(e) {
  // Create JSON output with CORS header
  var response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  
  // Set CORS headers
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    var payload;
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }
    
    // Open the active spreadsheet
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = activeSpreadsheet.getActiveSheet();
    
    // Define the official headers of our sheet
    var colHeaders = [
      "Submission Date",
      "Style",
      "Shape",
      "Contact Name",
      "Contact Email",
      "Contact Phone",
      "Company Name",
      "Country",
      "Dim A",
      "Dim B",
      "Dim C",
      "Clamp Bar Width",
      "Overall Belt Width",
      "Corner Radius",
      "Dim D",
      "Dim W",
      "Width Between Clamps",
      "Flange",
      "Duct Thickness",
      "Duct Material",
      "Design Pressure",
      "Design Temperature",
      "Axial Compression",
      "Axial Expansion",
      "Lateral Deflection",
      "Quantity",
      "Accumulation Pillow",
      "Liner Bolted",
      "Liner Welded",
      "Application Notes"
    ];
    
    // Automatically initialize headers with professional styling if empty sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(colHeaders);
      sheet.getRange(1, 1, 1, colHeaders.length)
        .setFontWeight("bold")
        .setFontFamily("Inter")
        .setFontSize(10)
        .setBackground("#f1f5f9")
        .setTextDirection(SpreadsheetApp.TextDirection.LEFT_TO_RIGHT)
        .setHorizontalAlignment("center");
      
      // Freeze the header row
      sheet.setFrozenRows(1);
    }
    
    // Safely extract nested sections
    var fabric = payload.fabricDetails || {};
    var duct = payload.ductInfo || {};
    var design = payload.design || {};
    var movements = payload.movements || {};
    var optional = payload.optionalFeatures || {};
    var contact = payload.contactDetails || {};
    
    // Map all fields in exact index sync with the header column structure
    var rowData = [
      payload.submissionDate || new Date().toLocaleString(),
      payload.selectedStyle || "",
      payload.shape || "",
      contact.name || "",
      contact.email || "",
      contact.phone || "",
      contact.companyName || "",
      contact.country || "",
      fabric.dimA || "",
      fabric.dimB || "",
      fabric.dimC || "",
      fabric.clampBarWidth || "",
      fabric.overallBeltWidth || "",
      fabric.cornerRadius || "",
      duct.dimD || "",
      duct.dimW || "",
      duct.widthBetweenClamps || "",
      duct.flange || "",
      duct.ductThickness || "",
      duct.ductMaterial || "",
      design.pressure || "",
      design.temperature || "",
      movements.axialCompression || "",
      movements.axialExpansion || "",
      movements.lateral || "",
      payload.quantity || "",
      optional.accumulationPillow ? "Yes" : "No",
      optional.linerBolted ? "Yes" : "No",
      optional.linerWelded ? "Yes" : "No",
      payload.applicationNotes || ""
    ];
    
    // Append the row
    sheet.appendRow(rowData);
    
    // Auto-adjust column widths
    var lastCol = sheet.getLastColumn();
    for (var col = 1; col <= lastCol; col++) {
      sheet.autoResizeColumn(col);
    }
    
    var successResponse = {
      status: "success",
      message: "Specification successfully saved to Google Sheet."
    };
    
    return ContentService.createTextOutput(JSON.stringify(successResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    var errorResponse = {
      status: "error",
      message: error.toString()
    };
    
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

// Handle OPTIONS request for preflight check (just in case browser sends it)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}
