/**
 * General purpose event dispatcher.
 *
 * Example:
 *  var dispatcher = new EventDispatcher();
 *  dispatcher.on('my-event', function(){ console.log(arguments); });
 *  dispatcher.trigger('my-event', 'my argument');
 *
 * @returns {Object}
 * @constructor
 */
export default function EventDispatcher(allowedEventNames){

    return {

        _allowedEventNames: allowedEventNames,

        _eventCallbacks: [],

        /**
         * @param {String} eventName
         * @param {Function|Array} callback
         * @returns {EventDispatcher}
         */
        on: function(eventName, callback){
            this._validateEventName(eventName);
            this._eventCallbacks.push(
                {
                    eventName: eventName,
                    callback: callback
                }
            );
            return this;
        },

        /**
         * @param {String} eventName
         * @returns {EventDispatcher}
         */
        trigger: function(eventName){
            this._validateEventName(eventName);

            // Convert arguments to array and remove eventName argument.
            // Will be passed on as arguments to the callback.
            var args = Array.prototype.slice.call(arguments, 1);

            // Apply the callbacks that matches eventName
            for(var c=0; c<this._eventCallbacks.length; c++){
                var eventCallback = this._eventCallbacks[c];
                if(eventCallback.eventName == eventName){

                    if(eventCallback.callback.constructor == Array){
                        for(var i=0; i<eventCallback.callback.length; i++){
                            eventCallback.callback[i].apply(this, args);
                        }
                    }
                    else {
                        eventCallback.callback.apply(this, args);
                    }
                }
            }

            return this;
        },

        /**
         * @param {String} eventName
         * @returns {boolean}
         */
        hasEventListener: function(eventName){
            for(var c=0; c<this._eventCallbacks.length; c++){
                var eventCallback = this._eventCallbacks[c];
                if(eventCallback.eventName == eventName){
                    return true;
                }
            }
            return false;
        },

        _validateEventName: function(eventName){
            if(this._allowedEventNames && this._allowedEventNames.indexOf(eventName) === -1){
                throw new Error(eventName + ' is not a valid event name.');
            }
        }
    }
};
