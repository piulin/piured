"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class PlayerConfig {

    _inputConfig ;
    _level ;
    _speed ;
    _accuracyMargin ;
    _receptorX ;
    _receptorY ;
    _scale ;

    constructor(inputConfig,
                level,
                speed = 1.0,
                accuracyMargin = 0.15,
                receptorX = 0,
                receptorY = 0,
                scale = 1) {

        this._inputConfig = inputConfig ;
        this._level = level ;
        this._speed = speed ;
        this._accuracyMargin = accuracyMargin ;
        this._receptorX = receptorX ;
        this._receptorY = receptorY ;
        this._scale = scale ;

    }

    get inputConfig() {
        return this._inputConfig;
    }

    get level() {
        return this._level;
    }

    get speed() {
        return this._speed;
    }

    get accuracyMargin() {
        return this._accuracyMargin;
    }

    get receptorX() {
        return this._receptorX;
    }

    get receptorY() {
        return this._receptorY;
    }

    get scale() {
        return this._scale;
    }
}