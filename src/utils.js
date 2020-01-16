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
  return arr.reduce((p, c) => {
    if (p !== null) return p;
    if (c.indexOf(dict) !== -1) return c;
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

function createMap(sheet, idCell) {
  const map = new Map();
  for (let i = 1; i < sheet.length; i++) {
    map.set(sheet[i][idCell], sheet[i]);
  }
  return map;
}

function calculateProvider(provider, settings) {
  if (provider === undefined) {
    return 1;
  }
  return (6 - provider[settings.providerRatingCell]) * settings.stxProviderRating;
}

function caclulateDate(date, time, settings) {
  if (date === undefined || time === undefined) {
    return 1;
  }
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

function createOrderRanking(customerMap, providerMap, orderSheet, settings) {
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
  return orders.sort((a, b) => b.ranking - a.ranking);
}

export function compute(settings, dataWorkbook, orderWorkbook) {
  const customerSheet = extractSheetData(dataWorkbook.Sheets[settings.customerSheet]);
  const providerSheet = extractSheetData(dataWorkbook.Sheets[settings.providerSheet]);
  const orderSheet = extractSheetData(orderWorkbook.Sheets[orderWorkbook.SheetNames[0]]);

  const customerMap = createMap(customerSheet, settings.customerIDCell);
  const providerMap = createMap(providerSheet, settings.providerIDCell);

  const orders = createOrderRanking(customerMap, providerMap, orderSheet, settings);

  // project orders => final xls based on config key
  // save into new excel file
}
