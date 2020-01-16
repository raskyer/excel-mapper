import { parseSheet } from './excel';

export function compute(settings, dataWorkbook, orderWorkbook) {
  const customerSheet = parseSheet(dataWorkbook.Sheets[settings.customerSheet]);
  const providerSheet = parseSheet(dataWorkbook.Sheets[settings.providerSheet]);
  const orderSheet = parseSheet(orderWorkbook.Sheets[orderWorkbook.SheetNames[0]]);

  const customerMap = createMap(customerSheet, settings.customerIDCell);
  const providerMap = createMap(providerSheet, settings.providerIDCell);

  const orders = createOrderRanking(customerMap, providerMap, orderSheet, settings);

  // project orders => final xls based on config key
  // save into new excel file
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
