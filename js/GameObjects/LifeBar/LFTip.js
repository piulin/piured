'use strict' ;

class LFTip extends GameObject {

    _mesh ;
    _show ;

    constructor( resourceManager ) {
        super(resourceManager);

        let tip = this._resourceManager.constructLifeBarTip() ;
        tip.material.map.repeat.set(1,1/2);
        tip.material.map.offset.set(0,1/2);
        this._mesh = tip ;

        // this._tweenOpacityEffect = undefined ;

    }

    ready() {
        this._show = false ;
    }

    animate() {



    }

    blue () {
        this._mesh.material.map.offset.set(0,1/2);
    }

    red () {
        this._mesh.material.map.offset.set(0,0);
    }

    update(delta) {

        if (this._show) {
            this._show = false ;
            this._mesh.material.opacity = 1.0 ;
        } else {
            this._show = true ;
            this._mesh.material.opacity = 0.0 ;
        }

    }

    get object () {
        return this._mesh;
    }
}