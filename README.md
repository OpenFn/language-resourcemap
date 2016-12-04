Language ResourceMap
==============

Language Pack for building expressions and operations for working with
the [resourcemap API](https://github.com/instedd/resourcemap/wiki/REST_API).

Documentation
-------------

We are working towards this to start: https://github.com/instedd/resourcemap/wiki/REST_API#create-site

Config
------
ResourceMap uses Basic Auth.
```json
{
  "baseUrl": "http://some-site-of-yours.com:8080"
  "username": "blah",
  "password": "shhh"
}
```

Expressions
-----------
`/api/collections/:collection_id/sites.json`
```js
submitSite({siteData})
```

Development
-----------

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
