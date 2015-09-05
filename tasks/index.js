var fs = require('fs');
var parse = require('./parser');
var convert = require('./converter');

module.exports = {
    convertCss: function(cssString){
        return convert(cssString);
    },

    convertJs: function(cssString){
        return parse(cssString);
    },

    // Old way of storing the rules, no longer in use.
    // Might be removed.
    saveJs: function(cssString, destination){
        var rules = parse(cssString);
        var js = 'var elementQueryCssRules = ' + JSON.stringify(rules) + ';';
        fs.writeFileSync(destination, js);
    }
};
