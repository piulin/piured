"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class StepInfo {


    constructor(stepList, timeStamp) {

        this._stepList = stepList;
        this._timeStamp = timeStamp;

    }


    get stepList() {
        return this._stepList;
    }

    set stepList(value) {
        this._stepList = value;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    set timeStamp(value) {
        this._timeStamp = value;
    }



}