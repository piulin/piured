"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

// Data structure that supports the StepQueue functionality
// It holds at a given time, the current holds and their state.
class Holds {


    constructor(padId) {

        this.padId = padId ;
        // These five correspond to the holds steps (Object3D)
        this._dl = null ;
        this._ul = null ;
        this._c = null ;
        this._ur = null ;
        this._dr = null ;

    }

    setHold (kind, value) {
        switch (kind) {
            case 'dl':
                this.dl = value ;
                break ;
            case 'ul':
                this.ul = value ;
                break ;
            case 'c':
                this.c = value ;
                break ;
            case 'ur':
                this.ur = value  ;
                break ;
            case 'dr':
                this.dr = value ;
                break ;
        }
    }

    getHold (kind) {
        switch (kind) {
            case 'dl':
                return this.dl ;
                break ;
            case 'ul':
                return this.ul ;
                break ;
            case 'c':
                return this.c ;
                break ;
            case 'ur':
                return this.ur  ;
                break ;
            case 'dr':
                return this.dr ;
                break ;
        }
    }


    asList() {
        let list = [] ;
        if ( this.dl !== null ) {
            list.push(this.dl) ;
        }
        if ( this.ul !== null ) {
            list.push(this.ul) ;
        }
        if ( this.c !== null ) {
            list.push(this.c) ;
        }
        if ( this.ur !== null ) {
            list.push(this.ur) ;
        }
        if ( this.dr !== null ) {
            list.push(this.dr) ;
        }
        return list ;
    }

    get dl() {
        return this._dl;
    }

    set dl(value) {
        this._dl = value;
    }

    get ul() {
        return this._ul;
    }

    set ul(value) {
        this._ul = value;
    }

    get c() {
        return this._c;
    }

    set c(value) {
        this._c = value;
    }

    get ur() {
        return this._ur;
    }

    set ur(value) {
        this._ur = value;
    }

    get dr() {
        return this._dr;
    }

    set dr(value) {
        this._dr = value;
    }
}