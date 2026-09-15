/**
 * โค้ด Google Apps Script (Code.gs) ปรับแต่งสำหรับงานแจ้งเคส/ปิด Proxy ตามเลขสัญญา
 * เชื่อมต่อ Google Sheets ฟรี + แจ้งเตือนเข้า LINE Notify แบบเรียลไทม์
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================================
 * สคริปต์แจ้งงานตามสัญญา (เช่น ปิด Proxy / แจ้งปัญหา)
 * บันทึก Google Sheets อัตโนมัติ + ส่ง LINE Notify แจ้งเตือนฟรี
 * ==============================================================================
 */

const DEFAULT_LINE_NOTIFY_TOKEN = ""; // ใส่ Token จาก https://notify-bot.line.me/ (ถ้ามี)
const SHEET_NAME = "Queue"; 

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "รหัสเคส",
      "เลขที่สัญญา",
      "หัวข้อการแจ้ง",
      "ค่าย MDM",
      "รุ่นโทรศัพท์",
      "ชื่อลูกค้า",
      "รายการที่แจ้ง",
      "ผู้แจ้ง",
      "เบอร์โทร/LINE",
      "รายละเอียด",
      "รูปภาพแนบ",
      "สถานะ",
      "ช่างผู้ทำรายการ",
      "ข้อความตอบกลับจากช่าง",
      "วันที่แจ้ง",
      "วันที่อัปเดต"
    ]);
    sheet.getRange("A1:P1").setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "getTickets";
    if (action === "ping") {
      return responseJSON({ success: true, message: "Apps Script ทำงานปกติ พร้อมรับส่งข้อมูล!" });
    }

    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    const tickets = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;

      // รองรับทั้งแบบเก่าและใหม่ (ถ้า column 2 เป็น requestType คือแบบเก่า, ถ้าเป็น mdmProvider คือแบบใหม่)
      // เช็คว่า row length น่าจะบอกได้ แต่เพื่อความชัวร์ ใช้แบบอ่านตายตัวตามคอลัมน์ใหม่
      tickets.push({
        id: String(row[0]),
        contractNo: String(row[1]),
        topic: String(row[2] || ""),
        mdmProvider: String(row[3] || ""),
        deviceModel: String(row[4] || ""),
        realCustomerName: String(row[5] || ""),
        requestType: String(row[6] || "ปิด Proxy"),
        customerName: String(row[7] || ""),
        phone: String(row[8] || ""),
        description: String(row[9] || ""),
        attachmentUrl: String(row[10] || ""),
        status: String(row[11] || "pending"),
        technicianName: String(row[12] || "ช่างเทคนิค"),
        technicianNote: String(row[13] || ""),
        createdAt: row[14] instanceof Date ? row[14].toISOString() : String(row[14]),
        updatedAt: row[15] instanceof Date ? row[15].toISOString() : String(row[15]),
        statusHistory: []
      });
    }

    return responseJSON({ success: true, tickets: tickets });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      payload = e.parameter;
      if (typeof payload.ticket === "string") {
        try { payload.ticket = JSON.parse(payload.ticket); } catch(e) {}
      }
      if (typeof payload.updatedData === "string") {
        try { payload.updatedData = JSON.parse(payload.updatedData); } catch(e) {}
      }
      if (typeof payload.notifyLine === "string") {
        payload.notifyLine = payload.notifyLine === "true";
      }
    }

    const action = payload.action || "addTicket";
    const sheet = getOrCreateSheet();
    const lineToken = payload.lineNotifyToken || DEFAULT_LINE_NOTIFY_TOKEN;

    // 1. มีพนักงานแจ้งเคสใหม่
    if (action === "addTicket") {
      const ticket = payload.ticket;
      const now = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

      sheet.appendRow([
        ticket.id,
        ticket.contractNo,
        ticket.topic || "",
        ticket.mdmProvider || "",
        ticket.deviceModel || "",
        ticket.realCustomerName || "",
        ticket.requestType,
        ticket.customerName,
        ticket.phone || "",
        ticket.description || "",
        ticket.attachmentUrl || "",
        ticket.status || "pending",
        ticket.technicianName || "",
        ticket.technicianNote || "",
        ticket.createdAt || now,
        ticket.updatedAt || now
      ]);

      // ส่ง LINE Notify แจ้งเตือนช่างทันที
      if (lineToken) {
        let msg = "\\n🔔 มีรายการแจ้งใหม่!" +
                  (ticket.topic ? "\\n📌 หัวข้อ: " + ticket.topic : "") +
                  "\\n📋 เลขสัญญา: " + ticket.contractNo +
                  (ticket.realCustomerName ? "\\n👤 ลูกค้า: " + ticket.realCustomerName : "") +
                  "\\n⚡ รายการ: " + ticket.requestType +
                  "\\n👤 ผู้แจ้ง: " + ticket.customerName + (ticket.phone ? " (" + ticket.phone + ")" : "") +
                  "\\n📝 รายละเอียด: " + (ticket.description || "-") +
                  "\\n🕒 เวลา: " + now;
        sendLineNotify(lineToken, msg);
      }

      return responseJSON({ success: true, message: "บันทึกเรียบร้อย", ticket: ticket });
    }

    // 2. ช่างอัปเดตสถานะ เช่น 'เสร็จแล้ว/ได้แล้ว', 'กำลังทำ', หรือ 'ขอข้อมูลเพิ่ม'
    if (action === "updateTicket") {
      const ticketId = payload.ticketId;
      const updatedData = payload.updatedData;
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(ticketId)) {
          rowIndex = i + 1;
          break;
        }
      }

      if (rowIndex === -1) {
        return responseJSON({ success: false, error: "ไม่พบรหัสเคส: " + ticketId });
      }

      const now = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
      const contractNo = data[rowIndex - 1][1];

      if (updatedData.status !== undefined) sheet.getRange(rowIndex, 12).setValue(updatedData.status);
      if (updatedData.technicianName !== undefined) sheet.getRange(rowIndex, 13).setValue(updatedData.technicianName);
      if (updatedData.technicianNote !== undefined) sheet.getRange(rowIndex, 14).setValue(updatedData.technicianNote);
      sheet.getRange(rowIndex, 16).setValue(now);

      // ส่ง LINE Notify เมื่อช่างอัปเดตงาน
      if (lineToken && payload.notifyLine) {
        let statusTh = updatedData.status;
        let icon = "🔄";
        if (updatedData.status === "resolved") {
          statusTh = "เสร็จแล้ว / ได้แล้ว ✅";
          icon = "🎉";
        } else if (updatedData.status === "in_progress") {
          statusTh = "กำลังทำให้ 👨‍💻";
          icon = "⚡";
        } else if (updatedData.status === "waiting_info") {
          statusTh = "ขอข้อมูลเพิ่มเติม ❓";
          icon = "⚠️";
        }

        let msg = "\\n" + icon + " อัปเดตงาน: สัญญา " + contractNo +
                  "\\n📌 สถานะ: " + statusTh +
                  "\\n💬 ช่างแจ้งว่า: " + (updatedData.technicianNote || "กำลังดำเนินการ") +
                  "\\n🕒 เมื่อ: " + now;
        sendLineNotify(lineToken, msg);
      }

      return responseJSON({ success: true, message: "อัปเดตสำเร็จ" });
    }

    // 3. ทดสอบส่ง LINE
    if (action === "testLine") {
      if (!lineToken) return responseJSON({ success: false, error: "ไม่มี Token" });
      const res = sendLineNotify(lineToken, "\\n✅ ทดสอบเชื่อมต่อระบบแจ้งงานช่างสำเร็จ! พร้อมรับการแจ้งเตือนแบบเรียลไทม์");
      return responseJSON(res);
    }

    return responseJSON({ success: false, error: "คำขอไม่ถูกต้อง" });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

function sendLineNotify(token, message) {
  try {
    const url = "https://notify-api.line.me/api/notify";
    const options = {
      method: "post",
      headers: { "Authorization": "Bearer " + token },
      payload: { message: message },
      muteHttpExceptions: true
    };
    const response = UrlFetchApp.fetch(url, options);
    return { success: response.getResponseCode() === 200 };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
`;
