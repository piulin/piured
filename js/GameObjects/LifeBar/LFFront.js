'use strict' ;

class LFFront extends GameObject {

    _mesh ;


    constructor( resourceManager, kind ) {

        super(resourceManager);


        if (kind === 'single') {
            this._mesh = this._resourceManager.constructSLifeBarFront() ;
        } else if (kind === 'double') {
            this._mesh = this._resourceManager.constructDLifeBarFront() ;
        }

        // this._tweenOpacityEffect = undefined ;

    }

    ready() {

    }

    animate() {


    }

    update(delta) {


    }

    get object () {
        return this._mesh;
    }
}