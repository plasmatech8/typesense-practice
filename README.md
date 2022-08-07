# typesense-practice

Following Typesense docs: https://typesense.org/docs/

> Typesense is an open-source, typo-tolerant search engine optimized for instant (typically sub-50ms) search-as-you-type experiences and developer productivity.
>
> If you've heard about ElasticSearch or Algolia, a good way to think about Typesense is that it is:
>
>    An open source alternative to Algolia, with some key quirks solved and
>    An easier-to-use batteries-included alternative to ElasticSearch

My impression is that Algolia is considered the open-source, comparatively cheap, relatively developer-friendly, modern alternative. It should be good. :)

It can be used for shop products, blogs, anything where items are added to your website that needs to be searchable.

Whenever a user creates a new item, a request to add a record must be sent to your seach engine database.

Contents:
- [typesense-practice](#typesense-practice)
  - [Local hosting an instance](#local-hosting-an-instance)
  - [Installing a client](#installing-a-client)
  - [Init client](#init-client)
  - [Init collection](#init-collection)
  - [Searching](#searching)

## Local hosting an instance

I will just use a Docker container. Data will be saved to `/tmp/typesense-data`.

Simplest way:
```bash
export TYPESENSE_API_KEY=xyz
mkdir /tmp/typesense-data

docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:0.23.1 \
  --data-dir /data --api-key=$TYPESENSE_API_KEY --enable-cors
```

Health check:
```bash
curl http://localhost:8108/health
```

## Installing a client

https://github.com/typesense/typesense-js

Install:
```bash
npm install --save typesense
```

## Init client

```js
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
```

## Init collection

```js
let booksSchema = {
    'name': 'books',
    'fields': [
        {'name': 'title', 'type': 'string' },
        {'name': 'authors', 'type': 'string[]', 'facet': true },

        {'name': 'publication_year', 'type': 'int32', 'facet': true },
        {'name': 'ratings_count', 'type': 'int32' },
        {'name': 'average_rating', 'type': 'float' }
    ],
    'default_sorting_field': 'ratings_count'
}

client.collections().create(booksSchema)
    .then(function (data) {
    console.log(data)
    })
```

## Searching

```js
let searchParameters = {
  'q'         : 'harry potter',
  'query_by'  : 'title',
  'sort_by'   : 'ratings_count:desc'
}

client.collections('books')
  .documents()
  .search(searchParameters)
  .then(function (searchResults) {
    console.log(searchResults)
  })
```