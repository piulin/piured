'use strict' ;

class StepHold extends GameObject {

    _stepNote ;
    _endNote ;
    _holdExtensible ;
    _kind ;
    _padId ;

    _object ;

    _lastGapLength ;
    _timeStamp ;

    constructor(resourceManager, stepNote, kind) {
        super(resourceManager);

        this._kind = kind ;
        this._stepNote = stepNote ;

        this._lastGapLength = 0 ;

        this._object = new THREE.Object3D() ;
        this._object.add(this._stepNote.object) ;

    }

    get pressed() {
        return this._stepNote.pressed;
    }


    set pressed(value) {
        this._stepNote.pressed = value;
    }


    set holdExtensible(value) {
        this._holdExtensible = value;
        this._object.add(value.object) ;
    }


    set endTimeStamp(value) {
        this._timeStamp = value;
    }

    set endNote(value) {
        this._endNote = value;
        this._object.add(value.object) ;
    }

    get endTimeStamp() {
        return this._timeStamp ;
    }

    get beginTimeStamp() {
        return this._stepNote.timeStamp ;
    }

    get kind(){
        return this._stepNote.kind ;
    }

    get padId(){
        return this._stepNote.padId ;
    }

    get stepNote() {
        return this._stepNote ;
    }

    get endNote() {
        return this._endNote ;
    }

    ready() {

        this._lastGapLength = this.gapLength() ;
        this.updateHoldExtensiblePosition(this._lastGapLength) ;
        if ( this._lastGapLength < 1 ) {
            this.updateHoldExtensiblePosition(this._lastGapLength) ;
        }

    }

    update(delta) {

        const gapLength = this.gapLength() ;

        if ( gapLength !== this._lastGapLength ) {
            this._lastGapLength = gapLength ;
            this.updateHoldExtensiblePosition(gapLength) ;

            // console.log(gapLength) ;

            if ( gapLength < 1 ) {
                this.updateHoldEndNoteProportion(gapLength) ;
            }
        }

    }

    get object () {
        return this._object ;
    }

    gapLength() {
        const beginningHoldYPosition = this._stepNote.object.position.y ;
        const endHoldYPosition = this._endNote.object.position.y ;

        return beginningHoldYPosition - endHoldYPosition ;
    }



    updateHoldExtensiblePosition(gapLength) {
        const beginningHoldYPosition = this._stepNote.object.position.y ;
        const endHoldYPosition = this._endNote.object.position.y ;



        this._holdExtensible.object.scale.y = gapLength ;
        // -0.5 to shift it to the center
        this._holdExtensible.object.position.y = beginningHoldYPosition - gapLength*0.5 ;


    }

    updateHoldEndNoteProportion(gapLength) {

        let holdEndNote = this._endNote ;
        // End note problem: we have to shrink it when it overlaps with the step Note.
        // holdScale is the distance between the step note and the end hold note.

        // Option with no shaders.


        // shift to the middle of the step.
        const distanceStepNoteEndNote = gapLength + 0.5 ;

        let difference = holdEndNote.object.scale.y - distanceStepNoteEndNote ;
        holdEndNote.object.scale.y = distanceStepNoteEndNote ;
        holdEndNote.object.position.y -= difference*0.5 ;

        // update also texture to keep aspect ratio
        holdEndNote.object.material.map.repeat.set(1/6, (1/3)*distanceStepNoteEndNote ) ;


    }



}