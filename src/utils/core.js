import { parseSheet } from './excel';

const DEFAULT_PROJECTION = {
  'Type': 'Type',
  'Nom Client': 'Nom Client',
  'Nom Fourn.': 'Nom Transporteur',
  'Date Charg.': 'Date Chargement',
  'Date Livr.': 'Date Livraison',
  'CP Charg.': 'CP Chargement',
  'Ville Charg.': 'Ville Chargement',
  'CP Livr.': 'CP Livraison',
  'Ville Livr.': 'Ville Livraison',
  'Commentaires': 'Commentaires'
};

export function compute(settings, dataWorkbook, orderWorkbook) {
  const customerSheet = parseSheet(dataWorkbook.Sheets[settings.customerSheet]);
  const providerSheet = parseSheet(dataWorkbook.Sheets[settings.providerSheet]);
  const orderSheet = parseSheet(orderWorkbook.Sheets[settings.orderSheet]);

  const customerMap = createMap(customerSheet, settings.customerIDCell);
  const providerMap = createMap(providerSheet, settings.providerIDCell);

  const orders = createOrderRanking(customerMap, providerMap, orderSheet, settings);

  return createProjection(orders, orderSheet[0], DEFAULT_PROJECTION);
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
  return (6 - provider[settings.providerRating]) * settings.providerRate;
}

function caclulateDates(date, settings) {
  if (date === undefined) {
    return 1;
  }

  const rate = 24 - date.getHours();
  const mark = (rate / 24) * 5

  return mark * settings.dateRate;
}

function calculateCustomer(customer, settings) {
  if (customer === undefined) {
    return 1;
  }
  const rating = customer[settings.customerRating];
  switch (rating.toLowerCase().trim()) {
    case 'sensible':
      return 5 * settings.customerRate;
    default:
      return 1 * settings.customerRate;
  }
}

function createOrderRanking(customerMap, providerMap, orderSheet, settings) {
  const orders = [];
  for (let i = 1; i < orderSheet.length; i++) {
    const customerKey = orderSheet[i][settings.orderCustomerID];
    const providerKey = orderSheet[i][settings.orderProviderID];

    const customer = customerMap.get(customerKey);
    const provider = providerMap.get(providerKey);
    const date = orderSheet[i][settings.orderType] === 'Chargement' ?
      orderSheet[i][settings.orderDateShipping] : orderSheet[i][settings.orderDateDelivery];

    const providerRanking = calculateProvider(provider, settings);
    const dateRanking     = caclulateDates(date, settings);
    const customerRanking = calculateCustomer(customer, settings);
    const ranking = providerRanking + dateRanking + customerRanking;
    
    orders.push({ order: orderSheet[i], ranking })
  }
  return orders.sort((a, b) => {
    if (a.order[settings.orderType] !== b.order[settings.orderType]) {
      return a.order[settings.orderType].localeCompare(b.order[settings.orderType]);
    }
    return b.ranking - a.ranking
  });
}

function createProjection(orders, headers, projection) {
  const newHeaders = Object
    .keys(projection)
    .map(key => ({
      index: headers.indexOf(key),
      name: projection[key]
    }));

  const mapped = orders
    .map(({ order }) => 
      newHeaders
        .map(({ index }) => index !== -1 ? order[index] : '')
    );

  // insert headers at first line
  mapped.unshift(newHeaders.map(({ name }) => name));

  return mapped;
}
