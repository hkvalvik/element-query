(function(){

    var Performance = function(element){

        return {

            element: element,

            _form: null,

            _elementContainer: null,

            _elements: null,

            _length: null,

            _speed: null,

            _interval: null,

            _selectedMethods: [],

            _tick: 0,

            _intervalId: null,

            _paused: false,

            // Initialize

            _init: function(){
                this._elementContainer = this.element.querySelector('[data-performance-elements]');
                this._form = this.element.querySelector('form');
                this._form.addEventListener('submit', this._start.bind(this));
                this.element.querySelector('[data-performance-pause]').addEventListener('click', this._pause.bind(this));
                return this;
            },

            _start: function(event){
                event && event.preventDefault();

                this._length = this.element.querySelector('[data-performance-length]').value;
                this._speed = this.element.querySelector('[data-performance-speed]').value;
                this._interval = this.element.querySelector('[data-performance-interval]').value;
                this._initHtml();
                this._setMethods();
                this._elements = this._elementContainer.children;

                this._animate();
            },

            _pause: function(){
                this._paused = !this._paused;
            },

            _initHtml: function() {
                var html = '';
                var containerWidth = this._elementContainer.clientWidth;
                var width = Math.round( (containerWidth / this._length) / 2 );
                for(var i=0; i<this._length; i++){
                    var left = Math.round( i * containerWidth / this._length);
                    html += '<div style="left: '+left+'px; width: '+width+'px"></div>';
                }
                this._elementContainer.innerHTML = html;
            },

            _animate: function(){
                clearInterval(this._intervalId);
                this._intervalId = setInterval(this._render.bind(this), this._interval);
            },

            _render: function(){
                if(this._paused) return;
                var containerHeight = this._elementContainer.clientHeight;
                for(var e=0; e<this._elements.length; e++){
                    var element = this._elements[e];
                    var p = ((e+1) / this._length) * 100;
                    var height = (containerHeight / 100) * p;
                    height *= this._tick / 100;
                    element.style.height = height + 'px';
                }
                if(this._tick <= 0){
                    this._direction = 1;
                }
                else if(this._tick >= 100){
                    this._direction = -1;
                }
                this._tick += this._direction * this._speed;
            },

            _setLength: function(event){
                this._length = event.target.value;
                this._initHtml();
            },

            _setMethods: function(event){
                this._selectedMethods = [];
                for(var i=0; i<this._form.length; i++){
                    var input = this._form[i];
                    if(input.name == 'method' && input.checked){
                        this._selectedMethods.push(input.value);
                    }
                }
                this._elementContainer.className = 'performance-elements ' + this._selectedMethods.join(' ');
            }

        }._init();
    }

    var elements = document.querySelectorAll('[data-performance]');
    for(var e=0; e<elements.length; e++){
        new Performance(elements[e]);
    }
}());