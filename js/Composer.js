"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Composer {



    constructor ( song, noteskinPath, speed = 1 ) {


        this.receptorFactory = new ReceptorFactory(noteskinPath);
        this.stepFactory = new StepFactory(noteskinPath);

        this.song = song;
        this.speed = speed ;

        this.stepAnimationRate = 25 ;


    }

    // Returns 3DObject containing the steps of the level.
    run (level) {

        this.forceSync = true;
        // Save the level.
        this.level = level ;

        this.bpms = this.song.levels[level].meta['BPMS'] ;

        this.receptorZDepth = -0.0001 ;
        this.holdZDepth = -0.00001 ;

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

        // i loops the bars


        let beginningDownRightHoldYPosition = 2 ;
        let beginningUpRightHoldYPosition = 2 ;
        let beginningCenterHoldYPosition = 2 ;
        let beginningUpLeftHoldYPosition = 2 ;
        let beginningDownLeftHoldYPosition = 2 ;


        for (var i = 0 ; i < noteData.measures.length ; i++ ) {
            const measure = noteData.measures[i] ;

            const notesInBar = measure.length ;

            // j loops the notes inside the bar
            for ( var j = 0 ; j < measure.length ; j++ ) {
                const note = measure[j] ;

                // TODO: check what happens with tuplet (e.g. triplets) lol
                const currentYPosition = - (4*i + 4*j/notesInBar) * this.speed ;

                // dl
                beginningDownLeftHoldYPosition = this.processNote(
                    note[0],
                    'dl',
                    currentYPosition,
                    -2*(stepShift - stepOverlap),
                    beginningDownLeftHoldYPosition,
                    steps) ;


                //ul
                beginningUpLeftHoldYPosition = this.processNote(
                    note[1],
                    'ul',
                    currentYPosition,
                    -(stepShift - stepOverlap),
                    beginningUpLeftHoldYPosition,
                    steps) ;

                // c
                beginningCenterHoldYPosition = this.processNote(
                    note[2],
                    'c',
                    currentYPosition,
                    0,
                    beginningCenterHoldYPosition,
                    steps) ;

                // ur
                beginningUpRightHoldYPosition = this.processNote(
                    note[3],
                    'ur',
                    currentYPosition,
                    (stepShift - stepOverlap),
                    beginningUpRightHoldYPosition,
                    steps) ;

                // dr
                beginningDownRightHoldYPosition = this.processNote(
                    note[4],
                    'dr',
                    currentYPosition,
                    2*(stepShift - stepOverlap),
                    beginningDownRightHoldYPosition,
                    steps) ;

            }

        }

        // Get receptor
        let receptor = this.receptorFactory.getReceptor();
        receptor.position.z = this.receptorZDepth;
        this.receptor = receptor;


        this.steps = steps ;
        return [steps, receptor];

    }

    processNote(note, kind, currentYPosition, XStepPosition , beginningHoldYPosition, steps ) {

        // Process tapNote
        if ( note === '1' || note === '2' ) {
            let step = this.stepFactory.getStep(kind);
            step.position.y = currentYPosition ;
            step.position.x = XStepPosition ;
            steps.add(step) ;

            if (note === '2') {
                beginningHoldYPosition = currentYPosition ;
            }

        }

        // Process hold and endNote
        if ( note === '3' ) {
            let hold = this.stepFactory.getHold(kind) ;
            let holdScale = beginningHoldYPosition - currentYPosition ;
            hold.position.z = this.holdZDepth ;
            hold.scale.y = holdScale ;
            // -0.5 to shift it to the center
            hold.position.y = beginningHoldYPosition - holdScale*0.5 ;
            hold.position.x = XStepPosition ;
            steps.add(hold) ;


            let endNote = this.stepFactory.getHoldEndNote(kind);
            endNote.position.y = currentYPosition ;
            endNote.position.x = XStepPosition ;
            steps.add(endNote) ;

        }

        // can't be updated by reference
        return beginningHoldYPosition ;
    }


    update(delta) {

        this.updateStepsPosition(delta) ;
        this.updateStepsAnimation(delta) ;
        this.updateReceptorAnimation(delta) ;

    }

    updateStepsPosition(delta) {
        // const bpm = this.song.meta [ 'BPMS']
        // const bpm = 143 ;
        // const beatsPerSecond = bpm / 60 ;
        // const yDisplacement = beatsPerSecond * delta ;
        //
        // this.steps.position.y += yDisplacement* this.speed ;


        const audiotime = this.song.getCurrentAudioTime(this.level) ;
        if ( audiotime < 0 ) {
            this.updateStepsPositionAudioClockSync();
        } else {
            this.updateStepsPositionDelta(delta) ;
        }

        // const bpm = this.bpms[0][1] ;
        // const beatsPerSecond = bpm / 60 ;
        // const audioTime = this.song.getCurrentAudioTime() ;
        // const yDisplacement = beatsPerSecond * audioTime ;
        //
        // this.steps.position.y = yDisplacement* this.speed ;
        //
        // console.log(audioTime);
    }

    isSyncWRTBeggining() {
        const audioTime = this.song.getCurrentAudioTime(this.level) ;
        const offset = this.song.getTotalOffset() ;
        console.log('audioTime: ' + audioTime + ' offset:' + offset) ;
        if (offset === audioTime || this.forceSync ) {
            this.forceSync = true ;
            return false ;
        }
        return true ;
    }

    updateStepsPositionDelta(delta) {
        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        const yDisplacement = beatsPerSecond * delta ;
        //
        this.steps.position.y += yDisplacement* this.speed ;

    }

    updateStepsPositionAudioClockSync() {

        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        const audioTime = this.song.getCurrentAudioTime(this.level) ;
        const yDisplacement = beatsPerSecond * audioTime ;

        this.steps.position.y = yDisplacement* this.speed ;
    }

    updateReceptorAnimation(delta) {


        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;

        const audioTime = this.song.getCurrentAudioTime(this.level) ;

        if ( audioTime < 0 ) {
            this.receptor.material.uniforms.activeColorContribution.value = 0 ;
            return ;
        }

        const timeInBeat = Math.abs(  audioTime % secondsPerBeat  ) ;
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
        let opacityLevel = (1 - normalizedTimeInBeat) ;
        // if (opacityLevel > 0.9 ) {
        //     opacityLevel = 1 ;
        // }

        // f(x) = 1/(1+(x/(1-x))^(- <beta>))
        const beta = 1.5 ;
        const outputOpacityLevel = 1/(1+ Math.pow( (opacityLevel/(1-opacityLevel)), (- beta)) )

        // to dump the energy over time
        // this.activeReceptor.material.opacity = outputOpacityLevel ;
        this.receptor.material.uniforms.activeColorContribution.value = opacityLevel*opacityLevel ;

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



}