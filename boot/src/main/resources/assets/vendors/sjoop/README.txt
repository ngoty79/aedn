Simple JavaScript Inheritance
By John Resig http://ejohn.org/
Inspired by base2 and Prototype
http://ejohn.org/blog/simple-javascript-inheritance/
MIT Licensed.

Modified to support static properties and functions.

Example:
Namespace('app.main');

var app.main.Person = Class.extend({
    // Static properties and functions
    static: {
        staticProperty: 'static property',
        staticFunction: function() {
            return 'static function';
        }
    },

    // Constructor
    init: function(isDancing) {
        this.dancing = isDancing;
    },

    // Public functions
    dance: function() {
        return this.dancing;
    },

    say: function() {

    }
});

var app.main.Ninja = app.main.Person.extend({
    // Constructor
    init: function() {
        // Must call parent constructor
        this._super(false);
    },

    dance: function() {
        // Do some custom things

        // Call the parent method if needed
        return this._super();
    },

    swingSword: function(){
        return true;
    }
});

var p = new app.main.Person(true);
p.dance(); // => true
app.main.Person.staticProperty; // => 'static property',
app.main.Person.staticFunction(); // => 'static function',

var n = new app.main.Ninja();
n.dance(); // => false
n.swingSword(); // => true

// Should all be true
p instanceof app.main.Person && p instanceof Class &&
    n instanceof app.main.Ninja && n instanceof app.main.Person && n instanceof Class

