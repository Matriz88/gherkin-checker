let fs = require('fs');
let path = require('path');
let Gherkin = require('gherkin');
let parser = new Gherkin.Parser();

/**
 * read directory recursively and return and array of files found
 * @param dir
 * @param done
 */
let readDirRecurs = (dir, done) => {
    let results = [];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach((file) => {
            file = path.resolve(dir, file);
            fs.stat(file, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    readDirRecurs(file, (err, res) => {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}
exports.readDirRecurs = readDirRecurs;

/**
 * read file asynchronously
 * @param file
 * @returns {Promise}
 */
exports.readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data)
        });
    })
}

/**
 * get file name from given path
 * @param file
 * @returns {*}
 */
exports.getFileName = (filePath) => {
    return path.basename(filePath);
}

/**
 * read file synchronously
 * @param file
 */
exports.readFileSync = (file) => {
    try {
        return fs.readFileSync(file, 'utf8');
    } catch (e) {
        console.log(e.message)
    }
}

/**
 * check if the value is defined
 * @param value
 * @returns {*}
 */
exports.checkIfExist = (value) => {
    if (typeof value !== 'undefined') return 'found';
    return 'not found'
}

/**
 * given 'utf8' file content, return compiled gherkin
 * @param data
 */
exports.getCompiledGherkin = (data) => {
    let gherkinDocument = parser.parse(data);
    return new Gherkin.Compiler().compile(gherkinDocument);
}

/**
 * check --feature cli argument and return updated config
 * @param options
 * @param cg_config
 * @returns {*}
 */
exports.checkArgv = (options, cg_config) => {
    if (!!options.path) {
        if (typeof options.path === 'string' && fs.existsSync(path.resolve(options.path)))
            cg_config.features_path = options.path;
        else
            console.error("\nERR: folder path provided by --path it's not a string or folder not exists.\n" +
                "Configuration files will be used.");
    }

    if (!!options.mode) {
        if (typeof options.mode === 'string' && (options.mode === 'light' || options.mode === 'full'))
            cg_config.mode = options.mode;
        else
            console.error("\nERR: test mode provided by --mode it's not a valid option, choose 'light' or 'full'.\n" +
                "Configuration files will be used.");
    }

    if (!!options.report) {
        if (typeof options.report === 'string' && (options.report === 'light' || options.report === 'full'))
            cg_config.reporter.type = options.report;
        else
            console.error("\nERR: report type provided by --mode it's not a valid option, choose 'light' or 'full'.\n" +
                "Configuration files will be used.");
    }

    return cg_config
}