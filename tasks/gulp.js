var through = require('through2');
var elementQuery = require('./index.js');

module.exports = function() {

    return through.obj(function(file, enc, cb) {

        if (file.isNull()) {
            cb(null, file);
        }

        var content = file.contents.toString();
        var parsedRules = JSON.stringify(elementQuery.convertJs(content));
        content += '#element-observer-rules{font-family: \''+parsedRules+'\' }';
        file.contents = new Buffer(elementQuery.convertCss(content));

        cb(null, file);
    });
}
