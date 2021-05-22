'use strict' ;


class Background extends GameObject {


    _mesh ;
    _beatManager ;

    constructor(resourceManager, beatManager) {
        super(resourceManager);

        this._mesh = resourceManager.constructBackground() ;
        this._beatManager = beatManager ;

    }

    ready() {


    }

    update(delta) {


        const bpm = this._beatManager.currentBPM ;
        const currentAudioTime = this._beatManager.currentAudioTimeReal ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;

        if (currentAudioTime < 0 ) {
            this._mesh.material.uniforms.uThreshold.value = 0.3 ;
            return ;
        }

        const timeInBeat = Math.abs(  currentAudioTime % secondsPerBeat  ) ;
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
        let opacityLevel = (1 - normalizedTimeInBeat) ;


        const tal = (1-opacityLevel*opacityLevel)
            * (0.7) + 0.1;
        this._mesh.material.uniforms.uThreshold.value = tal  ;

    }



    get object( ) {
        return this._mesh ;
    }
}