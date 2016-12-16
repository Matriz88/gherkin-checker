var _ = require('lodash');
var fs = require('fs');
var path = require('path');
let defaultConfig = require('./default/default_config');

let customConfig = {};
try {
    let customConfigPath = path.resolve('gherkin-checker.conf.js');
    if (fs.statSync(customConfigPath))
        customConfig = require(customConfigPath)
} catch (e) {
    if (e.code !== 'ENOENT')
        throw e;
}

module.exports = _.merge(defaultConfig, customConfig);