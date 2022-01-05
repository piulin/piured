'use strict' ;


class Curve {


    _intervalList = [] ;

    constructor() {

    }

    addInterval(interval) {

        this._intervalList.push(interval) ;

    }


    scryY ( p ) {

        for (let i = 0 ; i < this._intervalList.length ; ++i ) {

            let interval = this._intervalList [ i ] ;

            if ( interval.isInIntervalX(p) ) {

                p.y = interval.scryY(p.x) ;

                return p ;

            }

        }

    }


    scryX ( p ) {

        for (let i = 0 ; i < this._intervalList.length ; ++i ) {

            let interval = this._intervalList [ i ] ;

            if ( interval.isInIntervalY(p) ) {

                p.x = interval.scryX(p.y) ;

                return p ;

            }

        }

    }

    findIntervalsBetweenX(x1, x2) {

        let intervals = [] ;
        let p1 = new Point(x1,0) ;
        let p2 = new Point(x2,0) ;
        let firstit = 0 ;

        // find first interval
        for (let i = 0 ; i < this._intervalList.length ; i++) {

            let itvl = this._intervalList[i] ;

            if ( itvl.isInIntervalX(p1) ) {
                intervals.push(itvl) ;
                firstit = i ;
                break;
            }

        }

        //add remainder
        for (let i = firstit ; i < this._intervalList.length ; i++) {

            let itvl = this._intervalList[i] ;

            if (! intervals.includes(itvl)) {
                intervals.push(itvl) ;
            }

            if ( itvl.isInIntervalX(p2) ) {
                break;
            }

        }

        return intervals ;

    }

    findIntervalsBetweenY(y1, y2) {

        let intervals = [] ;
        let p1 = new Point(0,y1) ;
        let p2 = new Point(0,y2) ;
        let firstit = 0 ;

        // find first interval
        for (let i = 0 ; i < this._intervalList.length ; i++) {

            let itvl = this._intervalList[i] ;

            if ( itvl.isInIntervalY(p1) ) {
                intervals.push(itvl) ;
                firstit = i ;
                break;
            }

        }

        //add remainder
        for (let i = firstit ; i < this._intervalList.length ; i++) {

            let itvl = this._intervalList[i] ;

            if (! intervals.includes(itvl)) {
                intervals.push(itvl) ;
            }

            if ( itvl.isInIntervalY(p2) ) {
                break;
            }

        }

        return intervals ;

    }

    findIntervalAtY(y) {
        let p1 = new Point(0,y) ;

        // find first interval
        for (let i = 0 ; i < this._intervalList.length ; i++) {

            let itvl = this._intervalList[i] ;

            if ( itvl.isInIntervalY(p1) ) {
                return itvl ;
            }

        }
    }

    findIntervalsFromY(y) {

        let intervals = [] ;
        let p1 = new Point(0,y) ;
        let firstit = 0 ;

        // find first interval
        for (let i = 0 ; i < this._intervalList.length ; i++) {

            let itvl = this._intervalList[i] ;

            if ( itvl.isInIntervalY(p1) ) {
                intervals.push(itvl) ;
                firstit = i ;
                break;
            }

        }
        //add remainder
        for (let i = firstit + 1 ; i < this._intervalList.length ; i++) {
            let itvl = this._intervalList[i] ;
                intervals.push(itvl) ;
        }

        return intervals ;

    }

    splitIntervalAtY(interval, y) {
        let index = this._intervalList.findIndex( itvl => itvl === interval) ;


        if ( interval.sideOfInIntervalAtY(y) === 'right') {
            interval.p2 = new Point(interval.scryX(y+1.0),y+1.0) ;
            this.splitIntervalAtY(interval,y) ;
            return ;
        } else if ( interval.sideOfInIntervalAtY(y) === 'left' ) {
            interval.p1 = new Point(interval.scryX(y-1.0), y-1.0) ;
            this.splitIntervalAtY(interval,y) ;
            return ;
        }

        if ( y === interval.p1.y || y === interval.p2.y ) {
            return ;
        }

        let point1 = new Point(interval.scryX(y), y) ;
        let point2 = new Point(interval.scryX(y), y) ;

        let chunk1 = new Interval(interval.p1, point1, interval.openLeft, false) ;
        let chunk2 = new Interval(point2, interval.p2, false, interval.openRight ) ;

        this._intervalList.splice(index, 1, chunk1, chunk2) ;
    }



}