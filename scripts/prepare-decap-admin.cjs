const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve('cms/admin');
const destination = path.resolve('static/admin');
fs.rmSync(destination, {recursive: true, force: true});
fs.cpSync(source, destination, {recursive: true});
