'use strict' ;

class Interval {


    _p1 ;
    _p2 ;
    _openLeft ;
    _openRight ;

    constructor( p1, p2, openLeft, openRight ) {

        this._p1 = p1 ;
        this._p2 = p2 ;

        this._openLeft = openLeft ;
        this._openRight = openRight ;

    }


    isInIntervalX( p ) {

        if ( this._openLeft && this._openRight ) {
            return true ;
        } else if (this._openLeft) {
            return p.x < this._p2.x;
        } else if (this._openRight) {
            return p.x >= this._p1.x ;
        }
        return p.x >= this._p1.x && p.x < this._p2.x;

    }

    isInIntervalY( p ) {

        if ( this._openLeft && this._openRight ) {
            return true ;
        } else if (this._openLeft) {
            return p.y < this._p2.y;
        } else if (this._openRight) {
            return p.y >= this._p1.y ;
        }
        return p.y >= this._p1.y && p.y < this._p2.y;

    }
    

    scryY( x ) {

        let m = (this._p2.y - this._p1.y) / (this._p2.x - this._p1.x) ;

        let y = m*(x-this._p1.x) + this._p1.y ;

        return y ;

    }

    scryX( y ) {

        let m = (this._p2.x - this._p1.x) / (this._p2.y - this._p1.y) ;

        let x = m*(y-this._p1.y) + this._p1.x ;

        return x ;

    }



    sideOfInIntervalAtY(y){

        let leftBoundary = this.scryY(this.p1.x) ;
        let rightBoundary = this.scryY(this.p2.x) ;

        if ( y < leftBoundary ) {
            return 'left' ;
        } else if (y > rightBoundary) {
            return 'right' ;
        }

        return 'in' ;


    }


    get p1() {
        return this._p1;
    }

    get p2() {
        return this._p2;
    }


    set p1(value) {
        this._p1 = value;
    }

    set p2(value) {
        this._p2 = value;
    }

    get openLeft() {
        return this._openLeft;
    }

    get openRight() {
        return this._openRight;
    }
}