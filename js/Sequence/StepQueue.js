"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class StepQueue {


    constructor() {

        this.stepQueue = [] ;


    }


    addNewEntryWithTimeStampInfo( timeStamp ) {

        let stepInfo = new StepInfo([], timeStamp);
        this.stepQueue.push(stepInfo) ;

    }

    cleanUpStepQueue() {

        this.stepQueue = this.stepQueue.filter(function (el) {
            return el.stepList.length > 0 ;
        });

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

    getStepFromTopMostStepInfo (index) {
        return this.stepQueue[0].stepList[index] ;
    }

    getTopMostStepListLength() {
        return this.stepQueue[0].stepList.length ;
    }


}