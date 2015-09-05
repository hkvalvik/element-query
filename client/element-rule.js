var ElementRule = function(element, cssRule){

    return {

        element: element,

        cssRuleId: cssRule.id,

        depth: undefined,

        _methodRenderers: undefined,

        _attributeAlias: cssRule.attributeAlias,

        _init: function(){
            this.depth = this._getDepth();
            this._methodRenderers = this._getMethodRenderers();
            ElementRule._rules.push(this);
            return this;
        },

        _getDepth: function(){
            var element = this.element;
            var parents = [];
            while (element) {
                parents.unshift(element);
                element = element.parentNode;
            }
            return parents.length;
        },

        _getMethodRenderers: function(){
            var methods = cssRule.methods;
            return methods.map(this._getMethodRenderer.bind(this));
        },

        _getMethodRenderer: function(method){
            return new MethodRenderer(this.element, method);
        },

        render: function(callback){
            this._methodRenderers.forEach(this._renderMethod.bind(this, callback));
        },

        _renderMethod: function(callback, methodRenderer){
            methodRenderer.test(this._onTestResult.bind(this, callback));
        },

        _onTestResult: function(callback){
            var results = this._methodRenderers.map(this._methodRendererHasPassed);
            var passed = results.indexOf(false) === -1;
            if(passed){
                if(!this.element.hasAttribute(this._attributeAlias)){
                    this.element.setAttribute(this._attributeAlias, '');

                    callback && callback(this.element);
                }
                //this._attributeAlias.indexOf('overflow') !== -1 && console.log("setAttribute", this.element, this._attributeAlias)
            }
            else {
                this.element.removeAttribute(this._attributeAlias);
                //this._attributeAlias.indexOf('overflow') !== -1 && console.log("removeAttribute", this.element, this._attributeAlias)
            }
        },

        _methodRendererHasPassed: function(methodRenderer){
            return methodRenderer.passed;
        }

    }._init();

};

ElementRule._rules = [];

ElementRule.find = function(element, cssRuleId){
    for(var e=0; e<this._rules.length; e++){
        var rule = this._rules[e];
        if(rule.element == element && rule.cssRuleId == cssRuleId){
            return rule;
        }
    }
    return null;
};