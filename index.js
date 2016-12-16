let raw_config = require('./config/configurations');

const program = require('commander');
const pjson = require('./package.json');
let checkFeaturesArgv = require('./lib/utils/utilities').checkFeaturesArgv;
let GherkinChecker = require('./lib/app');

program
    .version(pjson.version)
    .option("-p, --path <path>", "(optional) features folder location (priority over configuration files)")
    .option("-r, --report <value>", "(optional) report style [full|light])")
    .parse(process.argv);

raw_config = checkFeaturesArgv(program.path, raw_config);

new GherkinChecker.init(raw_config).run();
