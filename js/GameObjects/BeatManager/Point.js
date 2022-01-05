'use strict' ;

class Point {


    _x ;
    _y ;


    constructor( x, y ) {
        this._x = x ;
        this._y = y ;
    }


    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }


    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }
}