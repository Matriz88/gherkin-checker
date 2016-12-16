#!/usr/bin/env node

let createReporter = require('./index')

const reporter = createReporter();

process.stdin
  .pipe(reporter)
  .pipe(process.stdout);

process.on('exit', status => {
  if (status === 1 || reporter.isFailed) process.exit(1);
});
