global.cg_cofig = require('./config/configurations');

let tape = require('tape');
let path = require('path');
let utils = require('./lib/utils/utilities');
let performTest = require('./lib/test-runner/test-runner');
let stepsCache = [];

utils.readDirRecurs(path.resolve(global.cg_cofig.features_path), (err, data) => {
    if (err) throw err;

    tape('Check gherkin consistency', assert => {
        data.forEach(file => {
            let fileContent = utils.readFileSync(file);
            if (!fileContent) return
            var compiledGherkin = utils.getCompiledGherkin(fileContent);
            compiledGherkin.forEach(scenario => {
                scenario.steps.forEach(step => {
                    //skip already checked steps
                    if (stepsCache.indexOf(step.text) > -1) return;
                    stepsCache.push(step.text);
                    performTest(step, assert);
                })
            })

        });
        assert.end();
    });
});
