'use strict'

class StepNoteFX extends GameObject {


    _tweenOpacityEffect ;
    _mesh ;
    _kind ;

    constructor(resourceManager, kind) {
        super(resourceManager);
        this._resourceManager = resourceManager ;
        this._kind = kind ;
        this._mesh = this._resourceManager.constructStepNoteFX( this._kind ) ;
    }


    animate (  ) {

        const time = 250 ;
        this._mesh.material.opacity = 1.0 ;

        if ( this._tweenOpacityEffect !== null ) {
            TWEEN.remove(this._tweenOpacityEffect) ;
        }

        this._tweenOpacityEffect = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0 }, time ).start();


    }

    get object () {
        return this._mesh;
    }


    ready() {

    }

    update(delta) {

    }
}