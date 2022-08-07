<script lang="ts">
	import { createBooksCollection, searchBooks, type Book } from '$lib/typesense';
	import { onMount } from 'svelte';
	import type { SearchResponse } from 'typesense/lib/Typesense/Documents';

	// Create books collection if not already exists
	onMount(() => createBooksCollection().then(() => (ready = true)));
	let ready = false;

	// Create to search input changes
	let searchQuery = '';
	let searchResult: SearchResponse<Book>;
	async function search(q: string) {
		searchResult = await searchBooks(q, 'title', 'ratings_count:desc');
	}
	$: if (ready) search(searchQuery);
</script>

<div class="prose mx-auto">
	<h1 class="mt-10">Typesense practice</h1>
	<p>Typesense is an open source text-search engine.</p>
</div>

<div class="form-control w-full max-w-xs my-5 mx-auto">
	<input
		id="search"
		type="text"
		placeholder="Type here"
		class="input input-bordered w-full max-w-xs input-primary"
		bind:value={searchQuery}
	/>
</div>

<div class="p-5 flex flex-wrap justify-between gap-4 flex-">
	{#each searchResult?.hits || [] as hit}
		{@const rating = [...Array(Math.round(hit.document.average_rating * 2)).keys()]}
		<div class="card card-side bg-base-100 shadow-xl flex-grow">
			<figure><img src={hit.document.image_url || ''} alt="Movie" /></figure>
			<div class="card-body">
				<h2 class="card-title">{hit.document.title}</h2>
				<p>{hit.document.authors}</p>
				<p>{hit.document.publication_year}</p>

				<div class="flex">
					<div class="mr-2">{hit.document.average_rating}</div>
					{#each rating as _, i}
						<div
							class="mask mask-star bg-yellow-400 w-3 h-5 mask-half-1"
							class:mask-half-2={i % 2}
						/>
					{/each}
				</div>
				<div class="card-actions justify-end">
					<a href={'/books/' + hit.document.id}>
						<button class="btn btn-primary">More info</button>
					</a>
				</div>
			</div>
		</div>
	{/each}
</div>
