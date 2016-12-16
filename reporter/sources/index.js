let _ = require('lodash');
let chalk = require('chalk');
let duplexer = require('duplexer');
let figures = require('figures');
let through2 = require('through2');
let parser = require('tap-parser');
let prettyMs = require('pretty-ms');

const INDENT = '  ';
const FIG_TICK = figures.tick;
const FIG_CROSS = figures.cross;

const createReporter = (options) => {
    const config = _.merge({
        type: 'full'
    }, options);

    const output = through2();
    const p = parser();
    const stream = duplexer(p, output);
    const startedAt = Date.now();

    const print = (input = '', indentLevel = 0) => {
        let indent = '';

        for (let i = 0; i < indentLevel; ++i) {
            indent += INDENT;
        }

        input.split('\n').forEach(line => {
            output.push(`${indent}${line}`);
            output.push('\n');
        });
    };

    const handleTest = name => {
        print();
        print(chalk.cyan(name), 1);
    };

    const handleAssertSuccess = assert => {
        if (config.type === 'light') return;
        const name = assert.name;
        print(`${chalk.green(FIG_TICK)}  ${chalk.dim(name)}`, 2)
    };

    const handleAssertFailure = assert => {
        const name = assert.name;
        const diag = assert.diag;

        print(`${chalk.red(FIG_CROSS)}  ${chalk.red(name)}`, 2);
        print(`${chalk.red('Expected: ' + diag.expected)}`, 4);
        print(`${chalk.red('Actual: ' + diag.actual)}`, 4);
        print(`${chalk.red('Must be: ' + diag.operator)}`, 4);
        print('');
    };

    const handleComplete = result => {
        const finishedAt = Date.now();

        print();
        print(
            chalk.green(`passed: ${result.pass}  `) +
            chalk.red(`failed: ${result.fail || 0}  `) +
            chalk.white(`of ${result.count} tests  `) +
            chalk.dim(`(${prettyMs(finishedAt - startedAt)})`)
        );
        print();

        if (result.ok) {
            print(chalk.green(`All of ${result.count} tests passed!`));
        } else {
            print(chalk.red(`${result.fail || 0} of ${result.count} tests failed.`));
            stream.isFailed = true;
        }

        print();
    };

    p.on('comment', (comment) => {
        const trimmed = comment.replace('# ', '').trim();

        if (/^tests\s+[0-9]+$/.test(trimmed)) return;
        if (/^pass\s+[0-9]+$/.test(trimmed)) return;
        if (/^fail\s+[0-9]+$/.test(trimmed)) return;
        if (/^ok$/.test(trimmed)) return;

        handleTest(trimmed);
    });

    p.on('assert', (assert) => {
        if (assert.ok) return handleAssertSuccess(assert);

        handleAssertFailure(assert);
    });

    p.on('complete', handleComplete);

    p.on('child', (child) => {
    });

    p.on('extra', extra => {
        print(chalk.yellow(`${extra}`.replace(/\n$/, '')), 4);
    });

    return stream;
};

module.exports = createReporter;
