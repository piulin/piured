'use strict' ;


class JudgmentGeometry {


    _judgmentGeometry;

    constructor( ) {

        // 6x1 rectangle
        this._judgmentGeometry = new THREE.PlaneGeometry( 6 , 1 , 1, 1) ;
    }


    get judgmentGeometry() {
        return this._judgmentGeometry;
    }
}