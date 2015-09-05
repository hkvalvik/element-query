describe('Performance', function(){

    it('should handle many elements', function(done){
        var limit = 90;
        for(var i=0; i<limit; i++){
            Utils.append(
                'body',
                '<div class="test-performance" style="width: 200px">Performance</div>'
            );
        }
        elementQuery.rendered(function(element){
            console.log("---", element)
            if(element.className == 'test-performance'){
                assert.equal(element.hasAttribute('test-performance'), true);
                done();
            }
        })
    });

})
