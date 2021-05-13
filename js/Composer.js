"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Composer {



    constructor ( song, noteskinPath, speed = 1 , keyBoardLag = 0) {

        this.keyBoardOffset = keyBoardLag ;
        this.accuracyMargin = 0.15 ;

        this.receptorFactory = new ReceptorFactory(noteskinPath);
        this.stepFactory = new StepFactory(noteskinPath);
        this.judgmentScale = new JudgmentScale(this.accuracyMargin) ;

        this.song = song;
        this.speed = speed ;

        this.stepAnimationRate = 25 ;
        this.explosionAnimationRate = 20 ;

        // Set up the key listener



        this.leftKeyMap = {
            dl: 90,
            ul : 81,
            c : 83,
            ur : 69,
            dr: 67
        }

        this.rightKeyMap = {
            dl: 86,
            ul : 82,
            c : 71,
            ur : 89,
            dr: 78
        }
        this.idLeftPad = 0 ;
        this.idRightPad = 1 ;

        // Keeps track o
        this.lastStepTimeStamp = 0.0;
        this.animationPosition = 0 ;

        this.effectSpeed = 1;
        this.lastEffectSpeed = 1;

        this.lastSSCSpeed = 1;
    }


    composeStage(level) {

        // this might change
        this.keyListener = new KeyInput(this)  ;
        this.keyListener.addPad(this.leftKeyMap, this.idLeftPad) ;
        this.keyListener.addPad(this.rightKeyMap, this.idRightPad) ;

        // Save the level.
        this.level = level ;

        // Create the bpmManager
        this.bpmManager = new BPMManager(this.song.getBMPs(level), this.song.getScrolls(level), this.speed) ;

        this.bpms = this.song.levels[level].meta['BPMS'] ;

        // This is to be used more than once in case of a double level
        this.stepQueue = new StepQueue(this, this.keyListener, this.accuracyMargin) ;

        // Depth of stage elements
        this.receptorZDepth = -0.00003 ;
        this.holdZDepth = -0.00002 ;
        this.holdEndNoteZDepth = -0.00001 ;
        this.stepNoteZDepth = 0.00001;
        this.stepEffectZDepth = 0.000015;
        this.explosionZDepth = 0.0001;

        // define position of the notes w.r.t. the receptor

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

        this.receptorsApart = 1.96 ;


        let stage = new THREE.Object3D();
        let steps = new THREE.Object3D();
        let receptors = new THREE.Object3D();

        // construct the thing TODO


        this.padTaps = { } ;
        this.padEffects = { } ;
        this.padExplosions = { } ;
        this.padSteps = {}

        var [Lsteps, Lreceptor, LreceptorObject, tapsObjDict, effectObjDict, explosionObjDict] =
            this.run(level, 0, this.idLeftPad) ;

        this.padTaps[this.idLeftPad] = tapsObjDict ;
        this.padEffects[this.idLeftPad] = effectObjDict ;
        this.padExplosions[this.idLeftPad] = explosionObjDict ;
        this.padSteps[this.idLeftPad] = Lsteps ;


        steps.add(Lsteps) ;
        receptors.add(LreceptorObject) ;

        // Only for the shader
        this.receptor = Lreceptor ;


        // only if the level is double
        if ( this.song.getLevelStyle(level) !== 'pump-single' ) {

            Lsteps.position.x = -this.receptorsApart ;
            LreceptorObject.position.x = -this.receptorsApart;

            var [Rsteps, Rreceptor, RreceptorObject, tapsObjDict, effectObjDict, explosionObjDict] =
                this.run(level, 5, this.idRightPad) ;

            this.padTaps[this.idRightPad] = tapsObjDict ;
            this.padEffects[this.idRightPad] = effectObjDict ;
            this.padExplosions[this.idRightPad] = explosionObjDict ;
            this.padSteps[this.idRightPad] = Rsteps ;


            Rsteps.position.x = this.receptorsApart ;
            RreceptorObject.position.x = this.receptorsApart;

            steps.add(Rsteps) ;
            receptors.add(RreceptorObject) ;
        }




        // TODO: merge steps into one object, same for receptor

        this.steps = steps ;
        // this.receptor = receptor;


        let judgmentObject = this.judgmentScale.getJudgmentObject();
        stage.add(judgmentObject) ;
        stage.add(steps) ;
        stage.add(receptors) ;

        this.stepQueue.cleanUpStepQueue() ;

        return stage ;
    }

    // Returns 3DObject containing the steps of the level.
    run (level, stepDataOffset, padId) {


        // object containing all the steps of the chart.
        let steps = new THREE.Object3D();

        const noteData = this.song.levels[level] ;

        // TODO: watch out when BPM changes during song. You will need to reconsider this.


        let listIndex = 0 ;
        // i loops the bars
        for (var i = 0 ; i < noteData.measures.length ; i++ ) {
            const measure = noteData.measures[i] ;

            const notesInBar = measure.length ;

            // j loops the notes inside the bar
            for ( var j = 0 ; j < measure.length ; j++ ) {

                listIndex += 1 ;
                const note = measure[j] ;

                const [currentYPosition, currentTimeInSong] = this.bpmManager.getYShiftAndCurrentTimeInSongAtBeat(i,j,notesInBar) ;


                // Add only if the entry is not created already
                if (listIndex > this.stepQueue.getLength()) {
                    this.stepQueue.addNewEntryWithTimeStampInfo(currentTimeInSong) ;
                }

                // dl
                this.processNote(
                    note[0+stepDataOffset],
                    'dl',
                    currentYPosition,
                    this.dlXPos,
                    steps,
                    currentTimeInSong,
                    listIndex -1,
                    padId) ;


                //ul
                this.processNote(
                    note[1+stepDataOffset],
                    'ul',
                    currentYPosition,
                    this.ulXPos,
                    steps,
                    currentTimeInSong,
                    listIndex -1,
                    padId) ;

                // c
                this.processNote(
                    note[2+stepDataOffset],
                    'c',
                    currentYPosition,
                    this.cXPos,
                    steps,
                    currentTimeInSong,
                    listIndex -1,
                    padId) ;

                // ur
                this.processNote(
                    note[3+stepDataOffset],
                    'ur',
                    currentYPosition,
                    this.urXPos,
                    steps,
                    currentTimeInSong,
                    listIndex -1,
                    padId) ;

                // dr
                this.processNote(
                    note[4+stepDataOffset],
                    'dr',
                    currentYPosition,
                    this.drXPos,
                    steps,
                    currentTimeInSong,
                    listIndex -1,
                    padId) ;

            }

        }

        // this.stepQueue.cleanUpStepQueue() ;


        // maybe the song starts with a hold.
        // this.addHolds() ;


        // console.log(this.stepQueue.stepQueue);
        // Get receptor
        let receptorObject = new THREE.Object3D();
        let receptor = this.receptorFactory.getReceptor();
        receptor.position.z = this.receptorZDepth;



        receptorObject.add(receptor);
        // Set up taps

        let tapsObjDict = {
            dl: this.getTap('dl', this.dlXPos ) ,
            ul: this.getTap('ul', this.ulXPos ),
            c: this.getTap('c', this.cXPos ),
            ur : this.getTap('ur', this.urXPos ),
            dr: this.getTap('dr', this.drXPos )
        }


        receptorObject.add(tapsObjDict.dl) ;
        receptorObject.add(tapsObjDict.ul) ;
        receptorObject.add(tapsObjDict.c) ;
        receptorObject.add(tapsObjDict.ur) ;
        receptorObject.add(tapsObjDict.dr) ;


        // add effect


        let effectObjDict = {
            dl: this.getEffect('dl', this.dlXPos ) ,
            ul: this.getEffect('ul', this.ulXPos ),
            c: this.getEffect('c', this.cXPos),
            ur : this.getEffect('ur', this.urXPos),
            dr: this.getEffect('dr', this.drXPos )
        }



        receptorObject.add(effectObjDict.dl) ;
        receptorObject.add(effectObjDict.ul) ;
        receptorObject.add(effectObjDict.c) ;
        receptorObject.add(effectObjDict.ur) ;
        receptorObject.add(effectObjDict.dr) ;


        // add explosion effects

        let explosionObjDict = {
            dl: this.getExplosion(this.dlXPos) ,
            ul: this.getExplosion(this.ulXPos),
            c: this.getExplosion(this.cXPos),
            ur : this.getExplosion(this.urXPos),
            dr: this.getExplosion(this.drXPos)
        }

        // this.dlExplosion.material.opacity = 1.0 ;
        // this.dlExplosion.material.map.offset.set(4/5,0) ;
        receptorObject.add(explosionObjDict.dl) ;
        receptorObject.add(explosionObjDict.ul) ;
        receptorObject.add(explosionObjDict.c) ;
        receptorObject.add(explosionObjDict.ur) ;
        receptorObject.add(explosionObjDict.dr) ;




        return [steps, receptor, receptorObject, tapsObjDict, effectObjDict, explosionObjDict] ;

    }

    getTap (kind, XPosition) {
        let tap = this.receptorFactory.getTap(kind);
        tap.position.x = XPosition ;
        tap.material.opacity = 0.0 ;
        tap.tweenOpacityEffect = null ;
        return tap ;
    }

    getEffect(kind,XPosition) {
        let effect = this.stepFactory.getStepEffect(kind);
        effect.position.x = XPosition ;
        effect.position.z = this.stepEffectZDepth ;
        effect.material.opacity = 0.0 ;
        effect.tweenOpacityEffect = null ;
        return effect ;
    }

    getExplosion(XPosition) {

        let explosion = this.receptorFactory.constructExplosion() ;
        explosion.position.z = this.explosionZDepth ;
        explosion.position.x = XPosition;
        explosion.material.opacity = 0.0 ;
        explosion.lastStepTimeStamp = 0.0 ;
        explosion.animationPosition = 0 ;
        explosion.animate = false ;

        return explosion ;
    }


    processNote(note, kind, currentYPosition, XStepPosition , steps, currentTimeInSong, index, padId ) {


        // Process tapNote
        if ( note === '1' || note === '2' ) {
            let step = this.stepFactory.getStep(kind);

            // attributes created here (they do not exist before)
            step.kind = kind ;
            step.padId = padId ;
            step.pressed = false ;
            step.isHold = false ;

            step.position.y = currentYPosition ;
            step.position.x = XStepPosition ;
            step.position.z = this.stepNoteZDepth ;

            // Add step to be rendered
            steps.add(step) ;

            // [1] add step to the stepList
            this.stepQueue.addStepToStepList(step, index) ;

            if (note === '2') {
                step.isHold = true ;
                step.held = false ;
                step.beginningHoldYPosition = currentYPosition ;
                step.beginHoldTimeStamp = currentTimeInSong ;
                this.stepQueue.setHold(kind, padId, step) ;
            }

        }

        // Process hold and endNote
        if ( note === '3' ) {

            let step = this.stepQueue.getHold(kind,padId) ;
            let beginningHoldYPosition = step.beginningHoldYPosition ;

            let hold = this.stepFactory.getHold(kind) ;
            hold.padId = padId ;
            let holdScale = beginningHoldYPosition - currentYPosition ;
            hold.position.z = this.holdZDepth ;
            hold.scale.y = holdScale ;
            // -0.5 to shift it to the center
            hold.position.y = beginningHoldYPosition - holdScale*0.5 ;
            hold.position.x = XStepPosition ;
            steps.add(hold) ;
            step.holdObject = hold ;


            let endNote = this.stepFactory.getHoldEndNote(kind);
            endNote.padId = padId ;
            endNote.position.y = currentYPosition ;
            endNote.position.x = XStepPosition ;
            endNote.position.z = this.holdEndNoteZDepth ;
            steps.add(endNote) ;
            step.endHoldYPosition = currentYPosition ;
            step.endNoteObject = endNote ;
            step.endHoldTimeStamp = currentTimeInSong ;

        }

    }


    update(delta) {

        // console.log(this.stepQueue.stepQueue[0]) ;

        const currentAudioTime = this.song.getCurrentAudioTime(this.level) ;

        // Corrected w.r.t. keyboard lag.
        const currentAudioTimeCorrected = this.song.getCurrentAudioTime(this.level) - this.keyBoardOffset ;

        //

        // update position of the steps in the 3D word.
        // this also returns the current beat given the audioTime
        const beat = this.updateStepsPositionAndGetCurrentBeat(delta, currentAudioTimeCorrected) ;

        this.updateCurrentSpeed(beat) ;

        // keep track of the upcoming steps and the active holds.
        this.stepQueue.updateStepQueueAndActiveHolds(currentAudioTimeCorrected, delta, beat) ;


        // Update animation of the steps (texture animation)
        this.updateStepsAnimation(delta) ;

        // Update the shader animation for the receptor
        this.updateReceptorAnimation(currentAudioTime) ;

        //update explosion animations
        this.updateExplosionAnimations(delta) ;



    }

    getTickCountAtBeat(beat) {
        return this.song.getTickCountAtBeat(this.level, beat) ;
    }

    updateCurrentSpeed(beat) {
        const [speed, timeSegs] = this.song.getSpeedAndTimeAtBeat(this.level, beat) ;
        this.setNewSpeed(speed, timeSegs * 1000) ;
    }

    updateSpeed() {
        if (this.lastEffectSpeed !== this.effectSpeed ) {

            let lastEffectSpeed = this.lastEffectSpeed ;
            let effectSpeed = this.effectSpeed ;
            this.steps.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    // back to the original speed
                    child.position.y *=(1/lastEffectSpeed);
                    // apply new speed
                    child.position.y *= effectSpeed ;

                    if ( child.isHold ) {
                        child.holdObject.scale.y *= (1/lastEffectSpeed);
                        child.holdObject.scale.y *= effectSpeed;
                        child.beginningHoldYPosition *= (1/lastEffectSpeed);
                        child.beginningHoldYPosition *= effectSpeed;

                        child.endHoldYPosition *= (1/lastEffectSpeed);
                        child.endHoldYPosition *= effectSpeed;
                    }

                }}) ;

            this.lastEffectSpeed = this.effectSpeed ;

        }
    }

    setNewSpeed(speed, time = 200) {
        new TWEEN.Tween(this).to({effectSpeed: speed}, time).start();
    }

    // We do both things at the same time to save some computational time.
    updateStepsPositionAndGetCurrentBeat(delta, currentAudioTime) {
        let beat = undefined ;
        if ( currentAudioTime < 0 ) {
            this.lcat = currentAudioTime ;
            beat = this.updateStepsPositionAudioClockSync(currentAudioTime);
        } else {
            this.lcat += delta ;
            beat = this.updateStepsPositionDelta(this.lcat) ;
        }

        this.updateActiveHoldsPosition(delta) ;

        this.updateSpeed() ;
        return beat ;
    }

    updateActiveHoldsPosition(delta) {


        let listActiveHolds = this.stepQueue.activeHolds.asList() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            let distanceToOrigin = Math.abs (step.position.y) - this.steps.position.y ;

            // check if hold is pressed.
            if ( this.keyListener.isPressed(step.kind, step.padId) ) {

                // update step note position
                step.position.y += distanceToOrigin ;

                // update hold position
                let beginningHoldYPosition = step.position.y;
                let endHoldYPosition = step.endHoldYPosition ;
                let hold = step.holdObject ;
                let holdEndNote = step.endNoteObject ;

                // console.log(holdEndNote);


                let holdScale = beginningHoldYPosition - endHoldYPosition  ;
                hold.scale.y = holdScale ;

                // -0.5 to shift it to the center
                hold.position.y = beginningHoldYPosition - holdScale*0.5 ;



                let distanceStepNoteEndNote = beginningHoldYPosition - holdEndNote.position.y  ;

                // console.log(distanceStepNoteEndNote) ;


                // End note problem: we have to shrink it when it overlaps with the step Note.
                // holdScale is the distance between the step note and the end hold note.

                // Option with no shaders.
                if (  distanceStepNoteEndNote < 1 ) {

                    // shift to the middle of the step.
                    distanceStepNoteEndNote += 0.5 ;
                    let difference = holdEndNote.scale.y - distanceStepNoteEndNote ;
                    holdEndNote.scale.y = distanceStepNoteEndNote ;
                    holdEndNote.position.y -= difference*0.5 ;

                    // update also texture to keep aspect ratio
                    holdEndNote.material.map.repeat.set(1/6, (1/3)*distanceStepNoteEndNote ) ;

                }

            }



        }

    }

    updateStepsPositionDelta(lcat) {

        const [yDisplacement, beat] =  this.bpmManager.getYShiftAtCurrentAudioTime(lcat) ;
        //
        this.steps.position.y = yDisplacement* this.speed * this.effectSpeed;

        return beat ;

    }

    updateStepsPositionAudioClockSync(currentAudioTime) {


        const [yDisplacement, beat] =  this.bpmManager.getYShiftAtCurrentAudioTime(currentAudioTime) ;

        this.steps.position.y = yDisplacement* this.speed *this.effectSpeed ;


        return beat ;
    }

    updateReceptorAnimation(currentAudioTime) {


        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;

        // const audioTime = this.song.getCurrentAudioTime(this.level) ;

        if ( currentAudioTime < 0 ) {
            this.receptor.material.uniforms.activeColorContribution.value = 0 ;
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
        this.receptor.material.uniforms.activeColorContribution.value = 1.5*opacityLevel*opacityLevel ;

        // console.log(this.activeReceptor.material.opacity) ;




    }

    updateStepsAnimation(delta) {

        let timeStamp = this.lastStepTimeStamp + delta;

        let movement = timeStamp*this.stepAnimationRate ;

        if ( movement > 1 ) {

            this.animationPosition = (this.animationPosition + 1)%6 ;

            this.stepFactory.changeTexturePosition( this.animationPosition) ;

            this.lastStepTimeStamp = 0 ;
        } else {
            this.lastStepTimeStamp += delta ;
        }

    }

    updateExplosionAnimation (explosion, delta) {

        if ( explosion.animate ) {

            let timeStamp = explosion.lastStepTimeStamp + delta;

            let movement = timeStamp * this.explosionAnimationRate;

            if (movement > 1) {
                explosion.animationPosition = (explosion.animationPosition + 1) ;

                // if we reach the end of the animation, stop and reset values.
                if (explosion.animationPosition > 4 ) {
                    explosion.animate = false ;
                    explosion.animationPosition = 0 ;
                    explosion.material.opacity = 0.0 ;
                    explosion.lastStepTimeStamp = 0 ;
                    return ;
                }
                explosion.material.map.offset.set(explosion.animationPosition * (1 / 5) + 1/20, 1/4 );
                explosion.lastStepTimeStamp = 0;
            } else {
                explosion.lastStepTimeStamp += delta;
            }
        }
    }

    updateExplosionAnimations(delta){

        for ( let explosionDic of Object.values(this.padExplosions) ) {
            this.updateExplosionAnimation(explosionDic.dl,delta) ;
            this.updateExplosionAnimation(explosionDic.ul,delta) ;
            this.updateExplosionAnimation(explosionDic.c,delta) ;
            this.updateExplosionAnimation(explosionDic.ur,delta) ;
            this.updateExplosionAnimation(explosionDic.dr,delta) ;
        }

    }


    animateTap(kind, padId) {

        let tap = null ;

        switch (kind) {
            case 'dl':
                tap = this.padTaps[padId].dl ;
                break ;
            case 'ul':
                tap = this.padTaps[padId].ul ;
                break ;
            case 'c':
                tap = this.padTaps[padId].c ;
                break ;
            case 'ur':
                tap = this.padTaps[padId].ur ;
                break ;
            case 'dr':
                tap = this.padTaps[padId].dr ;
                break ;
        }

        const time = 250 ;
        const opacityDelay = 100 ;
        tap.material.opacity = 1.0 ;
        tap.scale.set(0.85,0.85) ;

        if ( tap.tweenOpacityEffect !== null ) {
           TWEEN.remove(tap.tweenOpacityEffect) ;
        }

        tap.tweenOpacityEffect = new TWEEN.Tween( tap.material ).to( { opacity: 0 }, time-opacityDelay ).delay(opacityDelay).start();
        new TWEEN.Tween( tap.scale ).to( { x: 1.2, y: 1.2 }, time ).start();
    }

    animateTapEffect(arrayOfArrows) {

        for ( var i = 0 ; i < arrayOfArrows.length ; ++i  ) {
            let tapEffect = null ;
            let explosion = null ;
            const kind = arrayOfArrows[i].kind ;
            const padId = arrayOfArrows[i].padId ;
            switch (kind) {
                case 'dl':
                    tapEffect = this.padEffects[padId].dl ;
                    explosion = this.padExplosions[padId].dl ;
                    break ;
                case 'ul':
                    tapEffect = this.padEffects[padId].ul ;
                    explosion = this.padExplosions[padId].ul ;
                    break ;
                case 'c':
                    tapEffect = this.padEffects[padId].c ;
                    explosion = this.padExplosions[padId].c ;
                    break ;
                case 'ur':
                    tapEffect = this.padEffects[padId].ur ;
                    explosion = this.padExplosions[padId].ur ;
                    break ;
                case 'dr':
                    tapEffect = this.padEffects[padId].dr ;
                    explosion = this.padExplosions[padId].dr ;
                    break ;
            }


            // Animate tap
            const time = 380 ;
            const delayOpacity = 250 ;
            tapEffect.material.opacity = 1.0 ;
            tapEffect.scale.set(1,1) ;

            // for early stopping the tween
            if ( tapEffect.tweenOpacityEffect !== null ) {
                TWEEN.remove(tapEffect.tweenOpacityEffect) ;
            }

            tapEffect.tweenOpacityEffect = new TWEEN.Tween( tapEffect.material ).to( { opacity: 0 }, time-delayOpacity ).delay(delayOpacity).start();
            new TWEEN.Tween( tapEffect.scale ).to( { x: 1.3, y: 1.3 }, time ).start();

            // animate explosion

            explosion.animate = true ;
            explosion.material.opacity = 1.0 ;
            explosion.animationPosition = 0 ;
            explosion.lastStepTimeStamp = 0 ;

        }

    }




    arrowPressed(kind, padId) {

        let currentAudioTime = this.song.getCurrentAudioTime(this.level) - this.keyBoardOffset;

        this.stepQueue.stepPressed(kind, padId, currentAudioTime) ;

        this.animateTap(kind, padId) ;

    }

    arrowReleased(kind, padId) {
        let currentAudioTime = this.song.getCurrentAudioTime(this.level) - this.keyBoardOffset;
        this.stepQueue.stepReleased(kind, padId, currentAudioTime) ;

    }

    removeObjectFromSteps(object) {
        this.padSteps[object.padId].remove(object) ;

    }





}