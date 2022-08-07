<script lang="ts">
	import { getTypesenseClient, createBooksCollection } from '$lib/typesense';
	import type { SearchResponse } from 'typesense/lib/Typesense/Documents';

	// Create client
	const client = getTypesenseClient();

	// Create books collection if not already exists
	createBooksCollection().catch(console.log);

	let searchResult: SearchResponse<{}>;
</script>

<h1>Typesense practice</h1>

<p>Typesense is an open source text-search engine.</p>

<label for="search">Search:</label>
<input id="search" type="text" on:change />

<div>
	{#each searchResult?.hits || [] as hit}
		<li>{hit.document}</li>
	{/each}
</div>
