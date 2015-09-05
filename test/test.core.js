describe('Core', function(){

    it('should update the number of renderableElements in the element list', function(done){
        var length = elementQuery._elementList.length;
        var className = Utils.getTestClassName();
        var promise = elementQuery.addCssRules([{
            id: className,
            selector: '.' + className,
            methods: [{ name: 'min-width', arguments: '0'}],
            attributeAlias: 'test'
        }]);
        Utils.addTestElement(className);
        promise.then(function(elements){
            assert.equal(elementQuery._elementList.length, length+1);
            done();
        });
    });

    it('should set an attribute on elements with a matching query', function(done){
        var className = Utils.getTestClassName();
        var promise = elementQuery.addCssRules([{
            id: className,
            selector: '.' + className,
            methods: [{ name: 'min-width', arguments: '100'}],
            attributeAlias: 'test'
        }]);
        Utils.append(
            'body',
            '<div class="'+className+'">test-min-width-100</div>'
        );
        promise.then(function(elements){
            console.log(elements)
            elementObserver('.'+className).changed('clientWidth', function(changes){
                var element = changes[0].target;
                assert.equal(elements.length, 1);
                assert.equal(element, elements[0]);

                setTimeout(function(){ // See rendering queue
                    assert.equal(element.hasAttribute('test'), true);
                    done();
                }, 500)
            });
            elements[0].style.width = '200px';
        })
    });

    it('should not set an attribute on elements with an mismatching query', function(){
        Utils.append(
            'body',
            '<div class="test-min-width-100 B" style="width: 50px">test-min-width-100</div>'
        );
        elementQuery.rendered(function(element){
            if(element.className == 'test-min-width-100 B'){
                throw new Error('This callback should not be called');
            }
        })
    });

    it('should prevent infinite loops', function(done){
        Utils.append(
            'body',
            '<div class="test-infinite-loop">test-infinite-loop</div>'
        );
        setTimeout(function(){
            //elementObserver.disconnect();
            done();
        }, 100)
    });

})
