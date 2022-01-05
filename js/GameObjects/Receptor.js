"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class Receptor extends GameObject {


    _receptor ;
    _beatManager ;
    _animationRate ;
    _object ;
    _keyInput ;
    _padId ;

    constructor(resourceManager, beatManager, keyInput, padId, animationRate) {
        super(resourceManager);
        this._keyInput = keyInput ;
        this._beatManager = beatManager ;
        this._animationRate = animationRate ;
        this._padId = padId ;

        this._object = new THREE.Object3D() ;


        this._receptor = this._resourceManager.constructReceptor( ) ;

        // Space to the right or left of a given step.
        const stepShift = 4/5;
        // Note that the receptor steps are a bit overlapped. This measure takes into
        // acount this overlap.
        const stepOverlap = 0.02 ;
        this.dlXPos =  -2*(stepShift - stepOverlap) ;
        this.ulXPos =  -(stepShift - stepOverlap) ;
        this.cXPos =  0 ;
        this.urXPos =  (stepShift - stepOverlap) ;
        this.drXPos =  2*(stepShift - stepOverlap) ;

        this.stepEffectZDepth = 0.002;
        this.explosionZDepth = 0.0001;


        this.dlBounce = this.setUpBounce('dl', this.dlXPos) ;
        this.ulBounce = this.setUpBounce('ul', this.ulXPos) ;
        this.cBounce = this.setUpBounce('c', this.cXPos) ;
        this.urBounce = this.setUpBounce('ur', this.urXPos) ;
        this.drBounce = this.setUpBounce('dr', this.drXPos) ;


        this.dlStepNote = this.setUpStepNote('dl', this.dlXPos) ;
        this.ulStepNote = this.setUpStepNote('ul', this.ulXPos) ;
        this.cStepNote = this.setUpStepNote('c', this.cXPos) ;
        this.urStepNote = this.setUpStepNote('ur', this.urXPos) ;
        this.drStepNote = this.setUpStepNote('dr', this.drXPos) ;


        this.dlFX = this.setUpExplosion(this.dlXPos) ;
        this.ulFX = this.setUpExplosion(this.ulXPos) ;
        this.cFX = this.setUpExplosion(this.cXPos) ;
        this.urFX = this.setUpExplosion(this.urXPos) ;
        this.drFX = this.setUpExplosion(this.drXPos) ;


        this.dlTap = this.setUpTap('dl',this.dlXPos) ;
        this.ulTap = this.setUpTap('ul',this.ulXPos) ;
        this.cTap = this.setUpTap('c',this.cXPos) ;
        this.urTap = this.setUpTap('ur',this.urXPos) ;
        this.drTap = this.setUpTap('dr',this.drXPos) ;


        this.dlWhiteTap = this.setUpWhiteTap('dl',this.dlXPos) ;
        this.ulWhiteTap = this.setUpWhiteTap('ul',this.ulXPos) ;
        this.cWhiteTap = this.setUpWhiteTap('c',this.cXPos) ;
        this.urWhiteTap = this.setUpWhiteTap('ur',this.urXPos) ;
        this.drWhiteTap = this.setUpWhiteTap('dr',this.drXPos) ;

        this._object.add(this._receptor) ;
    }

    setUpBounce(kind, XPosition) {

        let bounce = new StepBounce(this._resourceManager, kind, this._animationRate) ;
        bounce.object.position.x = XPosition ;
        bounce.object.position.z = this.stepEffectZDepth ;
        bounce.object.material.opacity = 0.0 ;
        this._object.add(bounce.object) ;
        engine.addToUpdateList(bounce) ;
        return bounce ;
    }

    setUpExplosion(XPosition) {

        let explosion = new Explosion(this._resourceManager) ;
        explosion.object.position.z = this.explosionZDepth ;
        explosion.object.position.x = XPosition;
        explosion.object.material.opacity = 0.0 ;

        this._object.add(explosion.object) ;
        engine.addToUpdateList(explosion) ;
        return explosion ;
    }

    setUpStepNote(kind, XPosition) {
        let note = new StepNoteFX(this._resourceManager, kind) ;
        note.object.position.x = XPosition ;
        // tap.object.position.z = 0.01 ;
        note.object.material.opacity = 0.0 ;

        this._object.add(note.object) ;
        engine.addToUpdateList(note) ;

        return note ;

    }

    setUpTap(kind, XPosition) {
        let tap = new Tap(this._resourceManager, kind) ;
        tap.object.position.x = XPosition ;
        // tap.object.position.z = 0.01 ;
        tap.object.material.opacity = 0.0 ;

        this._object.add(tap.object) ;
        engine.addToUpdateList(tap) ;

        return tap ;

    }

    setUpWhiteTap(kind, XPosition) {
        let tap = new WhiteTap(this._resourceManager, kind) ;
        tap.object.position.x = XPosition ;
        tap.object.position.z = 0.01 ;
        tap.object.material.opacity = 0.0 ;

        this._object.add(tap.object) ;
        engine.addToUpdateList(tap) ;

        return tap ;

    }


    animateExplosionStep(step) {


        let tapEffect = null ;
        let explosion = null ;
        let stepNote = null ;
        const kind = step.kind ;
        switch (kind) {
            case 'dl':
                tapEffect = this.dlBounce
                explosion = this.dlFX ;
                stepNote = this.dlStepNote ;
                break ;
            case 'ul':
                tapEffect = this.ulBounce ;
                explosion = this.ulFX ;
                stepNote = this.ulStepNote ;
                break ;
            case 'c':
                tapEffect = this.cBounce ;
                explosion = this.cFX ;
                stepNote = this.cStepNote ;
                break ;
            case 'ur':
                tapEffect = this.urBounce ;
                explosion = this.urFX ;
                stepNote = this.urStepNote ;
                break ;
            case 'dr':
                tapEffect = this.drBounce ;
                explosion = this.drFX ;
                stepNote = this.drStepNote ;
                break ;
        }

        this.animateWhiteTap(kind)
        tapEffect.animate() ;
        explosion.animate() ;
        // stepNote.animate() ;

    }


    ready() {

    }

    input() {

        const pressedKeys = this._keyInput.getPressed() ;

        for ( const [kind, padId] of pressedKeys ) {
            if (padId === this._padId) {
                this.animateTap(kind) ;
                // this.animateWhiteTap(kind) ;
            }
        }

    }

    animateTap(kind) {
            var tap = null ;
            switch (kind) {
                case 'dl':
                    tap = this.dlTap
                    break ;
                case 'ul':
                    tap = this.ulTap ;
                    break ;
                case 'c':
                    tap = this.cTap ;
                    break ;
                case 'ur':
                    tap = this.urTap ;
                    break ;
                case 'dr':
                    tap = this.drTap ;
                    break ;
            }
            tap.animate() ;
    }

    animateWhiteTap(kind) {


        var tap = null ;
        switch (kind) {
            case 'dl':
                tap = this.dlWhiteTap ;
                break ;
            case 'ul':
                tap = this.ulWhiteTap ;
                break ;
            case 'c':
                tap = this.cWhiteTap ;
                break ;
            case 'ur':
                tap = this.urWhiteTap ;
                break ;
            case 'dr':
                tap = this.drWhiteTap ;
                break ;
        }
        tap.animate() ;
    }


    update(delta) {


        const bpm = this._beatManager.currentBPM ;
        const currentAudioTime = this._beatManager.currentAudioTimeReal ;
        // const bpm = this.bpmManager.getCurrentBPM() ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;

        // const audioTime = this.song.getCurrentAudioTime(this.level) ;

        if ( currentAudioTime < 0 ) {
            this._receptor.material.uniforms.activeColorContribution.value = 0 ;
            return ;
        }

        const timeInBeat = Math.abs(  currentAudioTime % secondsPerBeat  ) ;
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
        let opacityLevel = (1 - normalizedTimeInBeat) ;
        // if (opacityLevel > 0.9 ) {
        //     opacityLevel = 1 ;
        // }

        // f(x) = 1/(1+(x/(1-x))^(- <beta>))
        // const beta = 1.5 ;
        // const outputOpacityLevel = 1/(1+ Math.pow( (opacityLevel/(1-opacityLevel)), (- beta)) )

        // to dump the energy over time
        // this.activeReceptor.material.opacity = outputOpacityLevel ;
        this._receptor.material.uniforms.activeColorContribution.value = 1.5*opacityLevel*opacityLevel ;


    }

    get object() {
        return this._object;
    }



}