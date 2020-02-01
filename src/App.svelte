<script>
	import { fade } from 'svelte/transition';
	import { createWorkbook, downloadWorkbook } from './utils/excel';
	import Form from './Form.svelte';
	import Result from './Result.svelte';

	let data = null;

	const onCompute = finalData => {
		data = finalData;
		const wb = createWorkbook(finalData);
		//downloadWorkbook(wb);
	};
</script>

<nav class="navbar fixed-top navbar-dark bg-dark">
	<a class="navbar-brand" href="/">
		Excel Mapper
	</a>
</nav>

<main class="container">
	{#if data === null}
		<div transition:fade>
			<Form onCompute={onCompute} />		
		</div>
	{:else}
		<div transition:fade>
			<Result data={data} />
		</div>
	{/if}
</main>

<style>
.container {
	margin-top: 80px;
}
</style>
