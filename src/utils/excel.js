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

export function createWorkbook(data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille 1');
  return workbook;
}

export function downloadWorkbook(workbook) {
  XLSX.writeFile(workbook, 'out.xlsx', { bookType:'xlsx', bookSST:false, type:'array' });
}
