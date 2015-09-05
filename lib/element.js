var environment = {
    isClient: typeof window !== 'undefined',
    isServer: typeof window === 'undefined'
};

function Element(options){
    this.selector = options.selector || '';

    //this.method = options.method || [];
    //this.arguments = options.arguments || [];
    this.methods = options.methods || [];

    this.element = environment.isClient ? options.element : null;
    return this;
}

if(environment.isServer){
    module.exports = Element;
}