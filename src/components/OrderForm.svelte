<script>
  import { parseFile, parseSheet } from '../utils/excel';
  import Finder from '../utils/finder';

  import SelectSheet from './SelectSheet.svelte';
  import SelectCell from './SelectCell.svelte';

  let files = [];
  let sheetNames = [];

  export let workbook;
  export let stx;

  const onUpload = () => {
		if (files.length < 1) return;
		parseFile(files[0], w => {
			workbook = w;
      sheetNames = [...workbook.SheetNames];
      stx.orderSheet = Finder.findSheet(sheetNames, Finder.ORDER_SHEET);
      onSheetChange();
		});
  };

  const onSheetChange = () => {
    if (stx.orderSheet === null) return;
    Finder.save(Finder.ORDER_SHEET, stx.orderSheet);
    const sheet = workbook.Sheets[stx.orderSheet];
    const data = parseSheet(sheet);
    stx.orderCells = data[0];
    stx.orderType = Finder.findCell(data[0], Finder.ORDER_TYPE);
    stx.orderCustomerID = Finder.findCell(data[0], Finder.ORDER_CUSTOMER_ID);
    stx.orderProviderID = Finder.findCell(data[0], Finder.ORDER_PROVIDER_ID);
    stx.orderDateShipping = Finder.findCell(data[0], Finder.ORDER_DATE_SHIPPING);
    stx.orderDateDelivery = Finder.findCell(data[0], Finder.ORDER_DATE_DELIVERY);
    stx = stx;
  };
</script>

<fieldset>
  <legend>Commandes</legend>

  <div class="form-group">
    <label for="order-file">Choissisez votre fichier :</label>
    <input
      id="order-file"
      type="file"
      class={'form-control' + (files.length < 1 ? ' is-invalid' : ' is-valid')}
      bind:files={files}
      on:change={onUpload}
      required />
  </div>

  {#if files.length > 0}
    <div class="row">
      <div class="col-12">
        <SelectSheet
          id="customer-sheet"
          title="Feuille pour les commandes"
          bind:sheet={stx.orderSheet}
          onChange={onSheetChange}
          sheets={sheetNames}
        />
      </div>
    </div>
  {/if}

  {#if stx.orderSheet !== null}
    <div class="row">
      <div class="col-6">
        <SelectCell
          id="order-type"
          title="Cellule de type"
          bind:cell={stx.orderType}
          onChange={() => Finder.save(Finder.ORDER_TYPE, stx.orderCells[stx.orderType])}
          cells={stx.orderCells}
        />
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <SelectCell
          id="order-customer-id"
          title="Cellule d'ID client"
          bind:cell={stx.orderCustomerID}
          onChange={() => Finder.save(Finder.ORDER_CUSTOMER_ID, stx.orderCells[stx.orderCustomerID])}
          cells={stx.orderCells}
        />
      </div>

      <div class="col-6">
        <SelectCell
          id="order-provider-id"
          title="Cellule d'ID fournisseur"
          bind:cell={stx.orderProviderID}
          onChange={() => Finder.save(Finder.ORDER_PROVIDER_ID, stx.orderCells[stx.orderProviderID])}
          cells={stx.orderCells}
        />
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <SelectCell
          id="date-shipping"
          title="Cellule de date de chargement"
          bind:cell={stx.orderDateShipping}
          onChange={() => Finder.save(Finder.ORDER_DATE_SHIPPING, stx.orderCells[stx.orderDateShipping])}
          cells={stx.orderCells}
        />
      </div>

      <div class="col-6">
        <SelectCell
          id="date-delivery"
          title="Cellule de date de livraison"
          bind:cell={stx.orderDateDelivery}
          onChange={() => Finder.save(Finder.ORDER_DATE_DELIVERY, stx.orderCells[stx.orderDateDelivery])}
          cells={stx.orderCells}
        />
      </div>
    </div>
  {/if}
</fieldset>

<style>
fieldset {
	margin: 10px 0px;
	border: 1px solid #ddd;
	padding: 10px;
	background-color:#f5f5f5;
}

legend {
	font-size: 1em;
	width: auto;
	border: 1px solid #ddd;
	border-radius: 4px;
	padding: 5px;
	background-color: #ffffff;
}
</style>
