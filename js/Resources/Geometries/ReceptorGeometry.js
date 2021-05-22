"use strict" ;


class ReceptorGeometry {

    _receptorGeometry ;

    constructor() {

        // 5x1 rectangle
        this._receptorGeometry = new THREE.PlaneGeometry( 5 , 1 , 1, 1 ) ;

    }


    get receptorGeometry() {
        return this._receptorGeometry;
    }
}