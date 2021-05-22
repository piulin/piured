"use strict" ;


class StepGeometry {

    _stepGeometry ;

    constructor() {

        // 1x1 square
        this._stepGeometry = new THREE.PlaneGeometry( 1 , 1 , 1, 1 ) ;

    }


    get stepGeometry() {
        return this._stepGeometry;
    }
}