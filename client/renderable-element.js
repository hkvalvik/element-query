import methods from './methods.js';

export default class RenderableElement {

    constructor(element) {
        this._cssRules = [];
        this.element = element;
    }

    destroy() {
        //console.log('Destroy', this.element);
    }

    render(cssRule) {
        this._cssRules.forEach(this._renderCssRule.bind(this));
    }

    _renderCssRule(cssRule) {
        cssRule.methods.forEach(this._renderMethod.bind(this, cssRule));
    }

    _renderMethod(cssRule, method) {
        var methodName = method.name;
        var methodArguments = method.arguments;
        var passed = methods[methodName].call(this.element, methodArguments);
        if(passed){
            if(!this.element.hasAttribute(cssRule.attributeAlias)) {
                this.element.setAttribute(cssRule.attributeAlias, '');
            }
        }
        else {
            if(!this.element.removeAttribute){
                console.log(this.element)
            }

            this.element.removeAttribute(cssRule.attributeAlias);
        }
    }

    _addCssRule(cssRule){
        var exists = this._cssRules.filter((rule) => rule.attributeAlias == cssRule.attributeAlias);
        exists.length == 0 && this._cssRules.push(cssRule);
    }

    static register(element, cssRule) {
        var renderableElement = this._instances.filter(
            (instance) => instance.element == element
        ).pop();
        if(renderableElement) {
            renderableElement._addCssRule(cssRule);
        }
        else {
            renderableElement = new RenderableElement(element);
            renderableElement._addCssRule(cssRule);
            this._instances.push(renderableElement);
            return renderableElement;
        }
        return null;
    }
}

RenderableElement._instances = [];
