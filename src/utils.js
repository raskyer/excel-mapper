import XLSX from 'xlsx';

export function uploadFile(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
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

function calculateProvider(provider, settings) {
  if (provider === undefined) {
    return 1;
  }
  return (6 - provider[settings.providerRatingCell]) * settings.stxProviderRating;
}

function caclulateDate(date, time, settings) {
  //date + time * settings.stxDate;
  return 1;
}

function calculateCustomer(customer, settings) {
  if (customer === undefined) {
    return 1;
  }
  const rating = customer[settings.customerRatingCell];
  switch (rating.toLowerCase().trim()) {
    case 'sensible':
      return 5 * settings.stxCustomerRating;
    default:
      return 1 * settings.stxCustomerRating;
  }
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

  const orders = [];
  for (let i = 1; i < orderSheet.length; i++) {
    const customerKey = orderSheet[i][settings.orderCustomerIDCell];
    const providerKey = orderSheet[i][settings.orderProviderIDCell];

    const customer = customerMap.get(customerKey);
    const provider = providerMap.get(providerKey);

    const date = orderSheet[i][settings.orderDateCell];
    const time = orderSheet[i][settings.orderTimeCell];

    const providerRanking = calculateProvider(provider, settings);
    const dateRanking = caclulateDate(date, time, settings);
    const customerRanking = calculateCustomer(customer, settings);
    const ranking = providerRanking + dateRanking + customerRanking;
    
    orders.push({ order: orderSheet[i], ranking })
  }

  orders.sort((a, b) => b.ranking - a.ranking).forEach(o => console.log(o));
}
