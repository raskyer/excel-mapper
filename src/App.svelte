<script>
	import { uploadFile, findSheet, findCell, extractSheetData, compute } from './utils';

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
	let orderTimeCell = null;

	// Settings
	let stxProviderRating = 3;
	let stxDate = 2;
	let stxCustomerRating = 1;

	const handleCustomerSheet = workbook => {
			sheetNames = [...workbook.SheetNames];
			dataWorkbook = workbook;
			customerSheet = findSheet(sheetNames, 'Client');
			providerSheet = findSheet(sheetNames, 'Transporteur');
	};

	const handleOrderSheet = workbook => {
		orderWorkbook = workbook;
		const sheet = orderWorkbook.Sheets[orderWorkbook.SheetNames[0]];
		const data = extractSheetData(sheet);
		orderCells = data[0];
		orderCustomerIDCell = findCell(orderCells, 'Nom Client');
		orderProviderIDCell = findCell(orderCells, 'Nom Fourn.');
		orderDateCell = findCell(orderCells, 'Date');
		orderTimeCell = findCell(orderCells, 'Date');
	};

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
			orderTimeCell,
			stxProviderRating,
			stxDate,
			stxCustomerRating
		};

		compute(settings, dataWorkbook, orderWorkbook);
	};

	$: {
		if (dataFiles.length > 0) {
			uploadFile(dataFiles[0], handleCustomerSheet);
		}
	}

	$: {
		if (orderFiles.length > 0) {
			uploadFile(orderFiles[0], handleOrderSheet);
		}
	}

	// On First XLS Load & Customer Sheet change, update customer cells
	$: {
		if (dataWorkbook !== null && customerSheet !== null) {
			const sheet = dataWorkbook.Sheets[customerSheet];
			const data = extractSheetData(sheet);
			customerCells = data[0];
			customerIDCell = customerIDCell ? customerIDCell : findCell(customerCells, 'Nom');
			customerRatingCell = customerRatingCell ? customerRatingCell : findCell(customerCells, 'Sp');
		}
	}

	// On First XLS Load & Provider Sheet change, update provider cells
	$: {
		if (dataWorkbook !== null && providerSheet !== null) {
			const sheet = dataWorkbook.Sheets[providerSheet];
			const data = extractSheetData(sheet);
			providerCells = data[0];
			providerIDCell = providerIDCell ? providerIDCell : findCell(providerCells, 'Nom');
			providerRatingCell = providerRatingCell ? providerRatingCell : findCell(providerCells, 'Note');
		}
	}
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

				<div class="form-group">
					<label for="order-time">Cellule d'horaire</label>
					<select
						id="order-time"
						class={"form-control " + (orderTimeCell === null ? "is-invalid" : "is-valid")}
						bind:value={orderTimeCell}
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

		<div class="form-group">
			<button type="submit" class="btn btn-success">Valider</button>
		</div>
	</form>
</main>

<style>
fieldset {
	margin: 10px 0px;
	border: 1px grey solid;
	padding: 10px;
}

legend {
	font-size: 1em;
	background: grey;
	color: white;
	text-align: center;
}
</style>
