"use strict" ;


class LifeBarGeometry {

    _geometry ;

    constructor() {

        // 5x1 rectangle
        this._geometry = new THREE.PlaneGeometry( 4 , 68/194 , 1, 1 ) ;

    }


    get lifeBarGeometry() {
        return this._geometry;
    }
}