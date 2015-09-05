var expect = chai.expect;
var assert = chai.assert;

var Utils = {

    id: 0,

    _init: function(){
        return this;
    },

    append: function(selector, html){
        var div = document.createElement('div');
        div.innerHTML = html;
        var children = Array.prototype.slice.call(div.childNodes);
        var length = children.length;
        var parents = document.querySelectorAll(selector);
        for(var p=0; p<parents.length; p++){
            var parent = parents[p];
            while(children.length){
                var child = children.shift();
                parent.appendChild(child);
            }
        }
    },

    getTestClassName: function(){
        return 'test-element-' + (Utils.id++);
    },

    addTestElement: function(className){
        className = className ||this.getTestClassName();
        Utils.append(
            'body',
            '<div class="'+className+'">'+className+'</div>'
        );
    }

}._init();