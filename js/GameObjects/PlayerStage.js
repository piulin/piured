"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class PlayerStage extends GameObject {

    _song ;
    _level ;
    _stage ;
    _steps ;
    _receptors ;
    _lifeBar ;

    _userSpeed ;

    _object ;

    _speedTween ;

    constructor(resourceManager, song, keyListener, level, userSpeed, idLeftPad, idRightPad) {
        super(resourceManager);

        this.idLeftPad = idLeftPad ;
        this.idRightPad = idRightPad ;
        this._song = song ;
        this._level = level ;
        this._userSpeed = userSpeed ;

        this._object = new THREE.Object3D() ;

        this.keyListener = keyListener ;

        this.keyboardLag = 0.07;


        this.beatManager = new BeatManager(this._resourceManager,
            this._song,
            this._level,
            this._userSpeed,
            this.keyboardLag) ;

        engine.addToUpdateList(this.beatManager) ;

    }


    configureStepConstantsPositions () {
        // Depth of stage elements
        this.receptorZDepth = -0.00003 ;
        this.holdZDepth = -0.00002 ;
        this.holdEndNoteZDepth = -0.00001 ;
        this.stepNoteZDepth = 0.00001;


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

        this.stepTextureAnimationRate = 30 ;

    }


    ready() {


        this.lastEffectSpeed = 1;
        this.effectSpeed = 1;
        this.newTargetSpeed = 1 ;



        this.accuracyMargin = 0.15 ;

        this.configureStepConstantsPositions() ;

        // TODO
        // This is to be used more than once in case of a double level
        this.stepQueue = new StepQueue(this._resourceManager, this, this.beatManager, this.keyListener, this.accuracyMargin) ;
        engine.addToUpdateList(this.stepQueue) ;
        engine.addToInputList(this.stepQueue) ;







        // this.bpms = this.song.levels[level].meta['BPMS'] ;


        this._stage = new THREE.Object3D();
        this._steps = new THREE.Object3D();
        this._receptors = new THREE.Object3D();

        this.padSteps = { } ;
        this.padReceptors = { } ;

        var Lsteps, Lreceptor ;
        if ( this._song.getLevelStyle(this._level) === 'pump-single' || this._song.getLevelStyle(this._level) === 'pump-double'  ) {
            [Lsteps, Lreceptor] =
                this.composePad(0, this.idLeftPad);
        } else if ( this._song.getLevelStyle(this._level) === 'pump-halfdouble' ) {
            [Lsteps, Lreceptor] =
                this.composePad(-2, this.idLeftPad);
        }

        this.padSteps[this.idLeftPad] = Lsteps ;
        this.padReceptors[this.idLeftPad] = Lreceptor ;

        this._steps.add(Lsteps) ;
        this._receptors.add(Lreceptor.object) ;



        // only if the level is double
        if ( this._song.getLevelStyle(this._level) !== 'pump-single' ) {

            Lsteps.position.x = -this.receptorsApart ;
            Lreceptor.object.position.x = -this.receptorsApart;


            var Rsteps, Rreceptor ;

            if ( this._song.getLevelStyle(this._level) === 'pump-double' ) {
                [Rsteps, Rreceptor] =
                    this.composePad(5, this.idRightPad);
            } else if ( this._song.getLevelStyle(this._level) === 'pump-halfdouble' ) {
                [Rsteps, Rreceptor] =
                    this.composePad(3, this.idRightPad);
            }


            this.padSteps[this.idRightPad] = Rsteps ;
            this.padReceptors[this.idRightPad] = Rreceptor ;


            Rsteps.position.x = this.receptorsApart ;
            Rreceptor.object.position.x = this.receptorsApart;

            this._steps.add(Rsteps) ;
            this._receptors.add(Rreceptor.object) ;

            // lifebar
            this._lifeBar = new LifeBar(this._resourceManager, this.beatManager, 'double' ) ;
        } else {
            // lifebar
            this._lifeBar = new LifeBar(this._resourceManager, this.beatManager, 'single' ) ;

        }

        this._lifeBar.object.position.y = 0.7 ;
        this._object.add(this._lifeBar.object) ;

        this.judgment = new JudgmentScale(this._resourceManager, this.accuracyMargin, this._lifeBar ) ;
        this.judgment.object.position.y = -2.5 ;
        engine.addToUpdateList(this.judgment) ;
        this._object.add(this.judgment.object) ;

        this._object.add(this._steps) ;
        this._object.add(this._receptors) ;

        this.stepQueue.cleanUpStepQueue() ;


    }

    composePad(stepDataOffset, padId) {


        // object containing all the steps of the given Pad.
        let steps = new THREE.Object3D();

        const noteData = this._song.levels[this._level] ;


        let listIndex = 0 ;
        // i loops the bars
        for (var i = 0 ; i < noteData.measures.length ; i++ ) {

            const measure = noteData.measures[i] ;

            const notesInBar = measure.length ;

            // j loops the notes inside the bar
            for ( var j = 0 ; j < measure.length ; j++ ) {

                listIndex += 1 ;
                const note = measure[j] ;

                const [currentYPosition, currentTimeInSong] = this.beatManager.getYShiftAndCurrentTimeInSongAtBeat(i,j,notesInBar) ;

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
                    listIndex - 1 ,
                    padId) ;


                //ul
                this.processNote(
                    note[1+stepDataOffset],
                    'ul',
                    currentYPosition,
                    this.ulXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId) ;

                // c
                this.processNote(
                    note[2+stepDataOffset],
                    'c',
                    currentYPosition,
                    this.cXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId) ;

                // ur
                this.processNote(
                    note[3+stepDataOffset],
                    'ur',
                    currentYPosition,
                    this.urXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId) ;

                // dr
                this.processNote(
                    note[4+stepDataOffset],
                    'dr',
                    currentYPosition,
                    this.drXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId) ;

            }

        }


        let receptor = new Receptor(this._resourceManager, this.beatManager, this.keyListener, padId, this.stepTextureAnimationRate ) ;
        engine.addToUpdateList(receptor) ;
        engine.addToInputList(receptor) ;
        receptor.object.position.z = this.receptorZDepth;

        return [ steps, receptor ] ;

    }

    processNote(note, kind, currentYPosition, XStepPosition , steps, currentTimeInSong, index,  padId ) {


        // Process StepNote
        if ( note === '1' || note === '2' ) {

            // let step = this.stepFactory.getStep(kind);
            let step = new StepNote( this._resourceManager, kind, padId, currentTimeInSong ) ;

            let stepMesh = step.object ;

            stepMesh.position.y = currentYPosition ;
            stepMesh.originalYPos = currentYPosition ;
            stepMesh.position.x = XStepPosition ;
            stepMesh.position.z = this.stepNoteZDepth ;


            // [1] add step to the stepList

            if (note === '2') {

                let stepHold = new StepHold(this._resourceManager, step, kind ) ;
                this.stepQueue.addStepToStepList(stepHold, index) ;
                this.stepQueue.setHold(kind, padId, stepHold) ;

            } else {

                this.stepQueue.addStepToStepList(step, index) ;
                steps.add(stepMesh) ;
                engine.addToUpdateList(step) ;

            }


        }

        // Process StepHold
        if ( note === '3' ) {

            let holdObject = this.stepQueue.getHold( kind , padId ) ;

            // let beginningHoldYPosition = step.beginningHoldYPosition ;
            let endNoteObject = new EndNote(this._resourceManager, kind, this.stepTextureAnimationRate) ;
            let endNoteMesh = endNoteObject.object ;
            engine.addToUpdateList( endNoteObject ) ;

            endNoteMesh.position.y = currentYPosition ;
            endNoteMesh.originalYPos = currentYPosition ;
            endNoteMesh.position.x = XStepPosition ;
            endNoteMesh.position.z = this.holdEndNoteZDepth ;

            let holdExtensibleObject = new HoldExtensible(this._resourceManager, kind ) ;
            holdExtensibleObject.object.position.x = XStepPosition ;
            holdExtensibleObject.object.originalYPos = -10000 ;
            holdExtensibleObject.object.position.z = this.holdZDepth ;
            engine.addToUpdateList( holdExtensibleObject ) ;

            // let holdObject = new StepHold(this._resourceManager, stepObject, holdExtensibleObject, endNoteObject, kind, currentTimeInSong) ;

            holdObject.endNote = endNoteObject ;
            holdObject.holdExtensible = holdExtensibleObject ;
            holdObject.endTimeStamp = currentTimeInSong ;

            engine.addToUpdateList( holdObject ) ;

            // steps.add(stepObject.object) ;
            steps.add(holdObject.object) ;

        }

    }

    update(delta) {

        this._steps.position.y = this.beatManager.currentYDisplacement * this._userSpeed * this.effectSpeed ;

        this.updateCurrentSpeed(this.beatManager.currentBeat) ;

        this.animateSpeedChange() ;

        this.updateActiveHoldsPosition() ;

    }

    updateCurrentSpeed(beat) {
        // a type 0: means that the speed change is expressed in beats, otherwise in seconds
        const [speed, measure, type] = this._song.getSpeedAndTimeAtBeat(this._level, beat) ;
        if (this.newTargetSpeed  !== speed ) {

            // console.log('speed change: ' + speed+  ' in secs: ' + measure) ;

            // console.log('hola') ;
            this.newTargetSpeed = speed;
            let time = measure * 1000;
            if (type === 0) {
                time = (60 / this.beatManager.currentBPM) * measure * 1000;
            }
            // so it's not 0
            const eps = 1.0 ;


            // if (time === 0.0) {
            //     this.effectSpeed = speed;
            //     TWEEN.remove(this._speedTween) ;
            // } else {
                this._speedTween = new TWEEN.Tween(this).to({effectSpeed: speed}, time + eps).start();
            // }
        }
    }

    animateSpeedChange() {

        if (this.lastEffectSpeed !== this.effectSpeed ) {
            // console.log(this.effectSpeed);

            let lastEffectSpeed = this.lastEffectSpeed ;
            let effectSpeed = this.effectSpeed ;
            // let updateEndNoteFunction = this.updateEndNoteProportion.bind(this) ;


            // Update stepNotes only
            this._steps.traverse(function(child) {

                // steps, holds, and endNotes are meshes
                if (child instanceof THREE.Mesh) {
                    // const curr_position = child.position.y ;
                    // back to the original speed
                    // console.log(child.originalYPos) ;
                    child.position.y = child.originalYPos ;
                    // apply new speed
                    child.position.y *= effectSpeed ;

                    // console.log('new speed: ' + effectSpeed +  ', last speed: ' + lastEffectSpeed + ' curr position: ' + curr_position + ' new position: ' + child.position.y) ;

                }}) ;

            this.lastEffectSpeed = this.effectSpeed ;
        }
    }

    updateActiveHoldsPosition() {


        let listActiveHolds = this.stepQueue.activeHolds.asList() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            // check if hold is pressed.
            if ( this.keyListener.isHeld(step.kind, step.padId) ) {

                this.updateHoldPosition(step) ;

            }

        }

    }

    // This function shrinks the endNote so it does look proportioned
    updateHoldPosition(hold) {

        let distanceToOrigin = Math.abs (hold.stepNote.object.position.y) - this._steps.position.y ;

        // update step note position
        hold.stepNote.object.position.y += distanceToOrigin ;


    }


    get object() {
        return this._object ;
    }

    removeStep(step) {

        this.padSteps[step.padId].remove(step.object) ;
    }


    animateReceptorFX(stepList) {
        for (var step of stepList) {
            this.padReceptors[step.padId].animateExplosionStep(step) ;
            // this.padReceptors[step.padId].animateExplosionStep(step) ;
        }
    }



}