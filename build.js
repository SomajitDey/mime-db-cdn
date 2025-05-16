#!/usr/bin/env node
// Brief: Builds current database from the MIME-type DB at https://github.com/jshttp/mime-db
// Argument: [<ref>], optionally provide a reference (branch/tag/commitSHA) to download from, default: latest

import { mkdir, writeFile, link, rm } from 'node:fs/promises';

const ref = process.argv[2] ?? 'latest';

// Fetch the database from https://github.com/jshttp/mime-db
const cdnLink = `https://cdn.jsdelivr.net/gh/jshttp/mime-db@${ref}/db.json`;
const db = await fetch(cdnLink).then((response) => response.json());

// Data for Extensions => MIME-type are stored in './extensions'
// However, a temporary prototype file is stored in './extensions/tmp'
const tmpdir = './extensions/tmp';
await mkdir('./extensions/tmp', { recursive: true }); // Also creates ./extensions if non-existing

async function saveMimeData (mimeType) {
  const dir = `./mime-types/${mimeType}`;
  const data = db[mimeType];
  await mkdir(dir, { recursive: true })
    .then(() => {
      writeFile(`${dir}/data.json`, JSON.stringify(data));
    });
}

async function saveExtToMime (mimeType) {
  const extensions = db[mimeType].extensions ?? [];
  if (extensions.length === 0) return;

  // Write the MIME-type to a prototype file
  const protoFile = `${tmpdir}/${mimeType.replace('/', '.')}`;
  await writeFile(protoFile, mimeType);

  // Hard link each extension path to the prototype file, ignore 'EEXIST' errors
  const pending = []; // To hold all pending promises
  for (const extension of extensions) {
    const path = `./extensions/type.${extension}`;
    pending.push(
      link(protoFile, path)
        .catch((err) => {
          if (err.code !== 'EEXIST') throw err;
        })
    );
  }
  await Promise.all(pending);
}

try {
  // Loop over all MIME-types in the database
  for (const mimeType in db) {
    await Promise.all([
      saveMimeData(mimeType),
      saveExtToMime(mimeType)
    ]);
  }
  console.log(`Built Database from http://github.com/jshttp/mime-db@${ref}`);
} finally {
  // Cleanup
  await rm(tmpdir, { recursive: true, force: true });
}
