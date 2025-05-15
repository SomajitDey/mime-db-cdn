# 💁 mime-db-cdn
CDN-compatible version of [mime-db](https://github.com/jshttp/mime-db).

## Why this project?
[mime-db](https://github.com/jshttp/mime-db) managed to stay un-opinionated about an API by packing the entire MIME-type database into a [JSON file](https://github.com/jshttp/mime-db/blob/master/db.json). Using `mime-db` directly, therefore, entails downloading the entire database at once, albeit from a CDN. If you just need to query a handful of MIME-types or file-extensions, downloading the entire database followed by loading and retaining it in memory would be an overkill. This problem persists with popular opinionated APIs based on `mime-db`, such as [mime](https://www.npmjs.com/package/mime) or [mime-types](https://www.npmjs.com/package/mime-types), which must first store the entire database locally on the user's machine in order to function.

The current project solves this problem by fragmenting `mime-db` into tiny files, each storing data only for one of the available MIME-types or file-extensions. To understand the file-structure, explore the directories in the [database branch](https://github.com/SomajitDey/mime-db-cdn/tree/database). Each of these files is readily downloadable using any of the free CDNs that serve GitHub contents, e.g.
- [jsdelivr](https://www.jsdelivr.com/?docs=gh)
- [statically](https://github.com/staticallyio/statically)
- [raw.githack](https://raw.githack.com/)

or even using
- `https://raw.githubusercontents.com/somajitdey/mime-db-cdn/database/<path>`

## Usage

### MIME-type to file-extension(s)
Download from CDN as JSON:
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@database/mime-types/<mime-type>/data.json
```
replace `<mime-type>` with your chosen MIME-type e.g. `image/jpeg`.

### File-extension to MIME-type(s)
Download from CDN:
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@database/extensions/type.<extension>
```
replace `<extension>` with your chosen extension e.g. `jpg`.

👉 The `Content-Type` header from the CDN's http-response might contain the desired MIME-type, as provided by the CDN provider.

👉 However, we recommend using the textual data contained within the response's body, formatted as one MIME-type per line, as it is taken from the [mime-db](https://github.com/jshttp/mime-db).

👉 To download the data with `Content-Type: text/plain` http-response-header use:

```
https://raw.githubusercontents.com/somajitdey/mime-db-cdn/database/extensions/type.<extension>
```

### Examples
The database may be found at branch [database](https://github.com/SomajitDey/mime-db-cdn/tree/database) or any of the [tags](https://github.com/SomajitDey/mime-db-cdn/tags) that has a [release with the same name in mime-db](https://github.com/jshttp/mime-db/tags).

👉 In production, it is recommended to use a specific [tag](https://github.com/SomajitDey/mime-db-cdn/tags) instead of the `database` string in the CDN URLs provided above.

For example, to download the MIME-type for `image/jpeg` from [mime-db release v1.54.0](https://github.com/jshttp/mime-db/releases/tag/v1.54.0), use CDN:

https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@v1.54.0/mime-types/image/jpeg/data.json

To get the MIME-type corresponding to `.mjs`, use CDN:

https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@v1.54.0/extensions/type.mjs

## Reliability of this database
The upstream [mime-db](https://github.com/jshttp/mime-db) is [checked hourly for updates](https://github.com/SomajitDey/mime-db-cdn/actions). If a new release is available upstream, [this database](https://github.com/SomajitDey/mime-db-cdn/tree/database) is built afresh from that release and a new [git-tag](https://github.com/SomajitDey/mime-db-cdn/tags) is released with the same name as the [latest mime-db release](https://github.com/jshttp/mime-db/releases).

# Contribute
To register new media types in the database [contribute directly to mime-db](https://github.com/jshttp/mime-db#contributing).

If you like this project, you can show your appreciation by
- [giving it a star](https://github.com/SomajitDey/mime-db-cdn/stargazers) ⭐
-  sponsoring me through 👇

[![Sponsor](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://buymeacoffee.com/SomajitDey)

Thank you 💚.
