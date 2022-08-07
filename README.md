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
