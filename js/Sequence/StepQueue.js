"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class StepQueue {


    constructor(composer, keyInput, accuracyMargin ) {


        this.keyInput = keyInput ;

        this.composer = composer ;

        this.accuracyMargin = accuracyMargin ;

        this.stepQueue = [] ;

        this.activeHolds = new HoldsState(this.keyInput.getPadIds()) ;

        this.checkForNewHolds = true ;

    }

    // THESE METHODS ARE CALLED WHEN CONSTRUCTING THE SCENE.

    addNewEntryWithTimeStampInfo( timeStamp, index ) {


        let stepInfo = new StepInfo([], timeStamp);
        this.stepQueue.push(stepInfo) ;

    }

    cleanUpStepQueue() {

        this.stepQueue = this.stepQueue.filter(function (el) {
            return el.stepList.length > 0 ;
        });

        this.resetHolds() ;

    }

    addStepToLastStepInfo (step) {

        this.stepQueue[this.stepQueue.length -1].stepList.push(step) ;

    }

    addStepToStepList ( step, index ) {
        this.stepQueue[index].stepList.push(step) ;
    }

    getLength() {
        return this.stepQueue.length ;
    }

    getStepTimeStampFromTopMostStepInfo() {
        return this.stepQueue[0].timeStamp ;
    }

    removeFirstElement() {
        this.stepQueue.shift() ;
    }

    removeElement(index) {
        this.stepQueue.splice(index,1) ;
    }

    getStepFromTopMostStepInfo (index) {
        return this.stepQueue[0].stepList[index] ;
    }

    getTopMostStepListLength() {
        return this.stepQueue[0].stepList.length ;
    }
    getTopMostStepsList() {
        return this.stepQueue[0].stepList ;
    }

    setHold(kind, padId, step) {
        this.activeHolds.beginningHoldChunk = true ;
        this.activeHolds.lastAddedHold = step ;
        this.activeHolds.setHold(kind, padId, step) ;

    }

    getHold( kind, padId ) {
        return this.activeHolds.getHold(kind, padId) ;
    }

    resetHolds() {
        this.activeHolds = new HoldsState(this.keyInput.getPadIds()) ;
    }


    // ----------------------- THESE METHODS ARE CALLED EACH FRAME ---------------------- //


    updateStepQueueAndActiveHolds(currentAudioTime, delta, beat) {

        let validHold = this.findFirstValidHold(currentAudioTime);

        // update hold Run.
        if ( validHold !== null ) {
            if (!this.activeHolds.holdRun) {
                this.activeHolds.holdRun = true ;
                this.activeHolds.firstHoldInHoldRun = validHold ;
            }
        } else {
            this.activeHolds.holdRun = false ;
        }

        // Hold contribution to the combo
        if (validHold !== null) {

            const tickCounts = this.composer.getTickCountAtBeat(beat) ;

            this.judgeHolds(delta, currentAudioTime, tickCounts) ;

            // Note that, to be exact, we have to add the remainder contribution of the hold that was not processed on the last
            // frame
        } else if (this.activeHolds.needFinishJudgment) {
            const tickCounts = this.composer.getTickCountAtBeat(beat) ;
            const difference = this.activeHolds.judgmentTimeStampEndReference - this.activeHolds.cumulatedHoldTime ;
            this.endJudgingHolds(difference, tickCounts) ;
            this.activeHolds.cumulatedHoldTime = 0;
            this.activeHolds.needFinishJudgment = false;
        }

        this.removeHoldsIfProceeds(currentAudioTime) ;

        if ( this.getLength() > 0 ) {

            let stepTime = this.getStepTimeStampFromTopMostStepInfo() ;



            const difference = (stepTime) - currentAudioTime ;
            // this condition is met when we run over a hold. We update here the current list of holds
            if ( difference < 0 && this.checkForNewHolds ) {
                // console.log(onlyHoldsInTopMostStepInfo) ;

                this.checkForNewHolds = false ;

                this.addHolds() ;


                // if we only have holds, and all of them are being pressed beforehand, then it's a perfect!
                if ( this.areThereOnlyHoldsInTopMostStepInfo() && this.areHoldsBeingPressed() ) {
                    this.composer.judgmentScale.animateJudgement('p') ;
                    this.composer.animateTapEffect(this.getTopMostStepsList()) ;
                    this.removeFirstElement() ;
                    this.checkForNewHolds = true ;
                }

            }

            // we count a miss, if we go beyond the time of the topmost step info, given that there are no holds there
            if (difference < -this.accuracyMargin ) {

                this.composer.judgmentScale.miss() ;

                this.removeFirstElement() ;
                this.checkForNewHolds = true ;

            }

        }





    }

    // the boolean end is used to compute the remainder combo left after a set of holds.
    judgeHolds(delta, currentAudioTime, tickCounts) {


        this.activeHolds.cumulatedHoldTime += delta ;


        this.activeHolds.timeCounterJudgmentHolds += delta ;


        const secondsPerBeat = 60 / this.composer.bpms[0][1] ;

        const secondsPerKeyCount = secondsPerBeat/ tickCounts ;

        const numberOfHits = Math.floor(this.activeHolds.timeCounterJudgmentHolds / secondsPerKeyCount ) ;


        // console.log(numberOfPerfects) ;


        if ( numberOfHits > 0 ) {


            let aux = this.activeHolds.timeCounterJudgmentHolds ;
            const remainder = this.activeHolds.timeCounterJudgmentHolds % secondsPerKeyCount;
            this.activeHolds.timeCounterJudgmentHolds = 0 ;


            const difference =  Math.abs((this.activeHolds.lastAddedHold.beginHoldTimeStamp) - currentAudioTime) ;
            // case 1: holds are pressed on time
            if (this.areHoldsBeingPressed()) {

                this.composer.judgmentScale.animateJudgement('p', numberOfHits);
                this.composer.animateTapEffect(this.activeHolds.asList());
            // case 2: holds are not pressed. we need to give some margin to do it
            } else if (this.activeHolds.beginningHoldChunk && difference < this.accuracyMargin ) {

                this.activeHolds.timeCounterJudgmentHolds += aux -remainder ;

                // case 3: holds are not pressed and we run out of the margin
            } else {
                // TODO: misses should not be in the same count.
                this.composer.judgmentScale.miss() ;
                this.activeHolds.beginningHoldChunk = false ;
            }


            this.activeHolds.timeCounterJudgmentHolds += remainder;

        }


    }

    endJudgingHolds(remainingTime, tickCounts) {


            const secondsPerBeat = 60 / this.composer.bpms[0][1] ;
            const secondsPerKeyCount = secondsPerBeat/ tickCounts ;

            const numberOfHits = Math.floor(remainingTime / secondsPerKeyCount ) ;

            // console.log('end numberOfHits: ' + numberOfHits) ;


            if (this.areHoldsBeingPressed() && this.activeHolds.wasLastKnowHoldPressed) {
                this.composer.judgmentScale.animateJudgement('p', numberOfHits);
                this.composer.animateTapEffect(this.activeHolds.asList());
            } else {
                // TODO: misses should not be in the same count.
                this.composer.judgmentScale.miss() ;
            }

            //reset

            this.activeHolds.timeCounterJudgmentHolds = 0 ;



    }

    areThereOnlyHoldsInTopMostStepInfo() {
        let len = this.getTopMostStepListLength() ;
        for ( var i = 0 ; i <  len ; i++) {
            let step = this.getStepFromTopMostStepInfo(i) ;
            if (step.isHold === false) {
                return false ;
            }
        }
        return true ;
    }


    // remove holds that reached the end.
    removeHoldsIfProceeds(currentAudioTime) {

        let listActiveHolds = this.activeHolds.asList() ;


        // This is used to know whether the last judgment for the hold must be fail or not.
        this.activeHolds.wasLastKnowHoldPressed = this.areHoldsBeingPressed() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if (step !== null && currentAudioTime > step.endHoldTimeStamp ) {
                this.activeHolds.setHold(step.kind, step.padId, null) ;

                // save the endHoldTimeStamp to compute the remainder judgments.
                this.activeHolds.needFinishJudgment = true ;
                this.activeHolds.judgmentTimeStampEndReference = step.endHoldTimeStamp - this.activeHolds.firstHoldInHoldRun.beginHoldTimeStamp ;
                // console.log('begin: ' + beginTime + ' end: ' + endTime) ;
                // this.activeHolds.actualTotalComboValueOfHold = this.computeTotalComboContribution( beginTime, endTime ) ;

                // if the hold is active, we can remove it from the render and give a perfect judgment, I think.
                if (this.keyInput.isPressed(step.kind, step.padId)) {

                    this.composer.removeObjectFromSteps(step) ;
                    this.composer.removeObjectFromSteps(step.holdObject) ;
                    this.composer.removeObjectFromSteps(step.endNoteObject) ;

                    this.composer.animateTapEffect([step]) ;

                    this.composer.judgmentScale.animateJudgement('p') ;



                // otherwise we have a miss.
                } else {
                    this.composer.judgmentScale.miss() ;
                }


            }

        }
    }



    // update activeHolds using the topmost element of the stepQueue
    addHolds() {

        // add new holds

        const length =  this.getTopMostStepListLength() ;
        // console.log(this.stepQueue.stepQueue[0]);
        for ( var i = 0 ; i < length ; ++i ) {
            let note = this.getStepFromTopMostStepInfo(i) ;
            if ( note.isHold ) {
                this.setHold(note.kind, note.padId, note);
                // console.log('hold added:' + note.held) ;
            }
        }

        // console.log(this.activeHolds) ;

    }



    // ----------------------- THESE METHODS ARE CALLED WHEN A KEY IS PRESSED ---------------------- //


    stepReleased(kind, padId, currentAudioTime) {

        this.updateHeldStepsStatus( kind, padId, false ) ;

    }

    getFirstStepWithinMargin(currentAudioTime, kind, padId) {

        for ( var i = 0 ; i < this.stepQueue.length ; i++ ) {


            let stepInfo = this.stepQueue[i] ;
            let timeStamp = stepInfo.timeStamp ;

            const difference =  Math.abs((timeStamp) - currentAudioTime) ;

            // console.log(difference) ;

            if ( difference < this.accuracyMargin ) {

                for (var j = 0 ; j < stepInfo.stepList.length ; j++ ) {

                    let step = stepInfo.stepList [j] ;

                    if (step.kind === kind && step.padId === padId) {
                        return [stepInfo, step, i, difference] ;
                    }

                }

            } else {
                return [null, null, null, null] ;
            }

        }
        return [null, null, null, null] ;

    }

    stepPressed(kind, padId, currentAudioTime) {


        // keep track if there is an upcoming hold



        this.updateHeldStepsStatus(kind, padId, true) ;


        let [stepInfo, step, hitIndex, difference] = this.getFirstStepWithinMargin(currentAudioTime, kind, padId) ;

        // console.log(stepInfo) ;

        // with the second condition, we make sure that we don't treat the holds here. Holds, if they are pressed
        // before hand (anytime) count always as perfects.
        if (stepInfo !== null ) {


            step.pressed = true;


            // If all steps have been pressed, then we can remove them from the steps to be rendered
            if (this.areStepsInNoteListPressed(stepInfo.stepList)) {

                const grade = this.composer.judgmentScale.grade(difference) ;

                //
                if ( grade === 'b' || grade === 'go') {
                    if (grade === 'b') {
                        this.composer.judgmentScale.bad() ;
                    } else {
                        this.composer.judgmentScale.good() ;
                    }

                    if ( step.isHold ) {
                        this.setHold(step.kind, step.padId, step) ;
                    }

                } else {

                    this.composer.animateTapEffect(stepInfo.stepList) ;
                    // also animate the holds.
                    this.composer.animateTapEffect(this.activeHolds.asList()) ;

                    this.composer.judgmentScale.animateJudgement(grade) ;

                    // if ( !step.isHold ) {

                    // }

                    this.removeNotesFromStepObject(stepInfo.stepList) ;

                }



                // remove front
                this.removeElement(hitIndex);

                this.checkForNewHolds = true;
            }

            // }
        }


    }


    // true: step is held, false: otherwise
    updateHeldStepsStatus(kind, padId, status) {
        // this.updateHeldStepsStatusInStepQueue( kind, status ) ;
        this.updateHeldStepsStatusInActiveHolds( kind, padId, status ) ;
    }

    updateHeldStepsStatusInActiveHolds(kind, padId, status) {

        let step = this.activeHolds.getHold(kind, padId);
        if (step !== null ) {
            step.held = status
        }

    }

    updateHeldStepsStatusInStepQueue(kind, status) {
        const length =  this.getTopMostStepListLength() ;
        for ( var i = 0 ; i < length ; ++i ) {

            let note = this.getStepFromTopMostStepInfo(i) ;
            if ( note.isHold && note.kind === kind ) {
                // console.log('updated note : ' + note.kind) ;
                note.held = status ;
                // console.log(note.held) ;
                break ;
            }

        }
    }


    // Returns true if all the steps have been pressed
    areStepsInNoteListPressed(noteList) {
        const length =  noteList.length ;
        // const length =  this.getTopMostStepListLength() ;
        for ( var i = 0 ; i < length ; ++i ) {

            let note = noteList[i] ;
            if ( note.pressed === false ) {
                if ( note.isHold && this.keyInput.isPressed(note.kind, note.padId) ) {
                    continue ;
                }
                return false ;
            }
        }

        // Also check if the holds are being pressed.
        return this.areHoldsBeingPressed() ;

    }


    areHoldsBeingPressed() {

        let listActiveHolds = this.activeHolds.asList() ;
        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if (step !== null && this.keyInput.isPressed(step.kind, step.padId) ) {
                continue ;
                // listActiveHolds[i] = null ;
                // console.log('removed:' + listActiveHolds[i]) ;
            } else {
                return false ;
            }

        }
        return true ;

    }

    // this means, holds that are not only in the activeHolds list, but on time to be triggered
    findFirstValidHold (currentAudioTime) {

        let listActiveHolds = this.activeHolds.asList() ;
        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if ( step !== null  && step.beginHoldTimeStamp <= currentAudioTime) {
                return step ;
            }

        }

        return null ;

    }

    // this means, holds that are not only in the activeHolds list, but on time to be triggered
    areThereHolds (currentAudioTime) {

        let listActiveHolds = this.activeHolds.asList() ;
        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if ( step !== null ) {
                return true ;
            }

        }

        return false ;

    }

    // remove all steps in the noteList from the steps Object, so they are not rendered anymore
    removeNotesFromStepObject(noteList) {


        const length =  noteList.length ;
        for ( var i = 0 ; i < length ; ++i ) {
            let note = noteList[i] ;

            // remove the step if it's not a hold, obviously.
            if ( note.isHold === false ) {
                this.composer.removeObjectFromSteps(note) ;

                // add it to the active holds early
            } else {
                this.setHold(note.kind, note.padId, note) ;
            }


        }

    }



}