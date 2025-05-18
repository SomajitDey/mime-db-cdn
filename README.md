# 💁 mime-db-cdn
CDN-compatible version of [mime-db](https://github.com/jshttp/mime-db).

## Why this project?
[mime-db](https://github.com/jshttp/mime-db) packages the entire MIME-type database into a [JSON file](https://github.com/jshttp/mime-db/blob/master/db.json). Using `mime-db` directly, therefore, entails downloading the entire database at once, albeit from a CDN. If you just need to query a handful of MIME-types or file-extensions, downloading the entire database followed by loading and retaining it in memory would be an overkill. This problem persists with popular packages based on `mime-db`, such as [mime](https://www.npmjs.com/package/mime) or [mime-types](https://www.npmjs.com/package/mime-types), which, in order to function, must first store the entire database locally on the user's machine.

The current project solves this problem by fragmenting `mime-db` into tiny JSON files, each storing data only for one of the available MIME-types or file-extensions. To understand the file-structure, explore the directories in the [database branch](https://github.com/SomajitDey/mime-db-cdn/tree/database). Each of these JSON files is readily downloadable using any of the free CDNs that serve GitHub contents, e.g.
- [jsdelivr](https://www.jsdelivr.com/?docs=gh)
- [statically](https://github.com/staticallyio/statically)
- [raw.githack](https://raw.githack.com/)


## Usage

### MIME-type to file-extension(s)
Download from CDN as JSON:
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@database/mime-types/<mime-type>/data.json
```
replace `<mime-type>` with your chosen MIME-type e.g. `image/jpeg`.

👉 Apart from `extensions`, the JSON for a MIME-type also contains [these relevant data](https://github.com/jshttp/mime-db#data-structure).

### File-extension to MIME-type
Download from CDN:
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@database/file-types/type.<extension>
```
replace `<extension>` with your chosen extension e.g. `jpg`.

👉 The `Content-Type` header from the CDN's http-response might contain the desired MIME-type, as provided by the CDN provider.

👉 However, we recommend using the textual data contained within the http-response's body, since it is taken from the [mime-db](https://github.com/jshttp/mime-db). For extensions shared by multiple MIME-types, one MIME-type is listed per line.

👉 To download the data as JSON, use:
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@database/extensions/<extension>/data.json
```

### Examples
The database may be found at branch [database](https://github.com/SomajitDey/mime-db-cdn/tree/database) or any of the [tags](https://github.com/SomajitDey/mime-db-cdn/tags) in the format `<version>-<mime-db-version>`.

👉 In production, it is recommended to use a specific [tag](https://github.com/SomajitDey/mime-db-cdn/tags) in place of `database` in the CDN URLs provided above.

For example, to download the MIME-type for `image/jpeg` from [mime-db release v1.54.0](https://github.com/jshttp/mime-db/releases/tag/v1.54.0), use:

https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@1.0.0-1.54.0/mime-types/image/jpeg/data.json

To get the MIME-type corresponding to `.jpg`, use:

https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@1.0.0-1.54.0/file-types/type.jpg

or download as JSON using:

https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@1.0.0-1.54.0/extensions/jpg/data.json

## Reliability of this database
The upstream [mime-db](https://github.com/jshttp/mime-db) is [checked hourly for updates](https://github.com/SomajitDey/mime-db-cdn/actions). If a new [release](https://github.com/jshttp/mime-db/releases) is available upstream, [this database](https://github.com/SomajitDey/mime-db-cdn/tree/database) is [built](scripts/build-db.js) afresh from that release. A new [git-tag](https://github.com/SomajitDey/mime-db-cdn/tags) is then released which includes the mime-db version as a [semver pre-release](https://semver.org/).

# Contribute
To register new media types in the database, [contribute directly to mime-db](https://github.com/jshttp/mime-db#contributing).

If you like this project, you can show your appreciation by
- [giving it a star](https://github.com/SomajitDey/mime-db-cdn/stargazers) ⭐
-  sponsoring me through 👇

[![Sponsor](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://buymeacoffee.com/SomajitDey)

Thank you 💚.
