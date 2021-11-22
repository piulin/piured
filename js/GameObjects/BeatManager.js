"use strict" ;



class BeatManager extends GameObject {


    constructor(resourceManager, song, level, speed, keyBoardLag, playBackSpeed) {

        super(resourceManager) ;

        this.speed = speed ;
        this.playBackSpeed = playBackSpeed ;

        this.bpmList = song.getBMPs(level) ;
        this.scrollList = song.getScrolls(level) ;
        this.stopsList = song.getStops(level) ;
        this.delaysList = song.getDelays(level) ;
        this.song = song ;
        this.level = level ;
        this.keyBoardLag = keyBoardLag ;


        // new beatmanager

        this.second2beat = new Second2Beat(this.bpmList) ;
        this.second2displacement = new Second2Displacement(this.scrollList,this.bpmList,this.second2beat) ;
        console.log('done') ;

    }

    ready() {

        this.currentAudioTime = 0 ;
        this.currentAudioTimeReal = 0 ;
        this.currentBPM = 0 ;
        this.currentYDisplacement = -100 ;
        this.currentBeat = 0 ;
        this.currentTickCount = 1 ;


    }

    setNewPlayBackSpeed ( newPlayBackSpeed ) {
        this.playBackSpeed = newPlayBackSpeed ;
    }



    update(delta) {

        const songAudioTime = this.song.getCurrentAudioTime(this.level) ;

        if ( songAudioTime <= 0.0 || this.song.requiresResync) {
        // if ( true ) {
            this.song.requiresResync = false ;
            this.currentAudioTime = songAudioTime - this.keyBoardLag;
            this.currentAudioTimeReal = songAudioTime;
        } else {
            this.currentAudioTime += delta * this.playBackSpeed ;
            this.currentAudioTimeReal += delta * this.playBackSpeed;

        }

        // [this.currentYDisplacement, this.currentBeat] =
        //     this.getYShiftAtCurrentAudioTime(this.currentAudioTime) ;
        //
        // let [realDisp, realBeat] =
        //     this.getYShiftAtCurrentAudioTime(this.currentAudioTime) ;


        // console.log(this.scrollList)
        this.currentYDisplacement = this.second2displacement.scry(this.currentAudioTime).y ;

        this.currentBeat = this.second2beat.scry(this.currentAudioTime).y ;
        // console.log(this.currentYDisplacement )



        // console.log('time: '+ this.currentAudioTime +'\n dis: ' + this.currentYDisplacement + ' beat: '  + this.currentBeat +
        // '\n rds: ' + realDisp + ' rbet: ' + realBeat) ;

        this.updateCurrentBPM() ;

        this.currentTickCount = this.song.getTickCountAtBeat(this.level, this.currentBeat) ;

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
        let yShift = -this.second2displacement.scry(second).y * this.speed;


        return [yShift, second] ;

    }



}