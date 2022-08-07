<script lang="ts">
	import { getTypesenseClient, createBooksCollection, searchBooks } from '$lib/typesense';
	import type { SearchResponse } from 'typesense/lib/Typesense/Documents';

	// Create client
	const client = getTypesenseClient();

	// Create books collection if not already exists
	createBooksCollection().catch(console.log);

	// Create to search input changes
	let searchQuery = '';
	let searchResult: SearchResponse<{}>;
	async function search(q: string) {
		searchResult = await searchBooks(q, 'title', 'ratings_count:desc');
	}

	$: search(searchQuery);
</script>

<h1>Typesense practice</h1>

<p>Typesense is an open source text-search engine.</p>

<label for="search">Search:</label>
<input id="search" type="text" bind:value={searchQuery} />

<div>
	{#each searchResult?.hits || [] as hit}
		<div>{JSON.stringify(hit.document, null, 2)}</div>
	{/each}
</div>
