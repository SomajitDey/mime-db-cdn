# 💁 mime-db-cdn
[![NPM Version](https://img.shields.io/npm/v/mime-db-cdn)](https://www.npmjs.com/package/mime-db-cdn)
[![Build](https://github.com/SomajitDey/mime-db-cdn/actions/workflows/build.yaml/badge.svg)](https://github.com/SomajitDey/mime-db-cdn/actions/workflows/build.yaml)
[![Test](https://github.com/SomajitDey/mime-db-cdn/actions/workflows/test.yaml/badge.svg)](https://github.com/SomajitDey/mime-db-cdn/actions/workflows/test.yaml)
[![Publish NPM package](https://github.com/SomajitDey/mime-db-cdn/actions/workflows/publish.yaml/badge.svg)](https://github.com/SomajitDey/mime-db-cdn/actions/workflows/publish.yaml)

🚀 A [mime-db](https://github.com/jshttp/mime-db) equivalent that lets you download just the data you need via multiple [CDNs](#usage). Unlike mime-db, one no more needs to download the [entire database file](https://github.com/jshttp/mime-db/blob/v1.54.0/db.json) at once.

🚀 Mirrors the complete mime-db database, including the unofficial MIME-types (`prs.*`, `x-*`, `vnd.*`).

🚀 Additionally includes `file-extension => MIME-type(s)` reverse lookup data, with the MIME-types [sorted in descending order of importance](https://github.com/jshttp/mime-types/issues/116).

🚀 Also offers a portable JavaScript [SDK](#javascript-sdk) to access the database through [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)s, providing memory-efficiency for both browsers and server-side runtimes.

## Motivation
[mime-db](https://github.com/jshttp/mime-db) packages the entire MIME-types database into a [JSON file](https://github.com/jshttp/mime-db/blob/v1.54.0/db.json). Using `mime-db` directly, therefore, entails downloading the entire database at once, albeit from a CDN. If you just need to query a handful of MIME-types or file-extensions, downloading the entire database followed by loading and retaining it in memory would be an overkill. This problem persists with popular packages based on `mime-db`, such as [mime](https://www.npmjs.com/package/mime) or [mime-types](https://www.npmjs.com/package/mime-types), which, in order to function, must first store the entire database locally on the user's machine.

The current project solves this problem by fragmenting `mime-db` into tiny JSON files, each storing data only for one of the available MIME-types or file-extensions. To understand the file-structure, explore the directories in the [database branch](https://github.com/SomajitDey/mime-db-cdn/tree/database). Each of these JSON files is readily downloadable using any of the free CDNs that serve GitHub or npm contents, e.g.
- [jsdelivr](https://www.jsdelivr.com/?docs=gh)
- [statically](https://github.com/staticallyio/statically)
- [raw.githack](https://raw.githack.com/)
- [unpkg](https://www.unpkg.com/)

## Usage
This section presents CDN links to download just the desired data from our MIME-types database using any HTTP client, e.g. 
- any browser,
- `curl` or `wget` in Linux,
- the `Fetch API` in JavaScript etc..

👉 For the JS-SDK usage, see the [SDK](#javascript-sdk) section below.

👉 `<ref>` below refers to either
- `database`, i.e. the [database branch](https://github.com/SomajitDey/mime-db-cdn/tree/database), or
- `<tag>`, i.e. any of the tags listed [here](https://github.com/SomajitDey/mime-db-cdn/tags), latest being the topmost one. See [versioning](#versioning) for more details.

👉 For simplicity, only 2 CDNs (jsdelivr and unpkg) are explicitly mentioned. It is trivial to construct similar URLs for other available CDNs.

### MIME-type to file-extension(s)
Download as JSON:

From jsdelivr,
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@<ref>/mime-types/<mime-type>/data.json
```

```
https://cdn.jsdelivr.net/npm/mime-db-cdn@<tag>/mime-types/<mime-type>/data.json
```

From unpkg,
```
https://unpkg.com/mime-db-cdn@<tag>/mime-types/<mime-type>/data.json
```

Above, replace `<mime-type>` with your chosen MIME-type e.g. `image/jpeg`.

👉 Apart from an `extensions` array, the JSON for a MIME-type also contains [these relevant data](https://github.com/jshttp/mime-db#data-structure). See [examples](#examples) below.

### File-extension to MIME-type(s)
Download as JSON:

From jsdelivr,
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@<ref>/extensions/<extension>/data.json
```

```
https://cdn.jsdelivr.net/npm/mime-db-cdn@<tag>/extensions/<extension>/data.json
```

From unpkg,
```
https://unpkg.com/mime-db-cdn@<tag>/extensions/<extension>/data.json
```

Above, replace `<extension>` with your chosen extension e.g. `jpg`.

👉 The JSON contains an array of `mimeTypes`. **Note that this array of MIME-types is sorted in descending order of importance** according to the same [logic](https://github.com/jshttp/mime-types/blob/v3.0.1/mimeScore.js) used by [mime-types](https://github.com/jshttp/mime-types). See [examples](#examples) below. If only one MIME-type is required, simply choose the first element from the array!

### Content-Type HTTP header

From jsdelivr,
```
https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@<ref>/file-types/type.<extension>
```

```
https://cdn.jsdelivr.net/npm/mime-db-cdn@<tag>/file-types/type.<extension>
```

From unpkg,
```
https://unpkg.com/mime-db-cdn@<tag>/file-types/type.<extension>
```

`Content-Type` header received for a `GET` request to the above URLs might contain the desired MIME-type, as provided by the CDN provider.

👉 The above links also return the actual MIME-types as text in the response body. For extensions shared by multiple MIME-types, one MIME-type is listed per line. Note that these MIME-types are not sorted in any particular order. If a sorted list is required, [download the JSON](#file-extension-to-mime-types).

### Versioning
The source `mime-db` release, from which our [database](https://github.com/SomajitDey/mime-db-cdn/tree/database) is built, is always recorded as a [semver pre-release](https://semver.org/).

Format: `<our version>-<source mime-db version>`

For example, our version [4.0.0-1.54.0](https://github.com/SomajitDey/mime-db-cdn/releases/tag/4.0.0-1.54.0) is equivalent to the `mime-db` release [v1.54.0](https://github.com/jshttp/mime-db/releases/tag/v1.54.0).

### Examples
Just click on any of the links in this section.

👉 Data for `image/jpeg` from [mime-db release v1.54.0](https://github.com/jshttp/mime-db/releases/tag/v1.54.0) =>

https://cdn.jsdelivr.net/gh/somajitdey/mime-db-cdn@4.0.0-1.54.0/mime-types/image/jpeg/data.json

👉 MIME-type(s) for file-extension `exe`=>

https://unpkg.com/mime-db-cdn@4.0.0-1.54.0/extensions/exe/data.json

👉 Proper `Content-Type` for file-extensions `json` and `png` =>

https://unpkg.com/mime-db-cdn@4.0.0-1.54.0/file-types/type.json

https://unpkg.com/mime-db-cdn@4.0.0-1.54.0/file-types/type.png

## JavaScript SDK

Our [JS-SDK](./index.js) is designed to be memory-efficient regardless of how big the original [MIME-type database](https://github.com/jshttp/mime-db/blob/master/db.json) ever becomes. This is acheived through [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)s, viz. importing data as and when needed.

For browsers, this means more requests to the [CDNs](#usage) in return for low memory footprint. Thanks to caching by the browsers, however, the increased CDN requests might ultimately be a non-issue.

For server-side runtimes like Node, dynamically importing tiny JSONs avoids complexities of [reading and parsing a huge JSON database using streams](https://www.npmjs.com/package/stream-json).

### Install / Import
For browsers:
```html
<script type="module">
    import { mimeToExtensions, extensionToMimes } from 'https://cdn.jsdelivr.net/npm/mime-db-cdn@4.0.0-1.54.0/index.min.js';

    // Your code here ...
</script>
```

For Node.js:

Install as
```bash
npm install mime-db-cdn
```

Import as
```javascript
import { mimeToExtensions, extensionToMimes } from 'mime-db-cdn';
```

### API
#### mimeToExtensions(`mimeType`)
Returns a promise that fulfills with an array of file-extensions.

`mimeType`

String representing a MIME-type with [structure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types#structure_of_a_mime_type):
```
type/subtype

type/subtype;parameter=value
```

The returned promise is rejected with `Not Found` error if the provided `mimeType` is unavailable in [mime-db](https://github.com/jshttp/mime-db).

Examples:
```javascript
console.log(await mimeToExtensions('application/mp4'));
// Prints [ 'mp4', 'mpg4', 'mp4s', 'm4p' ]

console.log(await mimeToExtensions('application/javascript; charset=utf-8'));
// Prints [ 'js' ]
```

#### extensionToMimes(`extension`)
Returns a promise that fulfills with an array of MIME-types.

`extension`

String representing either of
- path, e.g. `dir/subdir/file.ext`
- file-extension with or without the leading dot, e.g. `mp4`, `.mp4`
- file-name, e.g. `file.mp4`, `file.version.1.2.0.mp4`

The returned promise is rejected with `Not Found` error if the provided `mimeType` is unavailable in [mime-db](https://github.com/jshttp/mime-db).

Examples:
```javascript
console.log(await extensionToMimes('dir/subdir/path.version.js'));

console.log(await extensionToMimes('js'));

console.log(await extensionToMimes('.js'));

// Prints [ 'application/javascript', 'text/javascript' ]
```

### Alternatives
- [mime-db-lite](https://github.com/SomajitDey/mime-db-lite)

## Reliability of this database
The upstream [mime-db](https://github.com/jshttp/mime-db) is [checked daily for updates](https://github.com/SomajitDey/mime-db-cdn/actions). If a new [release](https://github.com/jshttp/mime-db/releases) is available upstream, [this database](https://github.com/SomajitDey/mime-db-cdn/tree/database) is [built](scripts/build-db.js) afresh from that release. A new [git-tag](https://github.com/SomajitDey/mime-db-cdn/tags), and an [npm package](https://www.npmjs.com/package/mime-db-cdn) are then released, with appropriate [versioning](#versioning).

# Contribute
To register new media types in the database, [contribute directly to mime-db](https://github.com/jshttp/mime-db#contributing).

If you like this project, you can show your appreciation by
- [giving it a star](https://github.com/SomajitDey/mime-db-cdn/stargazers) ⭐
-  sponsoring me through 👇

[![Sponsor](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://buymeacoffee.com/SomajitDey)

Thank you 💚.
