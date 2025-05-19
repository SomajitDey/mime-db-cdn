// Brief: API to access the DB at https://github.com/SomajitDey/mime-db-cdn/tree/database
// Note: Must work in both browser and server-side (e.g. Node).
// Note: Uses dynamic imports. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
// Note: Imports over network (for browsers) is still fast because of http-caching by the browser. 
// Note: Using JSON import, as it is widely-supported now. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with#browser_compatibility

// Params: <String>, MIME-type specification of format <type>/<subtype>[;<parameter>=<value>]
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types#structure_of_a_mime_type
// Returns: <Array>
// On error, rejects with message: 'Not Found'
export async function mimeToExtensions (mimeTypeSpec) {
  const [ mimeType ] = mimeTypeSpec.split(';'); // Removes trailing ;<parameter>=<value> if any
  const { default: data } = await import (
    `./mime-types/${mimeType}/data.json`,
    { with: { type: 'json' } }
  ).catch((err) => {
    throw new Error('Not Found');
  });
  return data.extensions ?? [];
}

// Params: <String>, path | filename with extension | extension with or without the leading dot
// Returns: <Array>
// On error, rejects with message: 'Not Found'
export async function extensionToMime (path) {
  const extension = path
    .split('/').pop() // Removed directory string
    .split('.').pop(); // Removed filename string
  // The above works even if `path` is just the extension, e.g. path = 'pdf' or path = '.pdf'
  const { default: data } = await import (
    `./extensions/${extension}/data.json`,
    { with: { type: 'json' } }
  ).catch((err) => {
    throw new Error('Not Found');
  });
  return data.mimeTypes ?? [];
}
