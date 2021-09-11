"use strict" ;


class TipGeometry {

    _geometry ;

    constructor() {

        // 60x100
        this._geometry = new THREE.PlaneGeometry( 0.6 , 1 , 1, 1 ) ;

    }


    get tipGeometry() {
        return this._geometry;
    }
}