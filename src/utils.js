import XLSX from 'xlsx';

export function uploadFile(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
    console.log(workbook);
    callback(workbook);
  };
  reader.readAsArrayBuffer(file);
}

export function findSheet(arr, dict) {
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

export function findCell(arr, dict) {
  return arr.reduce((p, c, i) => {
    if (p !== null) return p;
    if (c.indexOf(dict) !== -1) return i;
    return null;
  }, null);
}

export function extractSheetData(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

export function compute(settings, dataWorkbook, orderWorkbook) {
  const customerSheet = extractSheetData(dataWorkbook.Sheets[settings.customerSheet]);
  const providerSheet = extractSheetData(dataWorkbook.Sheets[settings.providerSheet]);
  const orderSheet = extractSheetData(orderWorkbook.Sheets[orderWorkbook.SheetNames[0]]);

  const customerMap = new Map();
  for (let i = 1; i < customerSheet.length; i++) {
    const key = customerSheet[i][settings.customerIDCell];
    customerMap.set(key, customerSheet[i]);
  }

  const providerMap = new Map();
  for (let i = 1; i < providerSheet.length; i++) {
    const key = providerSheet[i][settings.providerIDCell];
    providerMap.set(key, providerSheet[i]);
  }

  for (let i = 1; i < orderSheet.length; i++) {
    const customerKey = orderSheet[i][settings.orderCustomerIDCell];
    const providerKey = orderSheet[i][settings.orderProviderIDCell];
    const customer = customerMap.get(customerKey);
    const provider = providerMap.get(providerKey);
    const date = orderSheet[i][settings.orderDateCell];
    const time = orderSheet[i][settings.orderTimeCell];

    const providerRanking = provider ? provider[settings.providerRatingCell] * settings.stxProviderRating : 1;
    const dateRanking = date + time * settings.stxDate;
    const customerRanking = customer ? customer[settings.customerRatingCell] * settings.stxCustomerRating : 1; 

    const ranking = providerRanking + dateRanking + customerRanking;
    console.log(ranking);
  }

  console.log(customerSheet, providerSheet, orderSheet);
}
