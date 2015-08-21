// Some utility functions

// Generate guid from stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
// Probability of collision is low, so we don't do checking
guid = function() {
    "use strict";
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString()
            .substring(1);
    }

    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
        s4() + "-" + s4() + s4() + s4();
};