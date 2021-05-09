"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Composer {



    constructor ( song, noteskinPath, speed = 1 , keyBoardLag = 0) {

        this.keyBoardOffset = keyBoardLag ;

        this.receptorFactory = new ReceptorFactory(noteskinPath);
        this.stepFactory = new StepFactory(noteskinPath);
        this.judgmentFactory = new JudgmentFactory() ;

        this.song = song;
        this.speed = speed ;

        this.stepAnimationRate = 25 ;
        this.explosionAnimationRate = 20 ;

        // Set up the key listener
        this.keyListener = new KeyInput(this) ;

        // combo count
        this.comboCount = 0 ;

    }


    // Returns 3DObject containing the steps of the level.
    run (level) {

        this.accuracyMargin = 0.15 ;

        this.forceSync = true;
        // Save the level.
        this.level = level ;

        this.bpms = this.song.levels[level].meta['BPMS'] ;

        // Depth of stage elements
        this.receptorZDepth = -0.00003 ;
        this.holdZDepth = -0.00002 ;
        this.holdEndNoteZDepth = -0.00001 ;
        this.stepNoteZDepth = 0.00001;
        this.ExplosionZDepth = 0.00002;
        this.judgmentZDepth = 0.00002;

        // Keeps
        this.lastStepTimeStamp = 0.0;
        this.animationPosition = 0 ;

        //judgment position

        this.judgmentYPosition = -2.5 ;



        // Space to the right or left of a given step.
        const stepShift = 4/5;
        // Note that the receptor steps are a bit overlapped. This measure takes into
        // acount this overlap.
        const stepOverlap = 0.02 ;

        // define position of the notes w.r.t. the receptor
        this.dlXPos =  -2*(stepShift - stepOverlap) ;
        this.ulXPos =  -(stepShift - stepOverlap) ;
        this.cXPos =  0 ;
        this.urXPos =  (stepShift - stepOverlap) ;
        this.drXPos =  2*(stepShift - stepOverlap) ;

        // object containing all the steps of the chart.
        let steps = new THREE.Object3D();

        const noteData = this.song.levels[level] ;

        this.stepQueue = new StepQueue(this, this.keyListener, this.accuracyMargin) ;






        // These are mock values.
        // let beginningDownRightHoldYPosition = 2 ;
        // let beginningUpRightHoldYPosition = 2 ;
        // let beginningCenterHoldYPosition = 2 ;
        // let beginningUpLeftHoldYPosition = 2 ;
        // let beginningDownLeftHoldYPosition = 2 ;

        // TODO: watch out when BPM changes during song. You will need to reconsider this.


        const secondsPerBeat = 60 / this.bpms[0][1] ;


        // i loops the bars
        for (var i = 0 ; i < noteData.measures.length ; i++ ) {
            const measure = noteData.measures[i] ;

            const notesInBar = measure.length ;

            // j loops the notes inside the bar
            for ( var j = 0 ; j < measure.length ; j++ ) {
                const note = measure[j] ;

                // TODO: check what happens with tuplet (e.g. triplets) lol
                const currentYPosition = - (4*i + 4*j/notesInBar) * this.speed ;

                const currentTimeInSong = (4*i + 4*j/notesInBar) * secondsPerBeat;

                this.stepQueue.addNewEntryWithTimeStampInfo(currentTimeInSong) ;

                // dl
                this.processNote(
                    note[0],
                    'dl',
                    currentYPosition,
                    this.dlXPos,
                    steps,
                    currentTimeInSong) ;


                //ul
                this.processNote(
                    note[1],
                    'ul',
                    currentYPosition,
                    this.ulXPos,
                    steps,
                    currentTimeInSong) ;

                // c
                this.processNote(
                    note[2],
                    'c',
                    currentYPosition,
                    this.cXPos,
                    steps,
                    currentTimeInSong) ;

                // ur
                this.processNote(
                    note[3],
                    'ur',
                    currentYPosition,
                    this.urXPos,
                    steps,
                    currentTimeInSong) ;

                // dr
                this.processNote(
                    note[4],
                    'dr',
                    currentYPosition,
                    this.drXPos,
                    steps,
                    currentTimeInSong) ;

            }

        }

        this.stepQueue.cleanUpStepQueue() ;


        // maybe the song starts with a hold.
        // this.addHolds() ;


        // console.log(this.stepQueue.stepQueue);
        // Get receptor
        let rObject = new THREE.Object3D();
        let receptor = this.receptorFactory.getReceptor();
        receptor.position.z = this.receptorZDepth;

        this.receptor = receptor;

        rObject.add(receptor);
        // Set up tabs
        this.dlTap = this.getTap('dl', this.dlXPos );
        this.ulTap = this.getTap('ul', this.ulXPos );
        this.cTap = this.getTap('c', this.cXPos );
        this.urTap = this.getTap('ur', this.urXPos );
        this.drTap = this.getTap('dr', this.drXPos );

        rObject.add(this.dlTap) ;
        rObject.add(this.ulTap) ;
        rObject.add(this.cTap) ;
        rObject.add(this.urTap) ;
        rObject.add(this.drTap) ;


        this.dlEffect = this.getEffect('dl', this.dlXPos );
        this.ulEffect = this.getEffect('ul', this.ulXPos );
        this.cEffect = this.getEffect('c', this.cXPos);
        this.urEffect = this.getEffect('ur', this.urXPos);
        this.drEffect = this.getEffect('dr', this.drXPos );

        // this.dlEffect.scale.set(1.2,1.2) ;


        rObject.add(this.dlEffect) ;
        rObject.add(this.ulEffect) ;
        rObject.add(this.cEffect) ;
        rObject.add(this.urEffect) ;
        rObject.add(this.drEffect) ;


        // add explosion effects
        this.dlExplosion = this.getExplosion(this.dlXPos) ;
        // this.dlExplosion.material.opacity = 1.0 ;
        // this.dlExplosion.material.map.offset.set(4/5,0) ;
        rObject.add(this.dlExplosion) ;

        this.ulExplosion = this.getExplosion(this.ulXPos) ;
        rObject.add(this.ulExplosion) ;

        this.cExplosion = this.getExplosion(this.cXPos) ;
        rObject.add(this.cExplosion) ;

        this.urExplosion = this.getExplosion(this.urXPos) ;
        rObject.add(this.urExplosion) ;

        this.drExplosion = this.getExplosion(this.drXPos) ;
        rObject.add(this.drExplosion) ;


        // retrieve the judgement


        this.judgment = this.judgmentFactory.judgement ;
        this.judgment.position.z = this.judgmentZDepth ;
        this.judgment.position.y = this.judgmentYPosition ;
        // this.judgment.position.y = -0.5 ;
        // 0.6
        this.judgment.scale.set( 0.6 , 0.6, 1) ;
        this.judgment.material.opacity = 0.0 ;
        this.judgmentFactory.updateJudgementTexture('p') ;
        this.judgment.scaleFadeTween = null ;
        this.judgment.opacityFadeTween = null ;


        this.comboYPosition = this.judgmentYPosition - 0.45 ;

        this.combo = this.judgmentFactory.combo ;
        this.combo.position.z = this.judgmentZDepth ;
        this.combo.position.y = this.comboYPosition ;
        this.combo.material.opacity = 0.0 ;
        this.combo.scale.set(0.37, 0.37) ;
        this.combo.scaleFadeTween = null ;
        this.combo.opacityFadeTween = null ;


        // digits
        this.digitsYPosition = this.comboYPosition - 0.35;

        this.normalDigits = this.judgmentFactory.normalDigitsObjects ;
        this.normalDigits.position.y = this.digitsYPosition ;
        this.normalDigits.position.z = this.judgmentZDepth ;
        // this.judgmentFactory.updateNormalDigits(126) ;
        this.normalDigits.opacityFadeTween = null ;


        this.playerCourse = new THREE.Object3D() ;
        this.playerCourse.add(steps) ;
        this.playerCourse.add(rObject) ;
        this.playerCourse.add(this.judgment) ;
        this.playerCourse.add(this.combo) ;
        this.playerCourse.add(this.normalDigits) ;

        this.steps = steps ;
        return this.playerCourse ;

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
        effect.material.opacity = 0.0 ;
        effect.tweenOpacityEffect = null ;
        return effect ;
    }

    getExplosion(XPosition) {

        let explosion = this.receptorFactory.constructExplosion() ;
        explosion.position.z = this.ExplosionZDepth ;
        explosion.position.x = XPosition;
        explosion.material.opacity = 0.0 ;
        explosion.lastStepTimeStamp = 0.0 ;
        explosion.animationPosition = 0 ;
        explosion.animate = false ;

        return explosion ;
    }


    processNote(note, kind, currentYPosition, XStepPosition , steps, currentTimeInSong ) {


        // Process tapNote
        if ( note === '1' || note === '2' ) {
            let step = this.stepFactory.getStep(kind);

            // attributes created here (they do not exist before)
            step.kind = kind ;
            step.pressed = false ;
            step.isHold = false ;

            step.position.y = currentYPosition ;
            step.position.x = XStepPosition ;
            step.position.z = this.stepNoteZDepth ;

            // Add step to be rendered
            steps.add(step) ;

            // [1] add step to the stepList
            this.stepQueue.addStepToLastStepInfo(step) ;

            if (note === '2') {
                step.isHold = true ;
                step.held = false ;
                step.beginningHoldYPosition = currentYPosition ;
                this.stepQueue.setHold(kind, step) ;
            }

        }

        // Process hold and endNote
        if ( note === '3' ) {

            let step = this.stepQueue.getHold(kind) ;
            let beginningHoldYPosition = step.beginningHoldYPosition ;

            let hold = this.stepFactory.getHold(kind) ;
            let holdScale = beginningHoldYPosition - currentYPosition ;
            hold.position.z = this.holdZDepth ;
            hold.scale.y = holdScale ;
            // -0.5 to shift it to the center
            hold.position.y = beginningHoldYPosition - holdScale*0.5 ;
            hold.position.x = XStepPosition ;
            steps.add(hold) ;
            step.holdObject = hold ;


            let endNote = this.stepFactory.getHoldEndNote(kind);
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
        const currentAudioTimeCorrected = this.song.getCurrentAudioTime(this.level) - this.keyBoardOffset ;

        // keep track of the upcoming steps and the active holds.
        this.stepQueue.updateStepQueueAndActiveHolds(currentAudioTimeCorrected) ;

        // update position of the steps in the 3D word.
        this.updateStepsPosition(delta, currentAudioTimeCorrected) ;

        // Update animation of the steps (texture animation)
        this.updateStepsAnimation(delta) ;

        // Update the shader animation for the receptor
        this.updateReceptorAnimation(currentAudioTime) ;

        //update explosion animations
        this.updateExplosionAnimations(delta) ;



    }

    updateStepsPosition(delta, currentAudioTime) {

        // const audiotime = this.song.getCurrentAudioTime(this.level) ;
        if ( currentAudioTime < 0 ) {
            this.updateStepsPositionAudioClockSync(currentAudioTime);
        } else {
            this.updateStepsPositionDelta(delta) ;
        }

        this.updateActiveHoldsPosition(delta) ;

    }

    updateActiveHoldsPosition(delta) {


        let listActiveHolds = this.stepQueue.activeHolds.asList() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            let distanceToOrigin = Math.abs (step.position.y) - this.steps.position.y ;

            // check if hold is pressed.
            if ( this.keyListener.isPressed(step.kind) ) {

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
                    // distanceStepNoteEndNote = distanceStepNoteEndNote > 0.65 ? distanceStepNoteEndNote : 0.65 ;
                    let difference = holdEndNote.scale.y - distanceStepNoteEndNote ;
                    holdEndNote.scale.y = distanceStepNoteEndNote ;
                    holdEndNote.position.y -= difference*0.5 ;

                    // update also texture to keep aspect ratio
                    holdEndNote.material.map.repeat.set(1/6, (1/3)*distanceStepNoteEndNote ) ;

                }

            }



        }

    }

    updateStepsPositionDelta(delta) {
        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        const yDisplacement = beatsPerSecond * delta ;
        //
        this.steps.position.y += yDisplacement* this.speed ;

    }

    updateStepsPositionAudioClockSync(currentAudioTime) {

        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        // const audioTime = this.song.getCurrentAudioTime(this.level) ;
        const yDisplacement = beatsPerSecond * currentAudioTime ;

        this.steps.position.y = yDisplacement* this.speed ;
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
                explosion.material.map.offset.set(explosion.animationPosition * (1 / 5), 0);
                explosion.lastStepTimeStamp = 0;
            } else {
                explosion.lastStepTimeStamp += delta;
            }
        }
    }

    updateExplosionAnimations(delta){
        this.updateExplosionAnimation(this.dlExplosion,delta) ;
        this.updateExplosionAnimation(this.ulExplosion,delta) ;
        this.updateExplosionAnimation(this.cExplosion,delta) ;
        this.updateExplosionAnimation(this.urExplosion,delta) ;
        this.updateExplosionAnimation(this.drExplosion,delta) ;
    }


    animateTap(kind) {

        let tap = null ;

        switch (kind) {
            case 'dl':
                tap = this.dlTap ;
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

    animateJudgement(grade) {
        // remove scheduled tweens
        if ( this.judgment.scaleFadeTween !== null ) {

            TWEEN.remove(this.judgment.scaleFadeTween) ;
            TWEEN.remove(this.judgment.opacityFadeTween) ;


        }

        // update combo count
        this.comboCount += 1 ;



        this.judgmentFactory.updateNormalDigits(this.comboCount) ;
        this.judgmentFactory.updateJudgementTexture(grade) ;


        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (5/60)*1000     ;

        // schedule going out tweens for JUDGMENT
        this.judgment.material.opacity = 1.0 ;
        this.judgment.scale.set(0.6,0.6) ;
        this.judgment.scaleFadeTween = new TWEEN.Tween( this.judgment.scale ).to( { x: 1.5 , y: 0.0 }, diffuseAnimation ).delay(diffuseTimeWait).start();
        this.judgment.opacityFadeTween = new TWEEN.Tween( this.judgment.material ).to( {opacity: 0.0 } , diffuseAnimation ).delay(diffuseTimeWait).start();



        this.judgment.scale.set(0.90,0.90) ;
        this.judgment.material.opacity = 1.0 ;
        this.judgment.position.y = this.judgmentYPosition +  this.judgment.scale.y / 6;


        new TWEEN.Tween(this.judgment.scale).to({x: 0.6, y: 0.6}, time).start();
        new TWEEN.Tween(this.judgment.position).to({y: this.judgmentYPosition}, time).start();


        // only if combo is > 3
        if ( this.comboCount > 3 ) {

            if ( this.combo.tweenOpacityEffect !== null ) {
                TWEEN.remove(this.combo.scaleFadeTween) ;
                TWEEN.remove(this.combo.opacityFadeTween) ;

                for ( let digit of this.judgmentFactory.normalDigits) {
                    TWEEN.remove(digit.opacityFadeTween);
                }
            }

            // similarly we update the tweens for the combo label
            this.combo.material.opacity = 1.0;
            this.combo.scale.set(0.37, 0.37);
            this.combo.scaleFadeTween = new TWEEN.Tween(this.combo.scale).to({
                x: 0.97,
                y: 0.0
            }, diffuseAnimation).delay(diffuseTimeWait).start();
            this.combo.opacityFadeTween = new TWEEN.Tween(this.combo.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();

            this.combo.scale.set(0.57, 0.57);
            this.combo.material.opacity = 1.0;
            this.combo.position.y = this.comboYPosition - this.combo.scale.y / 6;


            new TWEEN.Tween(this.combo.scale).to({x: 0.37, y: 0.37}, time).start();
            new TWEEN.Tween(this.combo.position).to({y: this.comboYPosition}, time).start();


            // And lastly, for the digits
            for (let digit of this.judgmentFactory.normalDigits) {
                // console.log(digit);
                digit.material.opacity = 1.0;


            }

            // we need to do this for each digit.
            for (let digit of this.judgmentFactory.normalDigits) {
                digit.opacityFadeTween = new TWEEN.Tween(digit.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();
            }

            // combo

            this.normalDigits.position.y = this.digitsYPosition - 0.25;
            new TWEEN.Tween(this.normalDigits.position).to({y: this.digitsYPosition}, time).start();

        }


    }

    animateTapEffect(arrayOfArrows) {

        for ( var i = 0 ; i < arrayOfArrows.length ; ++i  ) {
            let tapEffect = null ;
            let explosion = null ;
            switch (arrayOfArrows[i].kind) {
                case 'dl':
                    tapEffect = this.dlEffect ;
                    explosion = this.dlExplosion ;
                    break ;
                case 'ul':
                    tapEffect = this.ulEffect ;
                    explosion = this.ulExplosion ;
                    break ;
                case 'c':
                    tapEffect = this.cEffect ;
                    explosion = this.cExplosion ;
                    break ;
                case 'ur':
                    tapEffect = this.urEffect ;
                    explosion = this.urExplosion ;
                    break ;
                case 'dr':
                    tapEffect = this.drEffect ;
                    explosion = this.drExplosion ;
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




    arrowPressed(kind) {

        let currentAudioTime = this.song.getCurrentAudioTime(this.level) - this.keyBoardOffset;

        this.stepQueue.stepPressed(kind,currentAudioTime) ;

        this.animateTap(kind) ;

    }

    arrowReleased(kind) {

        this.stepQueue.stepReleased(kind) ;

    }

    removeObjectFromSteps(object) {
        this.steps.remove(object) ;
    }





}