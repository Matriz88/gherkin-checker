let utils = require("../utils/utilities");
let stepsCache = [];
let checkComponent = require('../test-core/checkComponent');
let checkStepMatch = require('../test-core/checkStepMatch');


exports.singleTestRun = function (tape, data) {
    let self = this;
    tape('Check gherkin consistency', assert => {
        data.forEach(file => {
            coreTestCycle.call(self, file, assert)

        });
        assert.end();
    });
};

exports.fullTestRun = function (tape, data) {
    let self = this;

    data.forEach(file => {
        tape('Check gherkin ' + utils.getFileName(file), assert => {
            coreTestCycle.call(self, file, assert, true);
            assert.end();
        });
    });
};

let coreTestCycle = function (file, assert, nocache) {
    let noCache = nocache || false;
    let self = this;
    let fileContent = utils.readFileSync(file);
    if (!fileContent) return;
    var compiledGherkin = utils.getCompiledGherkin(fileContent);
    if(noCache) stepsCache = [];
    compiledGherkin.forEach(scenario => {
        scenario.steps.forEach(step => {
            //skip already checked steps
            if (stepsCache.indexOf(step.text) > -1) return;
            stepsCache.push(step.text);


            checkComponent.call(self, step.text, assert);
            checkStepMatch.call(self, step.text, assert);
        })
    })
}