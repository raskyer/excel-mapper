<script>
	import { compute } from './utils/core';

  import DBForm from './components/DBForm.svelte';
  import OrderForm from './components/OrderForm.svelte';
	
  let dbWorkbook = null;
  let dbSettings = {
    customerSheet: null,
    providerSheet: null,
    
    customerCells: [],
    providerCells: [],

    customerID: null,
    providerID: null,
    customerRating: null,
    providerRating: null
  }

  let orderWorkbook = null;
  let orderSettings = {
    orderSheet: null,
    orderCells: [],
    orderType: null,
    orderCustomerID: null,
    orderProviderID: null,
    orderDateShipping: null,
    orderDateDelivery: null
  };

  let ratingSettings = {
    providerRate: 3,
    dateRate: 2,
    customerRate: 1
  };

  let projectionSettings = {};

  export let onCompute;

  const onSubmit = e => {
    e.preventDefault();
    const settings = {
      ...dbSettings,
      ...orderSettings,
      ...ratingSettings
    };
    const data = compute(settings, dbWorkbook, orderWorkbook);
    onCompute(data);
  };
</script>

<form on:submit={onSubmit}>
  <DBForm bind:workbook={dbWorkbook} bind:stx={dbSettings} />
  <OrderForm bind:workbook={orderWorkbook} bind:stx={orderSettings} />
  <!-- <RatingForm bind:stx={ratingSettings} -->

  <div class="form-group text-right">
    <button type="submit" class="btn btn-success">Valider</button>
  </div>
</form>
