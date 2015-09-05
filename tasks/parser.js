var css = require('css');
var Utils = require('./utils');

module.exports = function(cssString){

    return {

        _ruleId: undefined,

        _cssOptions: {
            silent: false // Silently fail on parse errors.
        },

        _parse: function(){
            this._ruleId = 0;
            var obj = css.parse(cssString, this._cssOptions);
            var serialized = this._serializeRules(obj.stylesheet.rules);
            var rules = this._rules(serialized);
            rules = rules.filter(Utils.filterNull);
            return rules.filter(this._filterUniqueRule);
        },

        _filterUniqueRule: function(rule, index, rules){
            for(var r=0; r<rules.length; r++){
                if(r != index){
                    var anotherRule = rules[r];
                    if(rule.selector == anotherRule.selector && rule.attributeAlias == anotherRule.attributeAlias){
                        rule.attributeAlias = '';
                        return false;
                    }
                }
            }
            return true;
        },

        _serializeRules: function(rules){
            var serialized = [];
            for(var r=0; r<rules.length; r++){
                var rule = rules[r];
                if(rule.type == 'rule'){
                    serialized.push(rule);
                }
                if(rule.type == 'media'){
                    serialized = serialized.concat(rule.rules);
                }
            }
            return serialized;
        },

        _rules: function(rules){
            var elementRules = [];
            for(var r=0; r<rules.length; r++){
                var rule = rules[r];
                for(var s=0; s<rule.selectors.length; s++){
                    var found = this._selector(rule.selectors[s]);
                    if(found){
                        elementRules = elementRules.concat(found);
                    }
                }
            }
            return elementRules;
        },

        /**
         * @param selector - Example: body footer[min-width='401'][max-width='799'] ul li[min-width='500']
         * @returns {Array}
         * @private
         */
        _selector: function(selector){
            if(!selector.match(Utils.expressionRegex)){
                return null;
            }
            var fragments = selector.split(' ').map(Utils.trimArray);
            var clone = fragments.slice(0);
            return fragments.map(this._selectorFragment.bind(this, clone));
        },

        _selectorFragment: function(fragments, fragment, index){
            if(!fragment.match(Utils.expressionRegex)){
                return null;
            }

            var parentSelector = fragments.slice(0).splice(0, index).join(' ');
            var selector = [

                // Convert attributes from [min-width='500'] to [min-width-500]
                // Utils.getSelectorWithAttributeAlias(parentSelector),
                parentSelector.replace(Utils.expressionRegex, ''), // TODO

                fragment.replace(Utils.expressionRegex, '')
            ].join(' ');

            var element = this._elementRule(selector, fragment);

            //console.log('\n');
            //console.log('Fragment >>>', fragment);
            //console.log('    Full >>>', fragments.join(' '));
            //console.log('    Selector >>>', selector);
            //console.log('    Parent >>>', parentSelector);
            //console.log('    Methods >>>', element.methods);
            //console.log('    Attribute Alias >>>', element.attributeAlias);

            return element;
        },

        _elementRule: function(selector, fragment) {
            var methods = Utils._methods(fragment);
            return {
                id: this._ruleId++,
                selector: selector.trim(),
                methods: methods,
                attributeAlias: Utils._getAttributeAliasFromMethods(methods)
            };
        }

    }._parse();
}