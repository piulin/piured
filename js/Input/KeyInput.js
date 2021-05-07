"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode




class KeyInput {


    constructor(composer) {

        this.composer = composer ;

        // Key maps
        this.dlKey = 90 ;
        this.ulKey = 81 ;
        this.cKey = 83 ;
        this.urKey = 69 ;
        this.drKey = 67 ;


        this.dlKeyHold = false ;
        this.ulKeyHold = false ;
        this.cKeyHold = false ;
        this.urKeyHold = false ;
        this.drKeyHold = false ;


        window.onkeydown = this.onKeyDown.bind(this) ;
        window.onkeyup = this.onKeyUp.bind(this) ;


    }

    onKeyDown( event ) {

        const key = event.which ;
        if ( event.which === this.dlKey && !this.dlKeyHold ) {
            this.dlKeyHold = true ;
            // console.log('dl down: ' +event.which) ;
            this.composer.arrowPressed('dl') ;
        }
        else if ( event.which === this.ulKey && !this.ulKeyHold ) {
            this.ulKeyHold = true ;
            // console.log('ul down : ' +event.which)
            this.composer.arrowPressed('ul') ;
        }
        else if ( event.which === this.cKey && !this.cKeyHold ) {
            this.cKeyHold = true ;
            // console.log('c down: ' +event.which)
            this.composer.arrowPressed('c') ;
        }
        else if ( event.which === this.urKey && !this.urKeyHold ) {
            this.urKeyHold = true ;
            // console.log('ur down: ' +event.which)
            this.composer.arrowPressed('ur') ;
        }
        else if ( event.which === this.drKey && !this.drKeyHold ) {
            this.drKeyHold = true ;
            // console.log('dr down: ' +event.which)
            this.composer.arrowPressed('dr') ;
        }



    }

    onKeyUp(event) {

        if ( event.which === this.dlKey ) {
            this.dlKeyHold = false ;
            // console.log('dl up: ' + event.which);
            this.composer.arrowReleased('dl') ;
        }
        else if ( event.which === this.ulKey ) {
            this.ulKeyHold = false ;
            // console.log('ul up: ' + event.which);
            this.composer.arrowReleased('ul') ;
        }
        else if ( event.which === this.cKey ) {
            this.cKeyHold = false ;
            // console.log('c up: ' + event.which);
            this.composer.arrowReleased('c') ;
        }
        else if ( event.which === this.urKey ) {
            this.urKeyHold = false ;
            // console.log('ur up: ' + event.which);
            this.composer.arrowReleased('ur') ;
        }
        else if ( event.which === this.drKey ) {
            this.drKeyHold = false ;
            // console.log('dr up: ' + event.which);
            this.composer.arrowReleased('dr') ;
        }

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