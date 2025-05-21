#!/usr/bin/env node
// Brief: Returns the latest release for provided repo
// Arg: <owner>/<repo>

const repo = process.argv[2];
if (!repo) throw new Error('Pass <owner>/<repo> as argument');
const url = `https://api.github.com/repos/${repo}/releases/latest`;
const latest = await fetch(url)
  .then((response) => {
    if (response.ok) return response.json();
    throw new Error(`Failed to fetch latest release for https://github.com/${repo}`);
  })
  .then((obj) => obj.tag_name);
console.log(latest.startsWith('v') ? latest.substring(1) : latest);
