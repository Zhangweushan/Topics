function doPost(e) {
  var message = e.parameter.message;
  var spreadsheet = SpreadsheetApp.openById('1zMEdJll7m2bAjYifaiNeGSHfssAGvHjQRh3Gb7CBJi0');
  var sheet = spreadsheet.getSheetByName('Sheet1');
  sheet.appendRow([new Date(), message]);
  return ContentService.createTextOutput("Alert Logged");
}

function doGet(e) {
  // 檢查是否為刪除請求
  if (e.parameter.action === 'delete') {
    return deleteAllLogs();
  }
  
  // 原有的取得資料邏輯
  var spreadsheet = SpreadsheetApp.openById('1zMEdJll7m2bAjYifaiNeGSHfssAGvHjQRh3Gb7CBJi0');
  var sheet = spreadsheet.getSheetByName('Sheet1');
  var data = sheet.getDataRange().getValues();

  // 將表格資料轉為物件陣列
  var logs = data.map(function(row, index) {
    if (index === 0) return null; // 忽略標題列（如有）
    return {
      timestamp: row[0],
      message: row[1]
    };
  }).filter(item => item !== null); // 移除 null

  // 按照時間戳記降序排序
  logs.sort(function(a, b) {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return ContentService
    .createTextOutput(JSON.stringify(logs))
    .setMimeType(ContentService.MimeType.JSON);
}

function deleteAllLogs() {
  var spreadsheet = SpreadsheetApp.openById('1zMEdJll7m2bAjYifaiNeGSHfssAGvHjQRh3Gb7CBJi0');
  var sheet = spreadsheet.getSheetByName('Sheet1');
  
  // 保留第一列（如果有標題的話）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: "所有紀錄已刪除" }))
    .setMimeType(ContentService.MimeType.JSON);
}
