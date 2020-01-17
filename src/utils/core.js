import { parseSheet } from './excel';

const DEFAULT_PROJECTION = {
  "Type": "Type",
  "Nom Client": "Nom Client",
  "Nom Fourn.": "Nom Transporteur",
  "Date Charg.": "Date Chargement",
  "Date Livr.": "Date Livraison",
  "CP Charg.": "CP Chargement",
  "Ville Charg.": "Ville Chargement",
  "CP Livr.": "CP Livraison",
  "Ville Livr.": "Ville Livraison",
  "Commentaires": "Commentaires"
};

export function compute(settings, dataWorkbook, orderWorkbook) {
  const customerSheet = parseSheet(dataWorkbook.Sheets[settings.customerSheet]);
  const providerSheet = parseSheet(dataWorkbook.Sheets[settings.providerSheet]);
  const orderSheet = parseSheet(orderWorkbook.Sheets[orderWorkbook.SheetNames[0]]);

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

/*
  {
    "Named key": "key"
  }
*/

function createProjection(orders, headers, projection) {
  const newHeaders = [];
  for (let key of Object.keys(projection)) {
    const index = headers.indexOf(key); // index of named key
    const name = projection[key]; // remapping name
    newHeaders.push({ name, index });
  }
  const mapped = orders.map(({ order }) => {
    const newOrder = [];
    for (let header of newHeaders) {
      if (header.index !== -1) {
        newOrder.push(order[header.index]);
      } else {
        newOrder.push('');
      }
    }
    return newOrder;
  });
  mapped.unshift(newHeaders.map(h => h.name));
  return mapped;
}
