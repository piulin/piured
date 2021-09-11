"use strict" ;


class TipGeometry {

    _geometry ;

    constructor() {

        // 60x100
        this._geometry = new THREE.PlaneGeometry( 0.6*(68/194) , 68/194 , 1, 1 ) ;

    }


    get tipGeometry() {
        return this._geometry;
    }
}