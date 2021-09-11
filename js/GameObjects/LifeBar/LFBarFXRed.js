'use strict' ;

class LFBarFXRed extends GameObject {

    _mesh ;
    _show ;
    _blink ;
    _beatManager ;
    constructor( resourceManager, beatManager, kind ) {
        super(resourceManager);

        this._mesh = this._resourceManager.constructSLifeBarBarFXRed() ;

        if ( kind === 'single') {
            this._mesh = this._resourceManager.constructSLifeBarBarFXRed() ;

        } else if ( kind === 'double') {

            this._mesh = this._resourceManager.constructDLifeBarBarFXRed() ;
        }
        this._show = false ;
        this._blink = false ;
        this._beatManager = beatManager ;

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
            const bpm = this._beatManager.currentBPM ;
            const currentAudioTime = this._beatManager.currentAudioTimeReal ;
            const beatsPerSecond = bpm / 60 ;
            const secondsPerBeat = 60 / bpm ;

            const timeInBeat = Math.abs(  currentAudioTime % secondsPerBeat  ) ;
            const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
            let level = (1 - normalizedTimeInBeat) ;

            this._mesh.material.opacity = 0.3 + (level*level/2) ;

        } else {
            this._mesh.material.opacity = 0.0 ;
        }

    }

    get object () {
        return this._mesh;
    }
}