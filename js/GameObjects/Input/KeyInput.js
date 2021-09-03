"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class KeyInput extends GameObject {


    constructor(resourceManager) {

        super(resourceManager) ;

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
                pad.dlKeyPressed = true ;
                // console.log('dl down: ' +event.which) ;
            }
            else if ( event.which === pad.ulKey && !pad.ulKeyHold ) {
                pad.ulKeyHold = true ;
                pad.ulKeyPressed = true ;
                // console.log('ul down : ' +event.which)
            }
            else if ( event.which === pad.cKey && !pad.cKeyHold ) {
                pad.cKeyHold = true ;
                pad.cKeyPressed = true ;
                // console.log('c down: ' +event.which)
            }
            else if ( event.which === pad.urKey && !pad.urKeyHold ) {
                pad.urKeyHold = true ;
                pad.urKeyPressed = true ;
                // console.log('ur down: ' +event.which)
            }
            else if ( event.which === pad.drKey && !pad.drKeyHold ) {
                pad.drKeyHold = true ;
                pad.drKeyPressed = true ;
                // console.log('dr down: ' +event.which)
            }
            else if ( event.which >= 49 && event.which <= 57) {
                // TODO:
                this.composer.setNewSpeed(10-(58-event.which)) ;
            }
            else if ( event.which === 190) {// period
                console.log('.')
                engine.updateOffset(0.01) ;
            } else if (event.which === 188 ) { // comma
                console.log(',')
                engine.updateOffset( -0.01 ) ;
            }
        }




    }

    onKeyUp(event) {

        for ( let pad of this.pads ) {
            if ( event.which === pad.dlKey ) {
                pad.dlKeyHold = false ;
                // console.log('dl up: ' + event.which);

            }
            else if ( event.which === pad.ulKey ) {
                pad.ulKeyHold = false ;
                // console.log('ul up: ' + event.which);

            }
            else if ( event.which === pad.cKey ) {
                pad.cKeyHold = false ;
                // console.log('c up: ' + event.which);

            }
            else if ( event.which === pad.urKey ) {
                pad.urKeyHold = false ;
                // console.log('ur up: ' + event.which);

            }
            else if ( event.which === pad.drKey ) {
                pad.drKeyHold = false ;
                // console.log('dr up: ' + event.which);

            }
        }

    }

    isPressed( kind, padId ) {
        return this.padsDic[padId].isPressed(kind) ;
    }

    isHeld( kind, padId ) {
        return this.padsDic[padId].isHeld(kind) ;
    }


    ready() {

    }

    update(delta) {


        for ( let pad of this.pads ) {

            pad.dlKeyPressed = false ;
            // console.log('dl down: ' +event.which) ;

            pad.ulKeyPressed = false ;
            // console.log('ul down : ' +event.which)

            pad.cKeyPressed = false ;
            // console.log('c down: ' +event.which)

            pad.urKeyPressed = false ;
            // console.log('ur down: ' +event.which)

            pad.drKeyPressed = false ;
            // console.log('dr down: ' +event.which)
        }

    }


    getPressed() {

        var list = [] ;

        for ( let pad of this.pads ) {

            if ( pad.dlKeyPressed ) {
                list.push(['dl', pad.padId]) ;
            }

            if ( pad.ulKeyPressed ) {
                list.push(['ul', pad.padId]) ;
            }

            if ( pad.cKeyPressed ) {
                list.push(['c', pad.padId]) ;
            }

            if ( pad.urKeyPressed ) {
                list.push(['ur', pad.padId]) ;
            }

            if ( pad.drKeyPressed ) {
                list.push(['dr', pad.padId]) ;
            }

        }

        return list ;
    }

}