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
  'État': 'Etat',
  'Dossier': 'Dossier',
  'Commentaires': 'Commentaires'
};

export function compute(settings, dbWorkbook, orderWorkbook) {
  const customerSheet = parseSheet(dbWorkbook.Sheets[settings.customerSheet]);
  const providerSheet = parseSheet(dbWorkbook.Sheets[settings.providerSheet]);
  const orderSheet    = parseSheet(orderWorkbook.Sheets[settings.orderSheet]);

  const customerMap = createMap(customerSheet, settings.customerID);
  const providerMap = createMap(providerSheet, settings.providerID);

  const orders = createOrderRanking(customerMap, providerMap, orderSheet, settings);

  return createProjection(orders, orderSheet[0], DEFAULT_PROJECTION);
}

function createMap(sheet, idCell) {
  const map = new Map();
  for (let i = 1; i < sheet.length; i++) {
    let id = sheet[i][idCell];
    if (typeof id === 'string') {
      id = id.trim().toLowerCase();
    }
    if (id === undefined) {
      console.warn('CREATE MAP : try to create map with undefined key', i, idCell, sheet);
      continue;
    }
    map.set(id, sheet[i]);
  }
  return map;
}

function calculateProvider(provider, settings) {
  if (provider === undefined || typeof provider[settings.providerRating] !== 'number') {
    console.warn('CALCULATE PROVIDER : provider undefined or invalide rating', provider, settings.providerRating);
    return 1;
  }

  if (provider[settings.providerRating] > 5 || provider[settings.providerRating] < 0) {
    console.warn('CALCULATE PROVIDER : invalide provider mark range', provider[settings.providerRating]);
  } 

  const mark = 6 - provider[settings.providerRating];
  const coef = typeof settings.providerRate === 'number' ? settings.providerRate : 1;

  return mark * coef;
}

function caclulateDate(date, settings) {
  if (date === undefined || typeof date !== 'object') {
    console.log('CALCULATE DATE : date undefined or invalide date', date);
    return 1;
  }

  const rate = 24 - date.getHours();
  const mark = (rate / 24) * 5
  const coef = typeof settings.dateRate === 'number' ? settings.dateRate : 1;

  return mark * coef;
}

function calculateCustomer(customer, settings) {
  if (customer === undefined || typeof customer[settings.customerRating] !== 'string') {
    console.warn('CALCULATE CUSTOMER : customer undefined or invalid rating', customer, settings.customerRating);
    return 1;
  }
  let mark = 1;
  const coef = typeof settings.customerRate === 'number' ? settings.customerRate : 1;
  const rating = customer[settings.customerRating].toLowerCase().trim();
  switch (rating) {
    case 'sensible':
      mark = 5;
      break;
    default:
      console.warn('CALCULATE CUSTOMER : unchecked rating', rating);
      mark = 1;
      break;
  }
  return mark * coef;
}

function createOrderRanking(customerMap, providerMap, orderSheet, settings) {
  const orders = [];
  for (let i = 1; i < orderSheet.length; i++) {
    let customerKey = orderSheet[i][settings.orderCustomerID];
    let providerKey = orderSheet[i][settings.orderProviderID];

    if (typeof customerKey === 'string') {
      customerKey = customerKey.trim().toLowerCase();
    }

    if (typeof providerKey === 'string') {
      providerKey = providerKey.trim().toLowerCase();
    }

    const customer = customerMap.get(customerKey);
    const provider = providerMap.get(providerKey);
    const date     = orderSheet[i][settings.orderType].trim().toLowerCase() === 'chargement' ?
      orderSheet[i][settings.orderDateShipping] : orderSheet[i][settings.orderDateDelivery];

    if (provider === undefined) {
      console.log('CREATE ORDER RANKING : undefined provider', providerKey);
    }
    if (customer === undefined) {
      console.log('CREATE ORDER RANKING : undefined customer', customerKey);
    }

    const providerRanking = calculateProvider(provider, settings);
    const dateRanking     = caclulateDate(date, settings);
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
        .map(value => value !== undefined && value !== null ? value : '')
    );

  // insert headers at first line
  mapped.unshift(newHeaders.map(({ name }) => name));

  return mapped;
}
