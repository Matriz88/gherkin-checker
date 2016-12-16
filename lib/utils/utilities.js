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

exports.getFileName = (file) => {
    return path.basename(file);
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
 * @param value
 * @param cg_config
 * @returns {*}
 */
exports.checkFeaturesArgv = (value, cg_config) => {
    if (value && typeof value === 'string' && fs.existsSync(path.resolve(value)))
        cg_config.features_path = value;
    else
        console.error("ERR: folder path provided by --feature it's not a string or folder not exist. Configuration files will be used.");
    return cg_config
}