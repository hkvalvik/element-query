var methodNames =  Object.keys( require('../client/methods') );

var methodNamesEscaped = methodNames.map(function(methodName){
    return methodName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
});

//var expressionRegexPattern = {open: '\\[', separator: '=["\']', close: '["\']\\]'};
var expressionRegexPattern = {open: ':', separator: '\\(', close: '\\)'};

var Utils = {

    //expressionRegex: new RegExp( '\\[(' + methodNamesEscaped.join('|') + ')=["\'](.*?)["\']\\]', 'g'),
    expressionRegex: new RegExp(
        expressionRegexPattern.open +
        '(' + methodNamesEscaped.join('|') + ')' +
        expressionRegexPattern.separator +
        '(.*?)' +
        expressionRegexPattern.close,
        'g'
    ),

    getAttributeAlias: function(methodName, methodArguments){
        return methodName + '-' + methodArguments;
    },

    getSelectorWithAttributeAlias: function(selector){
        if(!selector.match(this.expressionRegex)){
            return selector;
        }
        var methods = this._methods(selector);
        var alias = this._getAttributeAliasFromMethods(methods);
        alias = '['+alias+']';
        selector = selector.replace(this.expressionRegex, alias);
        return selector;
    },

    _getAttributeAliasFromMethods: function(methods){
        var attributeAliases = [];
        methods.forEach(function(method){
            var alias = Utils.getAttributeAlias(method.name, method.arguments);
            attributeAliases.push(alias);
        });
        var joined = attributeAliases.join('--');
        var map = {
            '\\.': '_',
            '\\,': '__'
        };
        for(var char in map){
            var regex = new RegExp(char, 'g')
            joined = joined.replace(regex, map[char]);
        };
        return joined;
    },

    _methods: function(fragment){
        var matches;
        var methods = [];

        var methodMatches = fragment.match(Utils.expressionRegex);
        if(methodMatches){
            for(var m=0; m<methodMatches.length; m++) {
                var methodMatch = methodMatches[m];

                var split = methodMatch.split('(');
                var methodName = split[0].replace(new RegExp(expressionRegexPattern.open), '');
                var methodArguments = split[1].replace(new RegExp(expressionRegexPattern.close), '');

                var method = this._method([methodName, methodArguments]);
                method && methods.push(method);
                //fragment = fragment.replace(matches[0], ''); // Prevents infinite loop
            }
        }


        /*while ((matches = Utils.expressionRegex.exec(fragment)) !== null) {
            var method = this._method(matches);
            method && methods.push(method);
            fragment = fragment.replace(matches[0], ''); // Prevents infinite loop
        }*/
        return methods;
    },

    _method: function(matches){
        var methodName = matches[0];

        if(methodName){
            var methodArguments = matches[1];
            return {
                name: methodName,
                arguments: methodArguments
            };
        }
        return null;
    },

    filterNull: function(item){
        return item !== null;
    },

    trimArray: function(string){
        return string.trim();
    }

};

module.exports = Utils;