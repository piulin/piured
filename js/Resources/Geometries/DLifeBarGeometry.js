"use strict" ;


class DLifeBarGeometry {

    _geometry ;

    constructor() {

        // 5x1 rectangle
        this._geometry = new THREE.PlaneGeometry( 8 , 68/194 , 1, 1 ) ;

    }


    get lifeBarGeometry() {
        return this._geometry;
    }
}