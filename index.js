import RenderingQueue from './client/rendering-queue.js';
import ElementList from './client/element-list.js';

class ElementQuery {

    constructor() {
        this._elementList = new ElementList();
        var renderingQueue = new RenderingQueue(this._elementList);
    }

    addCssRules(cssRules) {
        return this._elementList.addCssRules(cssRules);
    }

    rendered(callback) {
    }
}

window.elementQuery = new ElementQuery();

document.addEventListener('DOMContentLoaded', function() {
    var element = document.createElement('div');
    document.body.appendChild(element);
    element.setAttribute('id', 'element-observer-rules');
    var style = window.getComputedStyle(element);
    var string = style.getPropertyValue('font-family');
    string = string.substring(1, string.length-1);
    var rules = JSON.parse(string);
    elementQuery.addCssRules(rules);
});
