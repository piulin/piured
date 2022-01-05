'use strict' ;

class LFPulse extends GameObject {

    _mesh ;
    _object ;
    _beatManager ;

    size = 0.5 ;


    constructor( resourceManager, beatManager, kind ) {
        super(resourceManager);



        this._object = new THREE.Object3D() ;
        this._mesh = this._resourceManager.constructLifeBarPulse() ;
        this._object.add(this._mesh) ;

        this._beatManager = beatManager ;
        this.kind = kind ;

        if (kind === 'single') {
            this.size = 0.5 ;
        } else if (kind ==='double'){
            this.size = 1 ;
            this._mesh.scale.x = 2 ;
        }


        this.setsize(1.0) ;

        // this._tweenOpacityEffect = undefined ;

    }

    setsize(size) {

        this._mesh.position.x = -(this.size/2- this.size*(size/2)) ;
        if (this.kind === 'single') {
            this._mesh.scale.x = size ;
        } else {
            this._mesh.scale.x = 2*size ;
        }

    }

    ready() {

    }

    animate() {


    }

    set opacity(opacity){
        this._mesh.material.opacity = opacity ;
    }

    update(delta) {


        const bpm = this._beatManager.currentBPM ;
        const currentAudioTime = this._beatManager.currentAudioTimeReal ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;


        if ( currentAudioTime < 0 ) {
            this.setsize(1.0) ;
            return ;
        }

        const timeInBeat = Math.abs(  currentAudioTime % secondsPerBeat  ) ;
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
        let level = (1 - normalizedTimeInBeat) ;

        if (level !== 0) {
            let ml = Math.log(level) / Math.log(1.5);
            let size = 1 + ml ;

            if ( ml > -1.0 ) {
                this.setsize(size*size) ;
            } else {
                this.setsize(0) ;
            }
        } else {
            this.setsize(0) ;
        }


    }

    get object () {
        return this._object ;
    }
}