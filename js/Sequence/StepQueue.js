"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class StepQueue {


    constructor(composer,keyInput, accuracyMargin ) {

        this.keyInput = keyInput ;

        this.composer = composer ;

        this.accuracyMargin = accuracyMargin ;

        this.stepQueue = [] ;

        this.activeHolds = new Holds() ;

        this.checkForNewHolds = true ;


    }


    addNewEntryWithTimeStampInfo( timeStamp ) {

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

    setHold(kind, step) {

        this.activeHolds.setHold(kind, step) ;

    }

    getHold( kind ) {
        return this.activeHolds.getHold(kind) ;
    }

    resetHolds() {
        this.activeHolds = new Holds() ;
    }




    updateStepQueueAndActiveHolds(currentAudioTime) {

        //this.stepQueue.getLength() ;
        if ( this.getLength() > 0 ) {

            this.removeHoldsIfProceeds(currentAudioTime) ;

            let stepTime = this.getStepTimeStampFromTopMostStepInfo() ;

            const difference = (stepTime) - currentAudioTime ;
            // We have a miss :(

            // console.log(difference) ;

            // if ( difference < this.accuracyMargin && this.checkForNewHolds ) {
            if ( difference < 0 && this.checkForNewHolds ) {

                this.checkForNewHolds = false ;
                this.addHolds() ;
            }

            // OK
            if (difference < -this.accuracyMargin) {

                this.composer.judgmentScale.miss() ;
                // console.log('remove first element');
                this.removeFirstElement() ;
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



                // if the hold is active, we can remove it from the render, i think.

                if (this.keyInput.isPressed(step.kind)) {
                    this.composer.removeObjectFromSteps(step) ;
                    this.composer.removeObjectFromSteps(step.holdObject) ;
                    this.composer.removeObjectFromSteps(step.endNoteObject) ;

                    this.composer.animateTapEffect([step]) ;

                    this.composer.animateJudgement('p') ;

                }

                // listActiveHolds[i] = null ;
                // console.log('removed:' + listActiveHolds[i]) ;
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
                this.activeHolds.setHold(note.kind, note);
                // console.log('hold added:' + note.held) ;
            }
        }

        // console.log(this.activeHolds) ;

    }


    stepReleased(kind) {

        this.updateHeldStepsStatus(kind, false) ;

    }

    getFirstStepWithinMargin(currentAudioTime, kind) {

        for ( var i = 0 ; i < this.stepQueue.length ; i++ ) {


            let stepInfo = this.stepQueue[i] ;
            let timeStamp = stepInfo.timeStamp ;

            const difference =  Math.abs((timeStamp) - currentAudioTime) ;

            // console.log(difference) ;

            if ( difference < this.accuracyMargin ) {

                for (var j = 0 ; j < stepInfo.stepList.length ; j++ ) {

                    let step = stepInfo.stepList [j] ;

                    if (step.kind === kind) {
                        return [stepInfo, step, i, difference] ;
                    }

                }

            } else {
                return [null, null, null, null] ;
            }

        }
        return [null, null, null, null] ;

    }

    stepPressed(kind, currentAudioTime) {


        // keep track if there is an upcoming hold



        this.updateHeldStepsStatus(kind, true) ;


        let [stepInfo, step, hitIndex, difference] = this.getFirstStepWithinMargin(currentAudioTime, kind) ;

        // console.log(stepInfo) ;

        if (stepInfo !== null) {


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

                } else {

                    this.composer.animateTapEffect(stepInfo.stepList) ;

                    this.removeNotesFromStepObject(stepInfo.stepList) ;

                }

                this.composer.animateJudgement(grade) ;

                // remove front
                this.removeElement(hitIndex);

                this.checkForNewHolds = true;
            }

            // }
        }


    }


    // true: step is held, false: otherwise
    updateHeldStepsStatus(kind, status) {
        // this.updateHeldStepsStatusInStepQueue( kind, status ) ;
        this.updateHeldStepsStatusInActiveHolds( kind, status ) ;
    }

    updateHeldStepsStatusInActiveHolds(kind,status) {

        let step = this.activeHolds.getHold(kind);
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
                if ( note.isHold && this.keyInput.isPressed(note.kind) ) {
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

            if (step !== null && this.keyInput.isPressed(step.kind) ) {
                continue ;
                // listActiveHolds[i] = null ;
                // console.log('removed:' + listActiveHolds[i]) ;
            } else {
                return false ;
            }

        }
        return true ;

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
                this.activeHolds.setHold(note.kind, note) ;
            }


        }

    }


}