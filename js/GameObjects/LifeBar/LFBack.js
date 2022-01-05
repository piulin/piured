'use strict' ;

class LFBack extends GameObject {

    _mesh ;


    constructor( resourceManager, kind ) {
        super(resourceManager);
        let back = null ;

        if (kind === 'single') {
            back = this._resourceManager.constructSLifeBarBack() ;
        } else if (kind === 'double') {
            back = this._resourceManager.constructDLifeBarBack() ;
        }

        back.material.map.repeat.set(1,1/2);
        back.material.map.offset.set(0,1/2);
        this._mesh = back ;

        // this._tweenOpacityEffect = undefined ;

    }

    ready() {

    }

    normal() {
        this._mesh.material.map.offset.set(0,1/2);
    }

    red () {
        this._mesh.material.map.offset.set(0,0);
    }

    animate() {


    }

    update(delta) {


    }

    get object () {
        return this._mesh;
    }
}