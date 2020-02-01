<script>
  export let stx;
</script>

<fieldset>
  <legend>Ajuster les notations</legend>

  <div class="form-group">
    <label for="rating-provider">
      Ajuster l'importance de la note fournisseur :
    </label>
    <input
      id="rating-provider"
      type="number"
      class="form-control"
      bind:value={stx.providerRate}
      min={0} />
  </div>

  <div class="form-group">
    <label for="rating-date">Ajuster l'importance de la date :</label>
    <input
      id="rating-date"
      type="number"
      class="form-control"
      bind:value={stx.dateRate}
      min={0} />
  </div>

  <div class="form-group">
    <label for="rating-customer">
      Ajuster l'importance de la note client :
    </label>
    <input
      id="rating-customer"
      type="number"
      class="form-control"
      bind:value={stx.customerRate}
      min={0} />
  </div>
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
