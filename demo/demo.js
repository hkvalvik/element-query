(function(){

    var Demo = function(element){

        return {

            element: element,

            _cssElement: null,

            _htmlElement: null,

            _outputElement: null,

            _console: null,

            _consoleOutput: null,

            _style: null,

            // Code editors

            _cssEditor: null,

            _htmlEditor: null,

            // Initialize

            _init: function(){
                var inner = this.element.querySelector('[data-demo-editor]');

                this._cssElement = inner.children[0];

                this._htmlElement = inner.children[1];

                this._outputElement = document.createElement('output');
                inner.appendChild(this._outputElement);

                this._console = document.createElement('details');
                this._console.setAttribute('class', 'demo-console');
                this.element.appendChild(this._console);
                var summary = document.createElement('summary');
                summary.innerText = 'Console';
                this._console.appendChild(summary);
                this._consoleOutput = document.createElement('div');
                this._consoleOutput.setAttribute('class', 'demo-console-output');
                this._console.appendChild(this._consoleOutput);

                this._style = document.createElement('style');
                this.element.appendChild(this._style);

                this._initCss();
                this._initHtml();

                this._renderHtml();
                this._renderCss();

                return this;
            },

            _initHtml: function(){
                var value = this._htmlElement.innerHTML.trim();
                this._htmlElement.innerText = '';
                this._htmlEditor = CodeMirror(this._htmlElement, {
                    value: value,
                    mode:  'text/html',
                    lineNumbers: false,
                    viewportMargin: Infinity,
                    theme: 'neat'
                });
                this._htmlEditor.on('change', this._onHtmlChange.bind(this));
            },

            _initCss: function(){
                var value = this._cssElement.innerText.trim();
                this._cssElement.innerText = '';
                this._cssEditor = CodeMirror(this._cssElement, {
                    value: value,
                    mode:  'css',
                    lineNumbers: false,
                    viewportMargin: Infinity,
                    theme: 'eq'
                });
                this._cssEditor.on('change', this._onCssChange.bind(this));
            },

            // Events

            _onHtmlChange: function(editor){
                this._renderHtml();
            },

            _onCssChange: function(editor){
                this._renderCss();
            },

            // Rendering

            _renderHtml: function(){
                var html = this._htmlEditor.getValue();
                this._outputElement.innerHTML = html;
            },

            _renderCss: function(){
                var css = this._cssEditor.getValue();
                css = css.replace(/\r?\n|\r/g, '');
                css = css.replace(/\s\s+/g, ' ');
                $.ajax({
                    url: '/element-query-convert',
                    data: {css: css},
                    success: this._onConverted.bind(this)
                });
            },

            _onConverted: function(converted){
                this._style.innerText = converted.css;
                elementQuery.addCssRules(converted.js);

                var text = '';
                text += converted.js.map(function(rule){
                    var ret = '';
                    for(var attr in rule){
                        var value = rule[attr];
                        value = value.toLowerCase ? value : JSON.stringify(value);
                        ret += attr + ': ' + value + '<br>';
                    }
                    ret += '<br>';
                    return ret;
                }).join('<br>');
                this._consoleOutput.innerHTML = text;
            }

        }._init();
    }

    var elements = document.querySelectorAll('[data-demo]');
    for(var e=0; e<elements.length; e++){
        new Demo(elements[e]);
    }
}());