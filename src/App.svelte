<script>
	import { parseFile, parseSheet, createWorkbook } from './utils/excel';
	import Finder from './utils/finder';
	import { compute } from './utils/core';

	// Files
	let dataFiles = [];
	let orderFiles = [];
	let sheetNames = [];
	let dataWorkbook = null;
	let orderWorkbook = null;
	
	// Customer
	let customerSheet = null;
	let customerCells = [];
	let customerIDCell = null;
	let customerRatingCell = null;

	// Provider
	let providerSheet = null;
	let providerCells = [];
	let providerIDCell = null;
	let providerRatingCell = null;

	// Order
	let orderCells = [];
	let orderCustomerIDCell = null;
	let orderProviderIDCell = null;
	let orderDateCell = null;

	// Settings
	let stxProviderRating = 3;
	let stxDate = 2;
	let stxCustomerRating = 1;

	const onDataUpload = () => {
		if (dataFiles.length < 1) return;
		parseFile(dataFiles[0], workbook => {
			dataWorkbook = workbook;
			sheetNames = [...workbook.SheetNames];
			customerSheet = Finder.findSheet(sheetNames, Finder.CUSTOMER_SHEET);
			providerSheet = Finder.findSheet(sheetNames, Finder.PROVIDER_SHEET);
			onCustomerSheetChange();
			onProviderSheetChange();
		});
	};

	const onOrderUpload = () => {
		if (orderFiles.length < 1) return;
		parseFile(orderFiles[0], workbook => {
			orderWorkbook = workbook;
			const sheet = orderWorkbook.Sheets[orderWorkbook.SheetNames[0]];
			const data = parseSheet(sheet);
			orderCells = data[0];
			orderCustomerIDCell = Finder.findCell(orderCells, Finder.ORDER_CUSTOMER_ID);
			orderProviderIDCell = Finder.findCell(orderCells, Finder.ORDER_PROVIDER_ID);
			orderDateCell = Finder.findCell(orderCells, Finder.ORDER_DATE);
		});
	};

	const onCustomerSheetChange = () => {
		if (customerSheet === null) return;
		Finder.save(Finder.CUSTOMER_SHEET, customerSheet);
		const sheet = dataWorkbook.Sheets[customerSheet];
		const data = parseSheet(sheet);
		customerCells = data[0];
		customerIDCell = customerIDCell ? customerIDCell : Finder.findCell(customerCells, Finder.CUSTOMER_ID);
		customerRatingCell = customerRatingCell ? customerRatingCell : Finder.findCell(customerCells, Finder.CUSTOMER_RATING);
	};

	const onProviderSheetChange = () => {
		if (providerSheet === null) return;
		Finder.save(Finder.PROVIDER_SHEET, providerSheet);
		const sheet = dataWorkbook.Sheets[providerSheet];
		const data = parseSheet(sheet);
		providerCells = data[0];
		providerIDCell = providerIDCell ? providerIDCell : Finder.findCell(providerCells, Finder.PROVIDER_ID);
		providerRatingCell = providerRatingCell ? providerRatingCell : Finder.findCell(providerCells, Finder.PROVIDER_RATING);
	};

	const onFindChange = (key, value) => Finder.save(key, value);

	const onSubmit = e => {
		e.preventDefault();

		const settings = {
			customerSheet,
			customerIDCell,
			customerRatingCell,
			providerSheet,
			providerIDCell,
			providerRatingCell,
			orderCustomerIDCell,
			orderProviderIDCell,
			orderDateCell,
			stxProviderRating,
			stxDate,
			stxCustomerRating
		};

		const projection = compute(settings, dataWorkbook, orderWorkbook);
		const wb = createWorkbook(projection);

		console.log(projection);
		console.log(wb);
	};
</script>

<main class="container">
	<h1>Excel Mapper</h1>
	<img src="" alt="logo"/>

	<form on:submit={onSubmit}>
		<fieldset>
			<legend>Clients / Fournisseurs</legend>

			<div class="form-group">
				<label for="customer-provider-file">Choissisez votre fichier :</label>
				<input
					id="customer-provider-file"
					type="file"
					class={"form-control " + (dataFiles.length < 1 ? "is-invalid" : "is-valid")}
					bind:files={dataFiles}
					on:change={onDataUpload}
					required
				/>
			</div>

			{#if dataFiles.length > 0}
				<div class="row">
					<div class="col-6">
						<div class="form-group">
							<label for="customer-sheetname">Feuille pour les clients :</label>
							<select
								id="customer-sheetname"
								class={"form-control " + (customerSheet === null ? "is-invalid" : "is-valid")}
								bind:value={customerSheet}
								on:change={onCustomerSheetChange}
								required
							>
								<option value={null}>Choissisez...</option>
								{#each sheetNames as sheetName}
									<option value={sheetName}>
										{sheetName}
									</option>
								{/each}
							</select>
						</div>

						{#if customerSheet !== null}
							<div class="form-group">
								<label for="customer-id">Cellule d'ID client :</label>
								<select
									id="customer-id"
									class={"form-control " + (customerIDCell === null ? "is-invalid" : "is-valid")}
									bind:value={customerIDCell}
									on:change={() => onFindChange(Finder.CUSTOMER_ID, customerCells[customerIDCell])}
									required
								>
									<option value={null}>Choissisez...</option>
									{#each customerCells as cell, i}
										<option value={i}>
											{cell}
										</option>
									{/each}
								</select>
							</div>

							<div class="form-group">
								<label for="customer-rating">Cellule de note client :</label>
								<select
									id="customer-rating"
									class={"form-control " + (customerRatingCell === null ? "is-invalid" : "is-valid")}
									bind:value={customerRatingCell}
									on:change={() => onFindChange(Finder.CUSTOMER_RATING, customerCells[customerRatingCell])}
									required
								>
									<option value={null}>Choissisez...</option>
									{#each customerCells as cell, i}
										<option value={i}>
											{cell}
										</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>

					<div class="col-6">
						<div class="form-group">
							<label for="provider-sheetname">Feuille pour les Fournisseurs :</label>
							<select
								id="provider-sheetname"
								class={"form-control " + (providerSheet === null ? "is-invalid" : "is-valid")}
								bind:value={providerSheet}
								on:change={onProviderSheetChange}
								required
							>
								<option value={null}>Choissisez...</option>
								{#each sheetNames as sheetName}
									<option value={sheetName}>
										{sheetName}
									</option>
								{/each}
							</select>
						</div>

						{#if providerSheet !== null}
							<div class="form-group">
								<label for="provider-id">Cellule d'ID fournisseur :</label>
								<select
									id="provider-id"
									class={"form-control " + (providerIDCell === null ? "is-invalid" : "is-valid")}
									bind:value={providerIDCell}
									on:change={() => onFindChange(Finder.PROVIDER_ID, providerCells[providerIDCell])}
									required
								>
									<option value={null}>Choissisez...</option>
									{#each providerCells as cell, i}
										<option value={i}>
											{cell}
										</option>
									{/each}
								</select>
							</div>

							<div class="form-group">
								<label for="provider-rating">Cellule de note fournisseur :</label>
								<select
									id="provider-rating"
									class={"form-control " + (providerRatingCell === null ? "is-invalid" : "is-valid")}
									bind:value={providerRatingCell}
									on:change={() => onFindChange(Finder.PROVIDER_RATING, providerCells[providerRatingCell])}
									required
								>
									<option value={null}>Choissisez...</option>
									{#each providerCells as cell, i}
										<option value={i}>
											{cell}
										</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</fieldset>

		<fieldset>
			<legend>Commandes</legend>

			<div class="form-group">
				<label for="order-file">Choissisez votre fichier :</label>
				<input
					id="order-file"
					type="file"
					class={"form-control" + (orderFiles.length < 1 ? " is-invalid" : " is-valid")}
					bind:files={orderFiles}
					on:change={onOrderUpload}
					required
				/>
			</div>

			{#if orderFiles.length > 0}
				<div class="row">
					<div class="col-6">
						<div class="form-group">
							<label for="order-customer-id">Cellule d'ID Client :</label>
							<select
								id="order-customer-id"
								class={"form-control " + (orderCustomerIDCell === null ? "is-invalid" : "is-valid")}
								bind:value={orderCustomerIDCell}
								on:change={() => onFindChange(Finder.ORDER_CUSTOMER_ID, orderCells[orderCustomerIDCell])}
								required
							>
								<option value={null}>Choissisez...</option>
								{#each orderCells as cell, i}
									<option value={i}>
										{cell}
									</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="col-6">
						<div class="form-group">
							<label for="order-provider-id">Cellule d'ID Fournisseur :</label>
							<select
								id="order-provider-id"
								class={"form-control " + (orderProviderIDCell === null ? "is-invalid" : "is-valid")}
								bind:value={orderProviderIDCell}
								on:change={() => onFindChange(Finder.ORDER_PROVIDER_ID, orderCells[orderProviderIDCell])}
								required
							>
								<option value={null}>Choissisez...</option>
								{#each orderCells as cell, i}
									<option value={i}>
										{cell}
									</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label for="order-date">Cellule de date</label>
					<select
						id="order-date"
						class={"form-control " + (orderDateCell === null ? "is-invalid" : "is-valid")}
						bind:value={orderDateCell}
						on:change={() => onFindChange(Finder.ORDER_DATE, orderCells[orderDateCell])}
						required
					>
						<option value={null}>Choissisez...</option>
						{#each orderCells as cell, i}
							<option value={i}>
								{cell}
							</option>
						{/each}
					</select>
				</div>
			{/if}
		</fieldset>

		<fieldset>
			<legend>Ajuster les notations</legend>

			<div class="form-group">
				<label for="rating-provider">Ajuster l'importance de la note fournisseur :</label>
				<input
					id="rating-provider"
					type="number"
					class="form-control"
					bind:value={stxProviderRating}
				/>
			</div>

			<div class="form-group">
				<label for="rating-date">Ajuster l'importance de la date :</label>
				<input
					id="rating-date"
					type="number"
					class="form-control"
					bind:value={stxDate}
				/>
			</div>

			<div class="form-group">
				<label for="rating-customer">Ajuster l'importance de la note client :</label>
				<input
					id="rating-customer"
					type="number"
					class="form-control"
					bind:value={stxCustomerRating}
				/>
			</div>
		</fieldset>

		<div class="form-group text-right">
			<button type="submit" class="btn btn-success">Valider</button>
		</div>
	</form>
</main>

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
