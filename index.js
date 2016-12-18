let raw_config = require('./config/configurations');

const program = require('commander');
const pjson = require('./package.json');
let checkArgv = require('./lib/utils/utilities').checkArgv;
let GherkinChecker = require('./lib/app');

program
    .version(pjson.version)
    .option("-p, --path <path>", "(optional) features folder location (priority over configuration files)")
    .option("-m, --mode <value>", "(optional) test mode [full|light])")
    .option("-r, --report <value>", "(optional) report style [full|light])")
    .parse(process.argv);

raw_config = checkArgv(program, raw_config);

new GherkinChecker.init(raw_config).run();
