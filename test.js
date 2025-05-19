import { mimeToExtensions, extensionToMime } from './index.js';
import assert from 'node:assert';

const mimeType = 'application/javascript';
const extension = 'js';

assert.equal(
  await mimeToExtensions(mimeType)
    .then((extensions) => extensions.includes(extension)),
  true);

assert.equal(
  await extensionToMime(extension)
    .then((mimeTypes) => mimeTypes.includes(mimeType)),
  true);
