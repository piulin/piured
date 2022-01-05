"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class KeyInputConfig {

    _lpad ;
    _rpad ;

    constructor(lpad, rpad) {

        this._lpad = lpad ;
        this._rpad = rpad ;

    }


    get lpad() {
        return this._lpad;
    }

    get rpad() {
        return this._rpad;
    }


}