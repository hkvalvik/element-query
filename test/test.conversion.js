describe('Conversion', function(){

    it('should not convert standard pseudo selectors', function(done){
        var css = '.test:not(.foo){ color: red }';
        $.ajax({
            url: '/element-query-convert',
            data: {css: css},
            success: function(converted){
                assert.include(converted.css, '.test:not(.foo)', 'The converted css contains the original selector');
                assert.notInclude(converted.css, '[min-text-length-10]');
                done();
            }
        });
    });

    it('should convert a valid pseudo selector to an attribute selector', function(done){
        var css = '.test:min-text-length(10){ color: red }';
        $.ajax({
            url: '/element-query-convert',
            data: {css: css},
            success: function(converted){
                assert.include(converted.css, '.test[min-text-length-10]', 'The converted css contains an attribute selector');
                done();
            }
        });
    });

    it('should support standard/non-standard pseudo selectors', function(done){
        var css = '.test:min-text-length(10):not(.foo){ color: red }';
        $.ajax({
            url: '/element-query-convert',
            data: {css: css},
            success: function(converted){
                assert.include(converted.css, '.test[min-text-length-10]:not(.foo)');
                done();
            }
        });
    });

    it('should convert two valid pseudo selectors to one attribute selector', function(done){
        var css = '.test:min-text-length(10):max-text-length(20){ color: red }';
        $.ajax({
            url: '/element-query-convert',
            data: {css: css},
            success: function(converted){
                assert.include(converted.css, '.test[min-text-length-10--max-text-length-20]');
                done();
            }
        });
    });

    it('should convert three valid pseudo selectors to one attribute selector', function(done){
        var css = '.test:min-text-length(10):max-text-length(20):min-width(200){ color: red }';
        $.ajax({
            url: '/element-query-convert',
            data: {css: css},
            success: function(converted){
                var methods = converted.js[0].methods;
                assert.equal(methods.length, 3);
                assert.equal(methods[0].arguments, '10');
                assert.equal(methods[0].name, 'min-text-length');
                assert.include(converted.css, '.test[min-text-length-10--max-text-length-20--min-width-200]');
                done();
            }
        });
    });

})
