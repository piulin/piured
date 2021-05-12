"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class Pad {


    constructor(keyMap, padId) {

        // Key maps
        this.dlKey =  keyMap.dl ;
        this.ulKey = keyMap.ul ;
        this.cKey = keyMap.c ;
        this.urKey = keyMap.ur ;
        this.drKey = keyMap.dr ;

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


}