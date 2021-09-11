'use strict' ;

class LFBarFX extends GameObject {

    _mesh ;
    _show ;
    _blink ;

    constructor( resourceManager, kind) {
        super(resourceManager);
        if ( kind === 'single') {
            this._mesh = this._resourceManager.constructSLifeBarBarFX() ;
        } else if ( kind === 'double') {
            this._mesh = this._resourceManager.constructDLifeBarBarFX() ;
        }

        let scale = 1.5 ;

        this._mesh.material.color.r = scale ;
        this._mesh.material.color.g = scale ;
        this._mesh.material.color.b = scale ;

        this._show = false ;
        this._blink = false ;

    }

    ready() {

    }

    animate() {



    }

    set blink(blink) {
        this._blink = blink ;
    }



    update(delta) {

        if ( this._blink ) {
            if (this._show) {
                this._show = false ;
                this._mesh.material.opacity = 0.0 ;
            } else {
                this._show = true ;
                this._mesh.material.opacity = 1.0 ;

            }
        } else {
            this._mesh.material.opacity = 0.0 ;
        }

    }

    get object () {
        return this._mesh;
    }
}