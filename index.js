let Gherkin = require('gherkin');
let parser = new Gherkin.Parser();
let tape = require('tape');

let path = require('path');

let readDirRecurs = require('./utils/utilities').readDirRecurs;
let readFileAsync = require('./utils/utilities').readFileAsync;

let performTest = require('./utils/test-runner');
let stepsCache = [];

const config = require('./config/default_config')

readDirRecurs(path.resolve(config.features_path), (err, data) => {
    if (err) throw err;

    tape('Check gherkin components', assert => {
        data.forEach(file => {
            let fileReadTask = readFileAsync(file);
            fileReadTask.then(data => {
                let gherkinDocument = parser.parse(data);
                let compiledGherkin = new Gherkin.Compiler().compile(gherkinDocument);

                compiledGherkin.forEach(scenario => {
                    scenario.steps.forEach(step => {
                        //skip already checked steps
                        if (stepsCache.indexOf(step.text) > -1) return;
                        stepsCache.push(step.text);

                        performTest(step, assert);
                    })
                })
            })
        });
        assert.end();
    });
});
