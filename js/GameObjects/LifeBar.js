"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class LifeBar extends GameObject {


    _bg ;
    _bar ;
    _front ;
    _tip ;
    _pulse ;

    _beatManager ;
    _animationRate ;
    _object ;

    constructor(resourceManager, beatManager) {
        super(resourceManager);
        this._beatManager = beatManager ;
        this._object = new THREE.Object3D() ;
        this._receptor = this._resourceManager.constructReceptor( ) ;

    }

    setUpBg() {

    }



    ready() {

    }




    update(delta) {


        const bpm = this._beatManager.currentBPM ;
        const currentAudioTime = this._beatManager.currentAudioTimeReal ;
        // const bpm = this.bpmManager.getCurrentBPM() ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;

    }

    get object() {
        return this._object;
    }



}