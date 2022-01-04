"use strict" ;



class BeatManager extends GameObject {


    constructor(resourceManager, song, level, speed, keyBoardLag, playBackSpeed) {

        super(resourceManager) ;

        this.playBackSpeed = playBackSpeed ;

        this.bpmList = song.getBMPs(level) ;
        this.scrollList = song.getScrolls(level) ;
        this.stopsList = song.getStops(level) ;
        this.delaysList = song.getDelays(level) ;
        this.song = song ;
        this.level = level ;
        this.keyBoardLag = keyBoardLag ;
        this.customOffset = 0 ;
        this.requiresResync = false ;


        // new beatmanager

        this.second2beat = new Second2Beat(this.bpmList) ;
        this.second2displacement = new Second2Displacement(this.scrollList,this.bpmList,this.second2beat) ;
        this.songTime2Second = new SongTime2Second(this.stopsList, this.delaysList, this.second2beat) ;
        console.log('done') ;
        this._speed = speed;

    }

    ready() {

        this._currentAudioTime = 0 ;
        this._currentAudioTimeReal = 0 ;
        this._currentChartAudioTime = 0 ;
        this._currentChartAudioTimeReal = 0
        this.currentBPM = 0 ;
        this.currentYDisplacement = -100 ;
        this.currentBeat = 0 ;
        this.currentTickCount = 1 ;


    }

    setNewPlayBackSpeed ( newPlayBackSpeed ) {
        this.playBackSpeed = newPlayBackSpeed ;
    }

    updateOffset(offset) {
        this.customOffset += offset ;
        this.requiresResync = true ;
    }


    update(delta) {

        const songAudioTime = this.song.getCurrentAudioTime(this.level) - this.customOffset ;

        if ( songAudioTime <= 0.0 || this.requiresResync) {
        // if ( true ) {
            this.requiresResync = false ;
            this._currentAudioTime = songAudioTime - this.keyBoardLag;
            this._currentAudioTimeReal = songAudioTime;
        } else {
            this._currentAudioTime += delta * this.playBackSpeed ;
            this._currentAudioTimeReal += delta * this.playBackSpeed;

        }

        this._currentChartAudioTime = this.songTime2Second.scry(this._currentAudioTime).y ;
        this._currentChartAudioTimeReal = this.songTime2Second.scry(this._currentAudioTimeReal).y ;


        // [this.currentYDisplacement, this.currentBeat] =
        //     this.getYShiftAtCurrentAudioTime(this.currentAudioTime) ;
        //
        // let [realDisp, realBeat] =
        //     this.getYShiftAtCurrentAudioTime(this.currentAudioTime) ;


        // console.log(this.scrollList)
        this.currentYDisplacement = this.second2displacement.scry(this._currentChartAudioTime).y ;

        this.currentBeat = this.second2beat.scry(this._currentChartAudioTime).y ;
        // console.log(this.currentYDisplacement )



        // console.log('time: '+ this.currentAudioTime +'\n dis: ' + this.currentYDisplacement + ' beat: '  + this.currentBeat +
        // '\n rds: ' + realDisp + ' rbet: ' + realBeat) ;

        this.updateCurrentBPM() ;

        this.currentTickCount = this.song.getTickCountAtBeat(this.level, this.currentBeat) ;

    }

    get currentAudioTime () {
        return this._currentChartAudioTime ;
    }

    get currentAudioTimeReal() {
        return this._currentChartAudioTimeReal ;
    }

    updateCurrentBPM () {

        const tickCounts = this.bpmList ;
        let last = tickCounts[0][1];
        for ( const tickCount of tickCounts ) {
            const beatInTick = tickCount[0] ;
            const tick = tickCount[1] ;
            if ( this.currentBeat >= beatInTick ) {
                last = tick ;
            } else {
                break ;
            }
        }
        this.currentBPM = last ;

    }

    getScrollAtBeat(beat) {
        const tickCounts = this.scrollList ;
        let last = tickCounts[0];
        for ( const tickCount of tickCounts ) {
            const beatInTick = tickCount[0] ;
            const tick = tickCount[1] ;
            if ( beat >= beatInTick ) {
                last = tickCount ;
            } else {
                return last ;
            }
        }
        return last ;
    }


    getYShiftAndCurrentTimeInSongAtBeat( barIndex, noteInBarIndex, notesInBar ) {
        // calculate current beat
        const beat = (4*barIndex + 4*noteInBarIndex/notesInBar) ;

        let second = this.second2beat.reverseScry(beat).x ;
        let songTime = this.songTime2Second.reverseScry(second).x ;
        let yShift = -this.second2displacement.scry(second).y * this._speed;


        return [yShift, second] ;

    }



}