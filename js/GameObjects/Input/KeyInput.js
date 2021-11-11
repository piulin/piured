"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class KeyInput extends GameObject {


    constructor(resourceManager) {

        super(resourceManager) ;

        this.pads = [] ;
        this.padsDic = {} ;

        this.addOffsetKeyMap = ',' ; // period
        this.subtractOffsetKeyMap = '.' ; // comma

        this.addPlayBackSpeedKeyMap = '+' ; // period
        this.substractPlayBackSpeedKeyMap = '-' ; // comma

        this.offsetChangeEnabled = true ;

        window.onkeydown = this.onKeyDown.bind(this) ;
        window.onkeyup = this.onKeyUp.bind(this) ;

    }

    getPadIds() {
        return Object.keys(this.padsDic) ;
    }

    addPad(keyMap, padId) {
        console.log(keyMap) ;
        for (const [key, value] of Object.entries(keyMap)) {
            if ( value === this.addOffsetKeyMap || value === this.subtractOffsetKeyMap) {
                this.offsetChangeEnabled = false ;
            }
        }

        const pad = new Pad(keyMap, padId) ;
        this.pads.push( pad ) ;
        this.padsDic[padId] = pad ;
    }

    onKeyDown( event ) {


        const key =  event.key.toLowerCase() ;

        for ( let pad of this.pads ) {
            if ( key === pad.dlKey && !pad.dlKeyHold ) {
                pad.dlKeyHold = true ;
                pad.dlKeyPressed = true ;
                // console.log('dl down: ' +key) ;
            }
            else if ( key === pad.ulKey && !pad.ulKeyHold ) {
                pad.ulKeyHold = true ;
                pad.ulKeyPressed = true ;
                // console.log('ul down : ' +key)
            }
            else if ( key === pad.cKey && !pad.cKeyHold ) {
                pad.cKeyHold = true ;
                pad.cKeyPressed = true ;
                // console.log('c down: ' +key)
            }
            else if ( key === pad.urKey && !pad.urKeyHold ) {
                pad.urKeyHold = true ;
                pad.urKeyPressed = true ;
                // console.log('ur down: ' +key)
            }
            else if ( key === pad.drKey && !pad.drKeyHold ) {
                pad.drKeyHold = true ;
                pad.drKeyPressed = true ;
                // console.log('dr down: ' +key)
            }

            else if ( key === this.addOffsetKeyMap && this.offsetChangeEnabled) {
                engine.updateOffset(0.01) ;
            } else if (key === this.subtractOffsetKeyMap && this.offsetChangeEnabled) {
                engine.updateOffset( -0.01 ) ;
            }

            else if ( key === this.addPlayBackSpeedKeyMap) {
                engine.tunePlayBackSpeed(0.05) ;
            } else if (key === this.substractPlayBackSpeedKeyMap) {
                engine.tunePlayBackSpeed( -0.05 ) ;
            }
        }




    }

    onKeyUp(event) {

        const key = event.key ;

        for ( let pad of this.pads ) {
            if ( key === pad.dlKey ) {
                pad.dlKeyHold = false ;
                // console.log('dl up: ' + key);

            }
            else if ( key === pad.ulKey ) {
                pad.ulKeyHold = false ;
                // console.log('ul up: ' + key);

            }
            else if ( key === pad.cKey ) {
                pad.cKeyHold = false ;
                // console.log('c up: ' + key);

            }
            else if ( key === pad.urKey ) {
                pad.urKeyHold = false ;
                // console.log('ur up: ' + key);

            }
            else if ( key === pad.drKey ) {
                pad.drKeyHold = false ;
                // console.log('dr up: ' + key);

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
            // console.log('dl down: ' +key) ;

            pad.ulKeyPressed = false ;
            // console.log('ul down : ' +key)

            pad.cKeyPressed = false ;
            // console.log('c down: ' +key)

            pad.urKeyPressed = false ;
            // console.log('ur down: ' +key)

            pad.drKeyPressed = false ;
            // console.log('dr down: ' +key)
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