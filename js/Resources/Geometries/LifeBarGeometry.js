"use strict" ;


class LifeBarGeometry {

    _geometry ;

    constructor() {

        // 5x1 rectangle
        this._geometry = new THREE.PlaneGeometry( 5 , 1 , 1, 1 ) ;

    }


    get lifeBarGeometry() {
        return this._geometry;
    }
}