import RenderableElement from './renderable-element.js';
import EventDispatcher from './event-dispatcher.js';

export default class ElementList extends Array {

    constructor() {
        super();
        this.events = new EventDispatcher();
        this._elementProperties = ['clientWidth', 'clientHeight', 'innerText'];

    }

    addCssRules(cssRules) {
        var resolve;
        var promise = new Promise((r, reject) => {
            resolve = r;
        });
        cssRules.forEach(this._initObserver.bind(this, resolve));
        return promise;
    }

    _initObserver(resolve, cssRule) {
        elementObserver(cssRule.selector)
            .find(this._addElements.bind(this, cssRule, resolve))
            .added(this._addElements.bind(this, cssRule, resolve))
            .removed(this._removeElements.bind(this))
            .changed(this._elementProperties, this._onChanged.bind(this));
    }

    _addElements(cssRule, resolve, elements) {

        var uniqueElements = [];
        elements.forEach((element) => uniqueElements.indexOf(element) === -1 && uniqueElements.push(element));

        uniqueElements.map(
            (element) => RenderableElement.register(element, cssRule)
        )
            .filter(
            (renderableElement) => renderableElement != null
        )
            .forEach(
            (renderableElement) => super.push(renderableElement)
        );

        if(uniqueElements.length) {
            this.concat(uniqueElements);
            resolve(uniqueElements);
            this.events.trigger('added', this);
        }
    }

    _removeElements(elements) {
        var removed = this.filter(
            (renderableElement) => elements.indexOf(renderableElement.element) !== -1
        );
        removed = removed.filter(function(renderableElement, index){
            return removed.indexOf(renderableElement) == index;
        });
        elements.forEach(this._removeElement.bind(this));
    }

    _removeElement(element) {
        var renderableElement = this.filter(
            (renderableElement) => renderableElement.element == element
        ).pop();
        if(renderableElement){
            renderableElement.destroy();
            var index = this.indexOf(renderableElement);
            super.splice(index, 1);
        }
    }

    _onChanged(changes) {
        //console.log('_onChange')
        var renderableElements = changes.map((change) => {
            var target = change.target;
            var renderableElement = this.filter((renderableElement) => renderableElement.element == target).pop();
            return renderableElement;
        });
        this.events.trigger('changed', renderableElements);
    }
}








class ___ElementList extends Array {

    constructor() {
        super();
        this._cssRules = [];
        this.readyPromise = new Promise((resolve, reject) => {
            this.resolveReady = resolve;
        });
        this.changedPromise = new Promise((resolve, reject) => {
            this.resolveChanged = resolve;
        });
    }

    addCssRules(cssRules) {
        this._cssRules = this._cssRules.concat(cssRules);
        var renderableElements = this._createCssRuleObservers.bind(this, cssRules);
        return this.readyPromise;
    }

    _createCssRuleObservers(cssRules) {
        var observers = cssRules
            .map((cssRule) => new CssRuleObserver(cssRule));
        var promises = observers
            .map((cssRuleObserver) => cssRuleObserver.readyPromise);
        promises.forEach((promise) => promise.then(this._resolveReady.bind(this)));
        observers.forEach((observer) => this.concat(observer))
    }

    _resolveReady(elements) {
        this.resolveReady(elements);
    }
}


/*
class CssRuleObserver extends Array {

    constructor(cssRule) {
        super();
        this.readyPromise = new Promise((resolve, reject) => {
            this.resolveReady = resolve;
        });
        this._elementProperties = ['clientWidth', 'clientHeight', 'innerText'];
        this.cssRule = cssRule;
        this._initObserver();
    }

    _initObserver() {
        elementObserver(this.cssRule.selector)
            .find(this._addElements.bind(this))
            .added(this._addElements.bind(this))
            .removed(this._removeElements.bind(this))
            //.attribute(this._onElements.bind(this, cssRule)) // TODO: is this needed?
            .change(this._elementProperties, this._onChange.bind(this));
    }

    _addElements(elements) {

        var uniqueElements = [];
        elements.forEach((element) => uniqueElements.indexOf(element) === -1 && uniqueElements.push(element));

        uniqueElements.map(
            (element) => RenderableElement.register(element, this.cssRule)
        )
        .filter(
            (renderableElement) => renderableElement != null
        )
        .forEach(
            (renderableElement) => this.push(renderableElement)
        );

        uniqueElements.length && this.resolveReady(uniqueElements);
        this.concat(uniqueElements);
    }

    _removeElements(elements) {
        var removed = this.filter(
            (renderableElement) => elements.indexOf(renderableElement.element) !== -1
        );
        removed = removed.filter(function(renderableElement, index){
            return removed.indexOf(renderableElement) == index;
        });
        elements.forEach(this._removeElement.bind(this));
    }

    _removeElement(element) {
        var renderableElement = this.filter(
            (renderableElement) => renderableElement.element == element
        ).pop();
        if(renderableElement){
            renderableElement.destroy();
            var index = this.indexOf(renderableElement);
            super.splice(index, 1);
        }
    }

    _onChange(changes) {
        var cssRuleId = this.cssRule.id;
        var renderableElements = changes.map((change) => {
            var target = change.target;
            var renderableElement = this.filter((renderableElement) => renderableElement.element == target).pop();
            return renderableElement;
        });
        //this.events.trigger('changed', renderableElements);
    }
}

export default class ElementList extends Array {

    constructor() {
        super();
        this._cssRules = [];
        this.readyPromise = new Promise((resolve, reject) => {
            this.resolveReady = resolve;
        });
        this.changedPromise = new Promise((resolve, reject) => {
            this.resolveChanged = resolve;
        });
    }

    addCssRules(cssRules) {
        this._cssRules = this._cssRules.concat(cssRules);
        var renderableElements = this._createCssRuleObservers.bind(this, cssRules);
        return this.readyPromise;
    }

    _createCssRuleObservers(cssRules) {
        var observers = cssRules
            .map((cssRule) => new CssRuleObserver(cssRule));
        var promises = observers
            .map((cssRuleObserver) => cssRuleObserver.readyPromise);
        promises.forEach((promise) => promise.then(this._resolveReady.bind(this)));
        observers.forEach((observer) => this.concat(observer))
    }

    _resolveReady(elements) {
        this.resolveReady(elements);
    }
}
*/