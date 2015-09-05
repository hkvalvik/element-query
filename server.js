var url = require('url');
var elementQuery = require('./tasks/index');

module.exports = function(req, res, next) {
    var parsed = url.parse(req.url, true);
    if(parsed.pathname == '/element-query-convert'){
        var css = elementQuery.convertCss(parsed.query.css);
        var js = elementQuery.convertJs(parsed.query.css);
        res.writeHeader(200, {'Content-Type': 'text/json'});
        res.end(JSON.stringify({
            css: css,
            js: js
        }));
    }
    else {
        next();
    }
};
