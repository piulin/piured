"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class KeyInput {


    constructor(composer) {



        this.composer = composer ;

        this.pads = [] ;
        this.padsDic = {} ;


        window.onkeydown = this.onKeyDown.bind(this) ;
        window.onkeyup = this.onKeyUp.bind(this) ;


    }

    getPadIds() {
        return Object.keys(this.padsDic) ;
    }

    addPad(keyMap, padId) {
        const pad = new Pad(keyMap, padId) ;
        this.pads.push( pad ) ;
        this.padsDic[padId] = pad ;
    }

    onKeyDown( event ) {

        const key = event.which ;

        for ( let pad of this.pads ) {
            if ( event.which === pad.dlKey && !pad.dlKeyHold ) {
                pad.dlKeyHold = true ;
                // console.log('dl down: ' +event.which) ;
                this.composer.arrowPressed('dl', pad.padId) ;
            }
            else if ( event.which === pad.ulKey && !pad.ulKeyHold ) {
                pad.ulKeyHold = true ;
                // console.log('ul down : ' +event.which)
                this.composer.arrowPressed('ul',pad.padId) ;
            }
            else if ( event.which === pad.cKey && !pad.cKeyHold ) {
                pad.cKeyHold = true ;
                // console.log('c down: ' +event.which)
                this.composer.arrowPressed('c', pad.padId) ;
            }
            else if ( event.which === pad.urKey && !pad.urKeyHold ) {
                pad.urKeyHold = true ;
                // console.log('ur down: ' +event.which)
                this.composer.arrowPressed('ur', pad.padId) ;
            }
            else if ( event.which === pad.drKey && !pad.drKeyHold ) {
                pad.drKeyHold = true ;
                // console.log('dr down: ' +event.which)
                this.composer.arrowPressed('dr',pad.padId) ;
            }
        }




    }

    onKeyUp(event) {

        for ( let pad of this.pads ) {
            if ( event.which === pad.dlKey ) {
                pad.dlKeyHold = false ;
                // console.log('dl up: ' + event.which);
                this.composer.arrowReleased('dl',pad.padId) ;
            }
            else if ( event.which === pad.ulKey ) {
                pad.ulKeyHold = false ;
                // console.log('ul up: ' + event.which);
                this.composer.arrowReleased('ul',pad.padId) ;
            }
            else if ( event.which === pad.cKey ) {
                pad.cKeyHold = false ;
                // console.log('c up: ' + event.which);
                this.composer.arrowReleased('c',pad.padId) ;
            }
            else if ( event.which === pad.urKey ) {
                pad.urKeyHold = false ;
                // console.log('ur up: ' + event.which);
                this.composer.arrowReleased('ur',pad.padId) ;
            }
            else if ( event.which === pad.drKey ) {
                pad.drKeyHold = false ;
                // console.log('dr up: ' + event.which);
                this.composer.arrowReleased('dr',pad.padId) ;
            }
        }

    }

    isPressed( kind, padId ) {
        return this.padsDic[padId].isPressed(kind) ;
    }

}