"use strict" ;


class PulseGeometry {

    _geometry ;

    constructor() {

        // 2x1 rectangle
        this._geometry = new THREE.PlaneGeometry( 0.5 , 68/194 , 1, 1 ) ;

    }


    get pulseGeometry() {
        return this._geometry;
    }
}