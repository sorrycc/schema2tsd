#!/usr/bin/env node

const yParser = require('yargs-parser');
const { readFileSync, writeFileSync } = require('fs');
const { join, dirname } = require('path');
const mkdirp = require('mkdirp');

const args = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
  },
  boolean: ['version'],
});

if (args.version) {
  console.log(require('../package.json').version);
  process.exit(0);
}

const cwd = process.cwd();
const schemaFilePath = args.schema || 'config.schema';
const schema = readFileSync(join(cwd, schemaFilePath), 'utf-8');
require('./index')(schema)
  .then(res => {
    const outputPath = join(cwd, args.output || 'src/typing.d.ts');
    mkdirp.sync(dirname(outputPath));
    writeFileSync(outputPath, res, 'utf-8');

    if (args.print) {
      console.log(res);
    } else {
      console.log('Done!');
    }
  }).catch(e => {
    console.error(e);
  });
