const CUSTOMER_SHEET = "customerSheet";
const CUSTOMER_ID = "customerID";
const CUSTOMER_RATING = "customerRating";

const PROVIDER_SHEET = "providerSheet";
const PROVIDER_ID = "providerID";
const PROVIDER_RATING = "providerRating";

const ORDER_CUSTOMER_ID = "orderCustomerID";
const ORDER_PROVIDER_ID = "orderProviderID";
const ORDER_DATE = "orderDate";

const DEFAULT_KEY = {
  [CUSTOMER_SHEET]: "Client",
  [CUSTOMER_ID]: "ID",
  [CUSTOMER_RATING]: "Niveau",
  
  [PROVIDER_SHEET]: "Transporteur",
  [PROVIDER_ID]: "ID",
  [PROVIDER_RATING]: "Note",

  [ORDER_CUSTOMER_ID]: "N° Client",
  [ORDER_PROVIDER_ID]: "N° Four",
  [ORDER_DATE]: "Date"
};

class Finder {
  findCustomerSheet(arr) {
    return findElement(arr, CUSTOMER_SHEET);
  }
  
  findProviderSheet(arr) {
    return findElement(arr, PROVIDER_SHEET);
  }
  
  findCustomerID(arr) {
    return findIndex(arr, CUSTOMER_ID);
  }
  
  findProviderID(arr) {
    return findIndex(arr, PROVIDER_ID);
  }
  
  findCustomerRating(arr) {
    return findIndex(arr, CUSTOMER_RATING);
  }
  
  findProviderRating(arr) {
    return findIndex(arr, PROVIDER_RATING);
  }
  
  findOrderCustomerID(arr) {
    return findIndex(arr, ORDER_CUSTOMER_ID);
  }
  
  findOrderProviderID(arr) {
    return findIndex(arr, ORDER_PROVIDER_ID);
  }
  
  findOrderDate(arr) {
    return findIndex(arr, ORDER_DATE);
  }
}

function findElement(arr, key) {
  const match = findKey(arr, key);
  return match ? match.element : null;
}

function findIndex(arr, key) {
  const match = findKey(arr, key);
  return match ? match.index : null;
}

function findKey(arr, key) {
  const token = localStorage.getItem(key);
  console.log(DEFAULT_KEY[key]);
  if (!token) {
    localStorage.setItem(key, DEFAULT_KEY[key]);
    return find(arr, DEFAULT_KEY[key]);
  }
  return find(arr, token);
}

function find(arr, dict) {
  return arr.reduce((p, c, i) => {
    if (p !== null) return p;
    if (c.indexOf(dict) !== -1) return { element: c, index: i };
    return null;
  }, null);
}

export default new Finder();
