import EventDispatcher from './event-dispatcher.js';

export default class RenderingQueue {

    constructor(elementList) {

        this.events = new EventDispatcher();

        this._elementList = elementList;

        this._requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };

        this._queue = [];

        this._elementList.events.on('added', this._render.bind(this));
        //this._elementList.events.on('removed', this._render.bind(this));
        this._elementList.events.on('changed', this._render.bind(this));

        this._timeoutId = null;
    }

    _render(renderableElements) {
        renderableElements.forEach(
            (renderableElement) => { this._queue.indexOf(renderableElement) === -1 && this._queue.push(renderableElement) }
        );

        var wait = this._queue.length;
        clearTimeout(this._timeoutId);
        this._timeoutId = setTimeout(function(){
            this._requestAnimationFrame.call(window, this._renderQueue.bind(this));
        }.bind(this), wait);
    }

    _renderQueue() {
        while(this._queue.length){
            var renderableElement = this._queue.shift();
            this._renderElement(renderableElement);
        }
    }

    _renderElement(renderableElement) {
        renderableElement.render(
            () => this.events.trigger('rendered', renderableElement.element)
        )
    }
}
