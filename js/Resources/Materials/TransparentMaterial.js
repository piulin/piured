'use strict' ;


class TransparentMaterial {


    _material ;

    constructor(map) {

        this._material = new THREE.MeshBasicMaterial( { map: map, transparent: true } );

        this._material.alphaTest = 0.1;

    }


    get material() {
        return this._material;
    }
}