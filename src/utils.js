import XLSX from 'xlsx';

export function uploadFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
    console.log(workbook);
    callback(workbook);
  };
  reader.readAsArrayBuffer(file);
}

export function findName(arr, dict) {
  return arr.reduce((prev, cur) => {
    if (prev !== null) {
      return prev;
    }
    if (cur.indexOf(dict) !== -1) {
      return cur;
    }
    return null;
  }, null);
}

export function extractSheetData(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

export function compute(dataSetting, orderSetting, appSetting, dataWorkbook, orderWorkbook) {
  const customerSheet = extractSheetData(dataWorkbook.Sheets[dataSetting.customerSheet]);
  const providerSheet = extractSheetData(dataWorkbook.Sheets[dataSetting.providerSheet]);
  const orderSheet = extractSheetData(orderWorkbook.Sheets[orderWorkbook.SheetNames[0]]);

  console.log(customerSheet, providerSheet, orderSheet);
}
