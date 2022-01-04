"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class Pad extends GameObject {


    constructor(resourceManager, keyMap, padId) {
        super(resourceManager) ;
        // Key maps
        if (keyMap !== null) {
            this.dlKey =  keyMap.dl.toLowerCase() ;
            this.ulKey = keyMap.ul.toLowerCase() ;
            this.cKey = keyMap.c.toLowerCase() ;
            this.urKey = keyMap.ur.toLowerCase() ;
            this.drKey = keyMap.dr.toLowerCase() ;
        }

        this.dlKeyPressed = false ;
        this.ulKeyPressed = false ;
        this.cKeyPressed = false ;
        this.urKeyPressed = false ;
        this.drKeyPressed = false ;

        this.dlKeyHold = false ;
        this.ulKeyHold = false ;
        this.cKeyHold = false ;
        this.urKeyHold = false ;
        this.drKeyHold = false ;

        this.padId = padId ;

    }

    isPressed(kind) {
        switch (kind) {
            case 'dl':
                return  this.dlKeyPressed ;
                break ;
            case 'ul':
                return  this.ulKeyPressed ;
                break ;
            case 'c':
                return  this.cKeyPressed ;
                break ;
            case 'ur':
                return  this.urKeyPressed ;
                break ;
            case 'dr':
                return  this.drKeyPressed ;
                break ;
        }
    }

    isHeld(kind) {
        switch (kind) {
            case 'dl':
                return  this.dlKeyHold ;
                break ;
            case 'ul':
                return  this.ulKeyHold ;
                break ;
            case 'c':
                return  this.cKeyHold ;
                break ;
            case 'ur':
                return  this.urKeyHold ;
                break ;
            case 'dr':
                return  this.drKeyHold ;
                break ;
        }
    }

    ready() {

    }


    update(delta) {
        this.dlKeyPressed = false ;
        // console.log('dl down: ' +key) ;

        this.ulKeyPressed = false ;
        // console.log('ul down : ' +key)

        this.cKeyPressed = false ;
        // console.log('c down: ' +key)

        this.urKeyPressed = false ;
        // console.log('ur down: ' +key)

        this.drKeyPressed = false ;
    }




}