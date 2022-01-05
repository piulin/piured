'use strict' ;




class Second2Displacement {


    _curve ;
    _scrolls ;
    _s2b ;

    constructor(scrolls, bpms, s2b) {

        this._scrolls = Array.from(scrolls) ;
        this._s2b = s2b ;
        this._curve = new Second2Beat(bpms)._curve ;


        let tolerance = 0.00001 ;


        for ( let i = 0 ; i < this._scrolls.length -1 ; i++ ) {

            let beat1 = this._scrolls[ i ][0] ;
            let scroll1 = this._scrolls[ i ] [1] ;
            let beat2 = this._scrolls[ i+1 ][0] ;
            let scroll2 = this._scrolls[ i+1 ] [1] ;

            let displacement1 = this._curve.scryY(this._s2b.reverseScry(beat1)).y ;
            let displacement2 = this._curve.scryY(this._s2b.reverseScry(beat2)).y ;


            let firstInterval = this._curve.findIntervalAtY(displacement1) ;
            this._curve.splitIntervalAtY(firstInterval, displacement1) ;

            let lastInterval = this._curve.findIntervalAtY(displacement2) ;
            this._curve.splitIntervalAtY(lastInterval, displacement2) ;


            let intervals = this._curve.findIntervalsBetweenY(displacement1,displacement2) ;

            if (Math.abs(intervals[intervals.length -1].p1.y - displacement2) < tolerance ) {
                intervals.pop() ;
            }

            let prevp1 = intervals[0].p1 ;
            let prevdiff = 0.0 ;

            let remainderIntervals = this._curve.findIntervalsFromY(displacement2) ;

            //modify scroll sections
            for (let j = 0 ; j < intervals.length ; j++) {

                let itvl1 = intervals[j] ;
                itvl1.p1 = prevp1 ;
                let oldy2 = itvl1.p2.y ;
                itvl1.p2.y = prevp1.y + (itvl1.p2.y - prevp1.y + prevdiff) * scroll1 ;

                prevp1 = new Point(itvl1.p2.x, itvl1.p2.y) ;
                prevdiff = itvl1.p2.y - oldy2 ;


            }

            for (let j = 0 ; j < remainderIntervals.length ; j++) {
                let itvl = remainderIntervals[j] ;
                itvl.p1.y += prevdiff ;
                itvl.p2.y += prevdiff ;
            }

        }


        //last scroll

        let beat = this._scrolls[ this._scrolls.length - 1 ][0] ;
        let scroll= this._scrolls[ this._scrolls.length - 1 ] [1] ;
        let displacement = this._curve.scryY(this._s2b.reverseScry(beat)).y ;
        let interval = this._curve.findIntervalAtY(displacement) ;
        this._curve.splitIntervalAtY(interval, displacement) ;

        let intervals = this._curve.findIntervalsFromY(displacement) ;
        let prevp1 = intervals[0].p1 ;
        let prevdiff = 0.0 ;

        //modify scroll sections
        for (let j = 0 ; j < intervals.length ; j++) {

            let itvl1 = intervals[j] ;
            itvl1.p1 = prevp1 ;
            let oldy2 = itvl1.p2.y ;
            itvl1.p2.y = prevp1.y + (itvl1.p2.y - prevp1.y + prevdiff) * scroll ;

            prevp1 = new Point(itvl1.p2.x, itvl1.p2.y) ;
            prevdiff = itvl1.p2.y - oldy2 ;

        }



    }

    scry(value) {

        let p = new Point(value, 0 ) ;
        return this._curve.scryY(p) ;

    }



}