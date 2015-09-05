var methods = {

    'if': function(condition){
        return eval(condition);
    },

    'min-width': function(width){
        return this.offsetWidth >= width;
    },

    'max-width': function(width){
        return this.offsetWidth <= width;
    },

    'min-height': function(height){
        return this.offsetHeight >= height;
    },

    'max-height': function(height){
        return this.offsetHeight <= height;
    },

    'min-text-length': function(length){
        return this.innerText.length >= length;
    },

    'max-text-length': function(length){
        return this.innerText.length <= length;
    },

    'overflow-x': function(args){
        elementObserver.disconnect();
        var attributeName = 'overflow-x-' + args;
        var hasAttribute = this.hasAttribute(attributeName);
        if(hasAttribute) {
            this.removeAttribute(attributeName);
        }
        var hasOverflow = false;
        var children = this.children;
        var left = this.offsetLeft;
        var width = this.clientWidth;
        var style = window.getComputedStyle(this);
        width -= style.paddingLeft ? parseFloat(style.paddingLeft) : 0;
        width -= style.paddingRight ? parseFloat(style.paddingRight) : 0;
        for(var c=0; c<children.length; c++){
            var child = children[c];
            if((child.offsetLeft - left) + child.offsetWidth > width){
                hasOverflow = true;
            }
        }
        if(hasAttribute){
            this.setAttribute(attributeName, '');
        }
        elementObserver.connect();
        return hasOverflow;
    },

    'has': function(selectors){
        return this.querySelector(selectors) !== null;
    }
};

module.exports = methods;