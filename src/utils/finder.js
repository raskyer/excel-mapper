class Finder {
  constructor() {
    this.CUSTOMER_SHEET = 'customerSheet';
    this.CUSTOMER_ID = 'customerID';
    this.CUSTOMER_RATING = 'customerRating';
    this.PROVIDER_SHEET = 'providerSheet';
    this.PROVIDER_ID = 'providerID';
    this.PROVIDER_RATING = 'providerRating';
    this.ORDER_CUSTOMER_ID = 'orderCustomerID';
    this.ORDER_PROVIDER_ID = 'orderProviderID';
    this.ORDER_DATE = 'orderDate';

    this.DEFAULT_KEYS = {
      [this.CUSTOMER_SHEET]: 'Client',
      [this.CUSTOMER_ID]: 'ID',
      [this.CUSTOMER_RATING]: 'Niveau',
      [this.PROVIDER_SHEET]: 'Transporteur',
      [this.PROVIDER_ID]: 'ID',
      [this.PROVIDER_RATING]: 'Note',
      [this.ORDER_CUSTOMER_ID]: 'N° Client',
      [this.ORDER_PROVIDER_ID]: 'N° Four',
      [this.ORDER_DATE]: 'Date'
    };
  }

  findSheet(arr, key) {
    return this._findElement(arr, key);
  }

  findCell(arr, key) {
    return this._findIndex(arr, key);
  }

  save(key, value) {
    localStorage.setItem(key, value);
  }

  _findElement(arr, key) {
    const match = this._findKey(arr, key);
    return match ? match.element : null;
  }

  _findIndex(arr, key) {
    const match = this._findKey(arr, key);
    return match ? match.index : null;
  }

  _findKey(arr, key) {
    const token = localStorage.getItem(key);
    if (!token) {
      this.save(key, this.DEFAULT_KEYS[key]);
      return find(arr, this.DEFAULT_KEYS[key]);
    }
    return find(arr, token);
  }
}

function find(arr, dict) {
  return arr.reduce((p, c, i) => {
    if (p !== null) return p;
    if (c.indexOf(dict) !== -1) return { element: c, index: i };
    return null;
  }, null);
}

export default new Finder();
