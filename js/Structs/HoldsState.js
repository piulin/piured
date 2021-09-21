"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

// Data structure that supports the StepQueue functionality
// It holds at a given time, the current holds and their state.
class HoldsState {

    // call with Object.keys(a)
    constructor(padIds) {

        //We need one holds instance for each pad.
        this.holdsDict = {} ;
        this.holds = []
        for (let id of padIds) {
            let h = new Holds(id) ;
            this.holds.push(h) ;
            this.holdsDict[id] = h ;
        }

        // All these values are directly updated by the StepQueue

        // This stores the amount of time that a hold has been run (pressed or not).
        // It is used to calculate the remainder steps to add to the judgment.
        this.cumulatedHoldTime = 0.0 ;

        // This flag states whether a judgment is needed after the hold has reached the end
        this.needFinishJudgment = false;

        // it holds the elapsed time between the first and last hold in the hold run (sequence).
        this.judgmentTimeStampEndReference = 0.0 ;

        // It keeps the time elapsed between frames in order to judge a hold.
        this.timeCounterJudgmentHolds = 0.0 ;

        // It states whether the hold was pressed until the end.
        this.wasLastKnowHoldPressed = true ;

        //
        this.beginningHoldChunk = false ;

        // Keeps track of the last Hold added
        this.lastAddedHold = null ;

        // States if we are currently in a hold run
        this.holdRun = false ;

        // Keeps the first hold Object3D of the hold run
        this.firstHoldInHoldRun = null ;

    }

    setHold (kind, padId, value) {
        // console.log(padId);
        this.holdsDict[padId].setHold(kind,value) ;
    }

    getHold (kind, padId) {
        return this.holdsDict[padId].getHold(kind) ;
    }


    asList() {
        let list = [] ;
        for (var hold of this.holds) {
            list = list.concat(hold.asList()) ;
        }
        return list ;
    }

}