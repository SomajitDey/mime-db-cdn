#!/usr/bin/env node
// Brief: Returns the latest release for https://github.com/jshttp/mime-db

const url = 'https://api.github.com/repos/jshttp/mime-db/releases/latest';
const latest = await fetch(url)
  .then((response) => {
    if (response.ok) return response.json();
    throw new Error('Failed to fetch latest release for https://github.com/jshttp/mime-db');
  })
  .then((obj) => obj.tag_name);
console.log(latest.startsWith('v') ? latest.substring(1) : latest);
