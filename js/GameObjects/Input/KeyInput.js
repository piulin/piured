"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class KeyInput extends GameObject {

    _mesh ;

    constructor(resourceManager) {

        super(resourceManager) ;

        this.pads = [] ;
        this.padsDic = {} ;

        this._mesh = new THREE.Object3D() ;


    }

    getPadIds() {
        return Object.keys(this.padsDic) ;
    }

    addPad(keyMap, padId) {

        const pad = new Pad(this._resourceManager, keyMap, padId) ;
        engine.addToUpdateList(pad) ;
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

    get object () {
        return this._mesh ;
    }

}