"use strict" ;


class BackgroundGeometry {

    _backgroundGeometry ;

    constructor() {

        // 138/36 because of the resolution of the image
        this._backgroundGeometry = new THREE.PlaneGeometry( 20 , 12 , 1, 1) ;

    }


    get backgroundGeometry() {
        return this._backgroundGeometry;
    }
}