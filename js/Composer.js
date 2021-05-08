"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Composer {



    constructor ( song, noteskinPath, speed = 1 , keyBoardLag = 0) {

        this.keyBoardOffset = keyBoardLag ;

        this.receptorFactory = new ReceptorFactory(noteskinPath);
        this.stepFactory = new StepFactory(noteskinPath);

        this.song = song;
        this.speed = speed ;

        this.stepAnimationRate = 25 ;

        // Set up the key listener
        this.keyListener = new KeyInput(this) ;

    }


    // Returns 3DObject containing the steps of the level.
    run (level) {

        this.accuracyMargin = 0.15 ;

        this.forceSync = true;
        // Save the level.
        this.level = level ;

        this.bpms = this.song.levels[level].meta['BPMS'] ;

        this.receptorZDepth = -0.00003 ;
        this.holdZDepth = -0.00002 ;
        this.holdEndNoteZDepth = -0.00001 ;
        this.stepNoteZDepth = 0.00001;

        // Keeps
        this.lastStepTimeStamp = 0.0;
        this.animationPosition = 0 ;


        // Space to the right or left of a given step.
        const stepShift = 4/5;
        // Note that the receptor steps are a bit overlapped. This measure takes into
        // acount this overlap.
        const stepOverlap = 0.02 ;

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
                    -2*(stepShift - stepOverlap),
                    steps,
                    currentTimeInSong) ;


                //ul
                this.processNote(
                    note[1],
                    'ul',
                    currentYPosition,
                    -(stepShift - stepOverlap),
                    steps,
                    currentTimeInSong) ;

                // c
                this.processNote(
                    note[2],
                    'c',
                    currentYPosition,
                    0,
                    steps,
                    currentTimeInSong) ;

                // ur
                this.processNote(
                    note[3],
                    'ur',
                    currentYPosition,
                    (stepShift - stepOverlap),
                    steps,
                    currentTimeInSong) ;

                // dr
                this.processNote(
                    note[4],
                    'dr',
                    currentYPosition,
                    2*(stepShift - stepOverlap),
                    steps,
                    currentTimeInSong) ;

            }

        }

        this.stepQueue.cleanUpStepQueue() ;


        // maybe the song starts with a hold.
        // this.addHolds() ;


        console.log(this.stepQueue.stepQueue);
        // Get receptor
        let receptor = this.receptorFactory.getReceptor();
        receptor.position.z = this.receptorZDepth;
        this.receptor = receptor;


        this.steps = steps ;
        return [steps, receptor];

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

        const currentAudioTime = this.song.getCurrentAudioTime(this.level);

        // keep track of the upcoming steps and the active holds.
        this.stepQueue.updateStepQueueAndActiveHolds(currentAudioTime) ;

        // update position of the steps in the 3D word.
        this.updateStepsPosition(delta, currentAudioTime) ;

        // Update animation of the steps (texture animation)
        this.updateStepsAnimation(delta) ;

        // Update the shader animation for the receptor
        this.updateReceptorAnimation(currentAudioTime) ;



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


    arrowPressed(kind) {

        let currentAudioTime = this.song.getCurrentAudioTime(this.level);

        this.stepQueue.stepPressed(kind,currentAudioTime) ;


    }

    arrowReleased(kind) {

        this.stepQueue.stepReleased(kind) ;

    }

    removeObjectFromSteps(object) {
        this.steps.remove(object) ;
    }





}