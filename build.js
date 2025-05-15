#!/usr/bin/env node
// Brief: Builds current DataBase from the MIME-type DB at https://github.com/jshttp/mime-db
// Argument: [<ref>], optionally provide a reference (branch/tag/commitSHA) to download from, default: latest

import { mkdir, writeFile, link } from 'node:fs/promises';

const ref = process.argv[2] ?? 'latest';

// Fetch the DataBase from https://github.com/jshttp/mime-db
const cdnLink = `https://cdn.jsdelivr.net/gh/jshttp/mime-db@${ref}/db.json`;
const db = await fetch(cdnLink).then((response) => response.json());

// Data for Extensions => MIME-type are stored in './extensions'
await mkdir('./extensions', { recursive: true });

async function saveMimeData (mimeType) {
  const dir = `./mime-types/${mimeType}`;
  const data = db[mimeType];
  mkdir(dir, { recursive: true })
    .then(() => {
      writeFile(`${dir}/data.json`, JSON.stringify(data));
    });
}

async function saveExtToMime (mimeType) {
  const extensions = db[mimeType].extensions ?? [];
  if (extensions.length === 0) return;

  const [first, ...rest] = extensions;

  // Write the MIME type to a prototype file, with the first extension, ignore 'EEXIST' errors
  const protoFile = `./extensions/type.${first}`;
  await writeFile(protoFile, mimeType);

  // Hard link rest of the extensions to the prototype file, ignore 'EEXIST' errors
  const pending = []; // To hold all pending promises
  for (const extension of rest) {
    pending.push(
      link(protoFile, `./extensions/type.${extension}`)
        .catch((err) => {
          if (err.code !== 'EEXIST') throw err;
        })
    );
  }
  return Promise.all(pending);
}

const pending = []; // To hold all pending promises
// Loop over all MIME types in the DataBase
for (const mimeType in db) {
  pending.push(
    saveMimeData(mimeType),
    saveExtToMime(mimeType)
  );
}

await Promise.all(pending);
console.log(`Built Database from http://github.com/jshttp/mime-db@${ref}`);
