"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class TouchInputConfig {

    _scale ;
    _X ;
    _Y ;
    constructor(scale=1.0, X=0, Y=0) {

        this._scale = scale ;
        this._X = X ;
        this._Y = Y ;

    }


    get scale() {
        return this._scale;
    }

    get X() {
        return this._X;
    }

    get Y() {
        return this._Y;
    }
}