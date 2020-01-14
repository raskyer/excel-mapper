import XLSX from 'xlsx';

export function uploadFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
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
