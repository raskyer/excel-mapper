import XLSX from 'xlsx';

export function parseFile(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
    callback(workbook);
  };
  reader.readAsArrayBuffer(file);
}

export function parseSheet(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}
