#!/usr/bin/env node
// Brief: Builds current database from the MIME-type DB at https://github.com/jshttp/mime-db
// Argument: [<ref>], git-reference (branch/tag/commitSHA) to download from, default: latest
// Notes: mime-db stores the database as a single JSON. After downloading it to a local file,
//   we must stream it while reading, in order to keep the memory footprint low.

import { mkdir, writeFile, appendFile, opendir, readFile, rm } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import StreamObject from 'stream-json/streamers/StreamObject.js';
import StreamJSON from 'stream-json';
import chain from 'stream-chain';
const { parser } = StreamJSON;
const { streamObject } = StreamObject;

// Fetch database from https://github.com/jshttp/mime-db and store at ./db.json
// ref: mime-db reference (branch/tag/commitSHA) to fetch the database from
const jsonDB = './db.json';
const ref = process.argv[2] ?? 'latest';
const cdnLink = `https://cdn.jsdelivr.net/gh/jshttp/mime-db@${ref}/db.json`;
await fetch(cdnLink)
  .then((response) => response.body)
  .then((stream) => writeFile(jsonDB, stream, { flush: true }));

// Brief: Save MIME-type data at ./mime-types/<MIME-type>/data.json
async function saveMimeData (mimeType, data = {}) {
  const dir = `./mime-types/${mimeType}`;
  await mkdir(dir, { recursive: true }); // Create the directory if non-existing
  await writeFile(`${dir}/data.json`, JSON.stringify(data));
}

// Brief: Save file-extension to MIME-type lookup data for any given MIME-type
// Each file-extension lists its compatible MIME-types within ./file-types/type.<extension>
async function saveExtToMime (mimeType, extensions = []) {
  if (extensions.length === 0) return;

  const pending = []; // To hold all pending promises
  for (const extension of extensions) {
    const path = `./file-types/type.${extension}`;
    pending.push(appendFile(path, mimeType + '\n', { flush: true }));
  }
  await Promise.all(pending);
}
// Create ./file-types if non-existing
await mkdir('./file-types', { recursive: true });

// Brief: Similar to saveMimeData() but for extensions. Saved inside ./extensions
async function saveExtData () {
  // Open ./file-types as a stream to read its entries, i.e. files, instead of readdir() from node:fs
  // readdir() would return an array of all files, which is memory consuming for large number of files
  const dir = await opendir('./file-types');
  for await (const dirent of dir) {
    const file = dirent.name;
    const extension = file.substring('type.'.length);
    const subdir = `./extensions/${extension}`;
    const [mimeTypes] = await Promise.all([
      readFile(`./file-types/${file}`, { encoding: 'utf8' })
        .then((contents) => contents.split('\n').slice(0, -1)),
      mkdir(subdir, { recursive: true })
    ]);
    await writeFile(`${subdir}/data.json`, JSON.stringify({ mimeTypes }));
  }
}

// Read ./db.json as a stream to keep memory footprint low regardless of the JSON's size
const stream = chain([
  createReadStream(jsonDB),
  parser(),
  streamObject()
]);

try {
  // Each chunk in `stream` holds data for one MIME-type.
  // Loop over all MIME-types in the database.
  // Ensure only one MIME-type is processed completely at a time. For extensions shared
  //  between multiple MIME-types, this helps avoid race-conditions between saveExtToMime()s
  //  while appending a datafile for the shared extensions. Thus, no lock-file needed.
  for await (const chunk of stream) {
    const mimeType = chunk.key;
    const data = chunk.value;
    const extensions = data.extensions;
    // Await ensures one MIME-type is processed completely at a time
    await Promise.all([
      saveMimeData(mimeType, data),
      saveExtToMime(mimeType, extensions)
    ]);
  }

  await saveExtData();

  console.log(`Built database from http://github.com/jshttp/mime-db@${ref}`);
} finally {
  // Cleanup
  await rm(jsonDB);
}
