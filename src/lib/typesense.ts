import Typesense from 'typesense';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import booksData from './books.json';

export interface Book {
	title: string;
	authors: string[];
	publication_year: number;
	id: string;
	average_rating: number;
	image_url: string;
	ratings_count: number;
}

export function getTypesenseClient() {
	/*
	 *  Our JavaScript client library works on both the server and the browser.
	 *  When using the library on the browser, please be sure to use the
	 *  search-only API Key rather than the master API key since the latter
	 *  has write access to Typesense and you don't want to expose that.
	 */
	const client = new Typesense.Client({
		nodes: [
			{
				host: 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
				port: 8108, // For Typesense Cloud use 443
				protocol: 'http' // For Typesense Cloud use https
			}
		],
		apiKey: 'xyz',
		connectionTimeoutSeconds: 2
	});
	return client;
}

export async function createBooksCollection() {
	// Create collection
	const booksSchema: CollectionCreateSchema = {
		name: 'books',
		fields: [
			{ name: 'title', type: 'string' },
			{ name: 'authors', type: 'string[]', facet: true },
			{ name: 'publication_year', type: 'int32', facet: true },
			{ name: 'ratings_count', type: 'int32' },
			{ name: 'average_rating', type: 'float' }
		],
		default_sorting_field: 'ratings_count'
	};
	const client = getTypesenseClient();
	try {
		await client.collections('books').retrieve();
		console.log('Books collection already exists, using that one');
	} catch {
		console.log('Books collection does not exist, so creating one now');
		await client.collections().create(booksSchema);
		await client.collections('books').documents().import(booksData);
	}
}

export async function searchBooks(query: string, queryBy = 'title', sortBy = 'ratings_count:desc') {
	const searchParameters = { q: query, query_by: queryBy, sort_by: sortBy };
	const client = getTypesenseClient();
	const result = await client.collections<Book>('books').documents().search(searchParameters);
	return result;
}

export function addBook() {
	// TODO
}
