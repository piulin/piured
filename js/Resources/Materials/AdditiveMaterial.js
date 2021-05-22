'use strict' ;


class AdditiveMaterial  {


    _material ;

    constructor(map) {



        this._material = new THREE.MeshBasicMaterial( { map: map, transparent: true } );

        this._material.alphaTest = 0.1;

        this._material.blending = THREE.AdditiveBlending ;
        this._material.depthWrite = false ;

    }


    get material() {
        return this._material;
    }
}