let tape = require('tape');
let path = require('path');
let utils = require('./utils/utilities');

let reporter = require('../reporter/sources/index')
let testRunner = require('./test-core/test-runner')

function GherkinChecker(cg_config) {
    this.config = cg_config;
    this.stepsRegExp = this.stepsLoader();
    this.componentsArray = this.componentsLoader();
}

/**
 * load all steps
 * @returns {RegExp}
 */
GherkinChecker.prototype.stepsLoader = function () {
    let path = require('path');
    let regexArray = [];

    const NWC_MOCK = {
        _call: function (regex, action) {
            let regexStr = regex.toString();
            if (regexStr.charAt(0) === '/')
                regexStr = regexStr.slice(1)
            if (regexStr.charAt(regexStr.length - 1) === '/')
                regexStr = regexStr.slice(0, -1)

            regexArray.push(regexStr)
        },
        Then: function (regex, action) {
            this._call(regex, action);
        },
        Given: function (regex, action) {
            this._call(regex, action);
        },
        When: function (regex, action) {
            this._call(regex, action);
        }
    };
    const steps = require(path.resolve(this.config.steps_path)).call(NWC_MOCK);
    return new RegExp(regexArray.join("|"));
};

/**
 * load all components (if components.enable == true)
 * @returns {Array}
 */
GherkinChecker.prototype.componentsLoader = function () {
    if (!this.config.components.enabled) return [];
    const Components = require(path.resolve(this.config.components.components_path));
    return Components._components;
};

/**
 * run the GherkinChecker
 */
GherkinChecker.prototype.run = function () {
    let self = this;
    utils.readDirRecurs(path.resolve(self.config.features_path), (err, data) => {
        if (err) throw err;

        //reporter
        tape.createStream()
            .pipe(reporter(self.config.reporter))
            .pipe(process.stdout)

        if(self.config.mode === 'light')
            testRunner.singleTestRun.call(self, tape, data);
        else if(self.config.mode === 'full')
            testRunner.fullTestRun.call(self, tape, data);

    });
};

exports = module.exports = {};

exports.init = function (config) {
    return new GherkinChecker(config);
};