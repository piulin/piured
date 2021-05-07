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

        this.stepQueue = new StepQueue() ;

        this.activeHolds = new Holds() ;

        this.checkForNewHolds = true ;


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


        this.activeHolds = new Holds() ;

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
                this.activeHolds.setHold(kind, step) ;
            }

        }

        // Process hold and endNote
        if ( note === '3' ) {

            let step = this.activeHolds.getHold(kind) ;
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
        this.updateStepQueueAndActiveHolds(currentAudioTime) ;

        // update position of the steps in the 3D word.
        this.updateStepsPosition(delta, currentAudioTime) ;

        // Update animation of the steps (texture animation)
        this.updateStepsAnimation(delta) ;

        // Update the shader animation for the receptor
        this.updateReceptorAnimation(currentAudioTime) ;



    }

    updateStepQueueAndActiveHolds(currentAudioTime) {

        //this.stepQueue.getLength() ;
        if ( this.stepQueue.getLength() > 0 ) {

            this.removeHoldsIfProceeds(currentAudioTime) ;

            let stepTime = this.stepQueue.getStepTimeStampFromTopMostStepInfo() ;

            const difference = (stepTime) - currentAudioTime - this.keyBoardOffset;
            // We have a miss :(

            // console.log(difference) ;

            if ( difference < this.accuracyMargin && this.checkForNewHolds ) {
                this.checkForNewHolds = false ;
                this.addHolds() ;
            }

            if (difference < -this.accuracyMargin) {

                console.log('remove first element');
                this.stepQueue.removeFirstElement() ;
                this.checkForNewHolds = true ;

            }

        }


    }

    // remove holds that reached the end.
    removeHoldsIfProceeds(currentAudioTime) {

        let listActiveHolds = this.activeHolds.asList() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if (step !== null && currentAudioTime > step.endHoldTimeStamp ) {
                this.activeHolds.setHold(step.kind, null) ;
                // listActiveHolds[i] = null ;
                // console.log('removed:' + listActiveHolds[i]) ;
            }

        }
    }

    // update currentHolds using the topmost element of the stepQueue
    addHolds() {

        // add new holds

        const length =  this.stepQueue.getTopMostStepListLength() ;
        // console.log(this.stepQueue.stepQueue[0]);
        for ( var i = 0 ; i < length ; ++i ) {
            let note = this.stepQueue.getStepFromTopMostStepInfo(i) ;
            if ( note.isHold ) {
                this.activeHolds.setHold(note.kind, note);
                // console.log('hold added:' + note.held) ;
            }
        }

        console.log(this.activeHolds) ;

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


        let listActiveHolds = this.activeHolds.asList() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            let distanceToOrigin = Math.abs (step.position.y) - this.steps.position.y ;

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


        // keep track if there is an upcoming hold
        this.updateHeldStepsStatus(kind, true) ;

        // [0] is the stepTime.
        let stepTime = this.stepQueue.getStepTimeStampFromTopMostStepInfo() ;

        // check if we stepped when we had to ( we are within the margins )

        const difference =  Math.abs((stepTime) - currentAudioTime) - this.keyBoardOffset ;
        // console.log('Difference: ' + difference)

        // good! a step has been pressed on time!
        if ( difference < this.accuracyMargin ) {


            const length =  this.stepQueue.getTopMostStepListLength() ;
            for ( var i = 0 ; i < length ; ++i ) {

                let note = this.stepQueue.getStepFromTopMostStepInfo(i) ;
                if ( note.kind === kind ) {
                    note.pressed = true ;
                    break ;
                }

            }

            // If all steps have been pressed, then we can remove them from the steps to be rendered
            if ( this.areStepsInNoteListPressed () ) {

                this.removeNotesFromStepObject() ;

                // remove front
                this.stepQueue.removeFirstElement() ;
            }

        }

    }

    arrowReleased(kind) {

        this.updateHeldStepsStatus(kind, false) ;

    }

    // true: step is held, false: otherwise
    updateHeldStepsStatus(kind, status) {
        this.updateHeldStepsStatusInStepQueue( kind, status ) ;
        this.updateHeldStepsStatusInActiveHolds( kind, status ) ;
    }

    updateHeldStepsStatusInActiveHolds(kind,status) {

        let step = this.activeHolds.getHold(kind);
        if (step !== null ) {
           step.held = status
        }

    }

    updateHeldStepsStatusInStepQueue(kind, status) {
        const length =  this.stepQueue.getTopMostStepListLength() ;
        for ( var i = 0 ; i < length ; ++i ) {

            let note = this.stepQueue.getStepFromTopMostStepInfo(i) ;
            if ( note.isHold && note.kind === kind ) {
                // console.log('updated note : ' + note.kind) ;
                note.held = status ;
                // console.log(note.held) ;
                break ;
            }

        }
    }


    // Returns true if all the steps have been pressed
    areStepsInNoteListPressed() {
        const length =  this.stepQueue.getTopMostStepListLength() ;
        for ( var i = 0 ; i < length ; ++i ) {

            let note = this.stepQueue.getStepFromTopMostStepInfo(i) ;
            if ( note.pressed === false ) {
                if ( note.isHold && note.held ) {
                    continue ;
                }
                return false ;
            }
        }
        return true ;
    }

    // remove all steps in the noteList from the steps Object, so they are not rendered anymore
    removeNotesFromStepObject() {
        const length =  this.stepQueue.getTopMostStepListLength() ;
        for ( var i = 0 ; i < length ; ++i ) {
            let note = this.stepQueue.getStepFromTopMostStepInfo(i) ;

            // remove the step if it's not a hold, obviously.
            if ( note.isHold === false ) {
                this.steps.remove(note) ;


            // add it to the active holds early
            } else {
                this.activeHolds.setHold(note.kind, note) ;
            }


        }

    }





}