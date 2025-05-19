// Brief: API to access the DB at https://github.com/SomajitDey/mime-db-cdn/tree/database
//   Must work in both browser and server-side (e.g. Node).

// Params: <String>, MIME-type specification of format <type>/<subtype>[;<parameter>=<value>]
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types#structure_of_a_mime_type
export async function mimeToExtensions (mimeTypeSpec) {
  const [ mimeType ] = mimeTypeSpec.split(';'); // Removes trailing ;<parameter>=<value> if any
  const { default: data } = await import (`./mime-types/${mimeType}/data.json`, { with: { type: 'json' } });
  return data.extensions ?? [];
}

// Params: <String>, path | filename with extension | extension with or without the leading dot
export async function extensionToMime (path) {
  const extension = path
    .split('/').pop() // Removed directory string
    .split('.').pop(); // Removed filename string
  // The above works even if `path` is just the extension, e.g. path = 'pdf' or path = '.pdf'
  const { default: data } = await import (`./extensions/${extension}/data.json`, { with: { type: 'json' } });
  return data.mimeTypes ?? [];
}
