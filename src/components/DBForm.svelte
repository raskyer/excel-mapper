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
			stx.customerSheet = Finder.findSheet(sheetNames, Finder.CUSTOMER_SHEET);
      stx.providerSheet = Finder.findSheet(sheetNames, Finder.PROVIDER_SHEET);
			onCustomerSheetChange();
			onProviderSheetChange();
		});
  };
  
  const onCustomerSheetChange = () => {
    if (stx.customerSheet === null) return;
		Finder.save(Finder.CUSTOMER_SHEET, stx.customerSheet);
		const sheet = workbook.Sheets[stx.customerSheet];
		const data = parseSheet(sheet);
		stx.customerCells = data[0];
		stx.customerID = stx.customerID ? stx.customerID : Finder.findCell(stx.customerCells, Finder.CUSTOMER_ID);
    stx.customerRating = stx.customerRating ? stx.customerRating : Finder.findCell(stx.customerCells, Finder.CUSTOMER_RATING);
    stx = stx;
	};

	const onProviderSheetChange = () => {
		if (stx.providerSheet === null) return;
		Finder.save(Finder.PROVIDER_SHEET, stx.providerSheet);
		const sheet = workbook.Sheets[stx.providerSheet];
		const data = parseSheet(sheet);
		stx.providerCells = data[0];
		stx.providerID = stx.providerID ? stx.providerID : Finder.findCell(stx.providerCells, Finder.PROVIDER_ID);
    stx.providerRating = stx.providerRating ? stx.providerRating : Finder.findCell(stx.providerCells, Finder.PROVIDER_RATING);
    stx = stx;
	};
</script>

<fieldset>
  <legend>Clients / Fournisseurs</legend>

  <div class="form-group">
    <label for="customer-provider-file">Choissisez votre fichier :</label>
    <input
      id="customer-provider-file"
      type="file"
      class={'form-control ' + (files.length < 1 ? 'is-invalid' : 'is-valid')}
      bind:files={files}
      on:change={onUpload}
      required
    />
  </div>

  {#if files.length > 0}
    <div class="row">
      <div class="col-6">
        <SelectSheet
          id="customer-sheet"
          title="Feuille pour les clients"
          bind:sheet={stx.customerSheet}
          onChange={onCustomerSheetChange}
          sheets={sheetNames}
        />

        {#if stx.customerSheet !== null}
          <SelectCell
            id="customer-id"
            title="Cellule d'ID client"
            bind:cell={stx.customerID}
            onChange={() => Finder.save(Finder.CUSTOMER_ID, stx.customerCells[stx.customerID])}
            cells={stx.customerCells}
          />

          <SelectCell
            id="customer-rating"
            title="Cellule de note client"
            bind:cell={stx.customerRating}
            onChange={() => Finder.save(Finder.CUSTOMER_RATING, stx.customerCells[stx.customerRating])}
            cells={stx.customerCells}
          />
        {/if}
      </div>

      <div class="col-6">
        <SelectSheet
          id="provider-sheet"
          title="Feuille pour les fournisseurs"
          bind:sheet={stx.providerSheet}
          onChange={onProviderSheetChange}
          sheets={sheetNames}
        />

        {#if stx.providerSheet !== null}
          <SelectCell
            id="provider-id"
            title="Cellule d'ID fournisseur"
            bind:cell={stx.providerID}
            onChange={() => Finder.save(Finder.PROVIDER_ID, stx.providerCells[stx.providerID])}
            cells={stx.providerCells}
          />

          <SelectCell
            id="provider-rating"
            title="Cellule de note fournisseur"
            bind:cell={stx.providerRating}
            onChange={() => Finder.save(Finder.PROVIDER_RATING, stx.providerCells[stx.providerRating])}
            cells={stx.providerCells}
          />
        {/if}
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
