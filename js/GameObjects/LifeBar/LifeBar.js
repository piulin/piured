"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class LifeBar extends GameObject {


    _back ;
    _bar ;
    _front ;
    _tip ;
    _pulse ;

    _beatManager ;
    _animationRate ;
    _object ;

    constructor(resourceManager, beatManager, kind) {
        super(resourceManager);
        this._beatManager = beatManager ;
        this._object = new THREE.Object3D() ;
        this._receptor = this._resourceManager.constructReceptor( ) ;

        this._back = this.setUpBack(kind) ;
        this._bar = this.setUpBar(kind) ;
        this._front = this.setUpFront(kind) ;

        this.setsize(0.5);

    }

    setsize(size) {

        if (size < 0.3) {
            this._back.red();
        } else {
            this._back.normal();
        }

        this._bar.setsize(size) ;

    }





    setUpBack(kind) {
        let back = new LFBack(this._resourceManager, kind) ;
        back.object.position.z = 0.01 ;
        back.object.material.opacity = 1.0 ;
        this._object.add(back.object) ;
        engine.addToUpdateList(back) ;
        return back ;
    }

    setUpFront(kind) {
        let front = new LFFront(this._resourceManager, kind) ;
        front.object.position.z = 0.03 ;
        front.object.scale.x = 1.01 ;
        front.object.scale.y = 1.05 ;
        front.object.material.opacity = 1.0 ;
        this._object.add(front.object) ;
        engine.addToUpdateList(front) ;
        return front ;
    }

    setUpBar(kind) {
        let bar = new LFBar(this._resourceManager, this._beatManager, kind) ;
        bar.object.position.z = 0.02 ;
        this._object.add(bar.object) ;
        engine.addToUpdateList(bar) ;
        return bar ;
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