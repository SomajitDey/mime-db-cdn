#!/usr/bin/env node
// Brief: Builds current database from the MIME-type DB at https://github.com/jshttp/mime-db
// Argument: [<ref>], optionally provide a reference (branch/tag/commitSHA) to download from, default: latest

import { mkdir, writeFile, appendFile } from 'node:fs/promises';

// Fetch database (db) from https://github.com/jshttp/mime-db
// ref: mime-db reference (branch/tag/commitSHA) to fetch the database from
const ref = process.argv[2] ?? 'latest';
const cdnLink = `https://cdn.jsdelivr.net/gh/jshttp/mime-db@${ref}/db.json`;
const db = await fetch(cdnLink).then((response) => response.json());

// Data for Extensions => MIME-type are stored in ./extensions
// Create ./extensions if non-existing
await mkdir('./extensions', { recursive: true });

// Brief: Save MIME-type data at ./mime-types/<MIME-type>/data.json
async function saveMimeData (mimeType) {
  const dir = `./mime-types/${mimeType}`;
  const data = db[mimeType];
  await mkdir(dir, { recursive: true }) // Create the directory if non-existing
    .then(() => {
      writeFile(`${dir}/data.json`, JSON.stringify(data));
    });
}

// Brief: Save file-extension to MIME-type lookup data for any given MIME-type
// Each file-extension lists its compatible MIME-types within ./extensions/type.<extension>
async function saveExtToMime (mimeType) {
  const extensions = db[mimeType].extensions ?? [];
  if (extensions.length === 0) return;

  const pending = []; // To hold all pending promises
  for (const extension of extensions) {
    const path = `./extensions/type.${extension}`;
    pending.push(appendFile(path, mimeType + '\n', { flush: true }));
  }
  await Promise.all(pending);
}

// Loop over all MIME-types in the database
// Ensure only one MIME-type is processed completely at a time. For extensions shared
//  between multiple MIME-types, this helps avoid race-conditions between saveExtToMime()s
//  while appending a datafile for the shared extensions. Thus, no lock-file needed.
for (const mimeType in db) {
  // Await ensures one MIME-type is processed completely at a time
  await Promise.all([
    saveMimeData(mimeType),
    saveExtToMime(mimeType)
  ]);
}
console.log(`Built Database from http://github.com/jshttp/mime-db@${ref}`);
