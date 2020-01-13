<script>
	import XLSX from 'xlsx';

	// Files
	let customerProviderFiles = [];
	let orderFiles = [];
	let sheetNames = [];
	let customerProviderWorkbook = null;
	
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

	const handleCustomerSheet = workbook => {
			console.log(workbook);
			sheetNames = [...workbook.SheetNames];
			customerProviderWorkbook = workbook;
	};

	const handleOrderSheet = workbook => {};

	const handleFile = (file, callback) => {
		const reader = new FileReader();
		reader.onload = function(e) {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, {type: 'array'});
			callback(workbook);
		};
		reader.readAsArrayBuffer(file);
	};

	$: {
		if (customerProviderFiles.length > 0) {
			handleFile(customerProviderFiles[0], handleCustomerSheet);
		}
		if (orderFiles.length > 0) {
			handleFile(orderFiles[0], handleOrderSheet);
		}
	}

	// On First XLS Load & Customer Sheet change, update customer cells
	$: {
		if (customerProviderWorkbook !== null && customerSheet !== null) {
			const sheet = customerProviderWorkbook.Sheets[customerSheet];
			customerCells = Object.keys(sheet)
				.filter(k => k.match(/[A-Z]1/g))
				.map(k => sheet[k].v);
		}
	}

	// On First XLS Load & Provider Sheet change, update provider cells
	$: {
		if (customerProviderWorkbook !== null && providerSheet !== null) {
			const sheet = customerProviderWorkbook.Sheets[providerSheet];
			providerCells = Object.keys(sheet)
				.filter(k => k.match(/[A-Z]1/g))
				.map(k => sheet[k].v);
		}
	}
</script>

<main class="container">
	<h1>Excel Mapper</h1>
	<img src="" alt="logo"/>

	<form>
		<fieldset>
			<legend>Clients / Fournisseurs</legend>

			<div class="form-group">
				<label for="customer-provider-file">Choissisez votre fichier :</label>
				<input
					id="customer-provider-file"
					type="file"
					class={"form-control " + (customerProviderFiles.length < 1 ? "is-invalid" : "is-valid")}
					bind:files={customerProviderFiles}
					required
				/>
			</div>

			{#if customerProviderFiles.length > 0}
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
									{#each customerCells as cell}
										<option value={cell}>
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
									{#each customerCells as cell}
										<option value={cell}>
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
									{#each providerCells as cell}
										<option value={cell}>
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
									{#each providerCells as cell}
										<option value={cell}>
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
							<select id="order-customer-id" class="form-control">
							</select>
						</div>
					</div>

					<div class="col-6">
						<div class="form-group">
							<label for="order-provider-id">Cellule d'ID Fournisseur :</label>
							<select id="order-provider-id" class="form-control">
							</select>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label for="order-date">Cellule de date</label>
					<select id="order-date" class="form-control">
					</select>
				</div>

				<div class="form-group">
					<label for="order-time">Cellule d'horaire</label>
					<select id="order-time" class="form-control">
					</select>
				</div>
			{/if}
		</fieldset>

		<fieldset>
			<legend>Ajuster les notations</legend>

			<div class="form-group">
				<label for="rating-adjust">Ajuster l'importance de la note fournisseur :</label>
				<input type="number" class="form-control" value="8" />
			</div>

			<div class="form-group">
				<label for="rating-adjust">Ajuster l'importance de la date :</label>
				<input type="number" class="form-control" value="4" />
			</div>

			<div class="form-group">
				<label for="rating-adjust">Ajuster l'importance de la note client :</label>
				<input type="number" class="form-control" value="2" />
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
