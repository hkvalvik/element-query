var css = require('css');
var Utils = require('./utils');

module.exports = function(cssString){

    return {

        _cssOptions: {
            silent: false // Silently fail on parse errors.
        },

        _init: function(){
            var obj = css.parse(cssString, this._cssOptions);
            obj.stylesheet.rules = obj.stylesheet.rules.map(this._rewriteRuleSelector.bind(this));
            return css.stringify(obj);
        },

        _rewriteRuleSelector: function(rule){
            if(rule.type != 'rule'){
                return rule;
            }

            for(var s=0; s<rule.selectors.length; s++) {
                var selector = rule.selectors[s];
                var selectors = selector.split(' ');
                rule.selectors[s] = selectors.map(Utils.getSelectorWithAttributeAlias.bind(Utils)).join(' ');
            }

            return rule;
        }

    }._init();
};