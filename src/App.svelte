<script>
	import { fade } from 'svelte/transition';
	import { createWorkbook } from './utils/excel';
	import Form from './Form.svelte';
	import Result from './Result.svelte';

	let data = null;

	const onCompute = finalData => {
		data = finalData;
		const wb = createWorkbook(finalData);
		console.log(finalData);
		console.log(wb);
	};
</script>

<main class="container">
	<h1>Excel Mapper</h1>
	<img src="" alt="logo"/>

	{#if data === null}
		<div transition:fade>
			<Form onCompute={onCompute} />		
		</div>
	{:else}
		<Result data={data} />
	{/if}
</main>
