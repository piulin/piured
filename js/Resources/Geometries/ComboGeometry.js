"use strict" ;


class ComboGeometry {

    _comboGeometry ;

    constructor() {

        // 138/36 because of the resolution of the image
        this._comboGeometry = new THREE.PlaneGeometry( 138/36 , 1 , 1, 1) ;

    }


    get comboGeometry() {
        return this._comboGeometry;
    }
}