"use strict" ;


class PulseGeometry {

    _geometry ;

    constructor() {

        // 2x1 rectangle
        this._geometry = new THREE.PlaneGeometry( 2 , 1 , 1, 1 ) ;

    }


    get pulseGeometry() {
        return this._geometry;
    }
}