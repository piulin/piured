"use strict" ;



class BPMManager {


    constructor(bpmList, speed) {

        this.speed = speed ;
        this.bpmList = bpmList ;

    }

    getBPMAtBeat(beat) {

        for (let bpmInfo of this.bpmList) {
            if (beat <= bpmInfo[0] ) {
                return bpmInfo[1] ;
            }
        }

    }

    // this function calculates the YDisplacement and currentTime in song to construct the scene with the steps.
    getYShiftAndCurrentTimeInSongAtBeat( barIndex, noteInBarIndex, notesInBar ) {

        let yShift = 0.0 ;
        let currentTimeInSong = 0.0 ;

        // calculate current beat
        const beat = (4*barIndex + 4*noteInBarIndex/notesInBar) ;

        // iterate all bpms
         for (var i = 0 ; i < this.bpmList.length ; i++ ) {

             // retrieve bpm and beat from the list
             let bpmInfo = this.bpmList [i] ;
             const beatInList = bpmInfo[0] ;

             // also retrieve nextBeat from the list if possible.
             let nextBeatInList = this.bpmList [i+1] !== undefined ? this.bpmList [i+1][0] : undefined ;

             // this condition is met when the beat corresponds to the current chunk of beats (beatInList, nextBeatInList)

             if ( beat >= beatInList && ( beat < nextBeatInList || nextBeatInList === undefined ) ) {

                 // we calculate the proportion of time and displacement that this bpm would contribute.
                 const secondsPerBeat = 60 / bpmInfo[1] ;

                 yShift += - (beat - beatInList) * this.speed ;

                 currentTimeInSong += (beat - beatInList) * secondsPerBeat;

                 break ;

                 // otherwise, the whole chunk is contributed.
             } else {

                 const secondsPerBeat = 60 / bpmInfo[1] ;

                 yShift += - (nextBeatInList - beatInList) * this.speed ;

                 currentTimeInSong += (nextBeatInList - beatInList) * secondsPerBeat;
             }

         }

         return [yShift, currentTimeInSong] ;
    }

    getYShiftAtCurrentAudioTime(currentAudioTime) {

        // this is what we want to calculate.
        let yShift = 0.0 ;

        let totalSeconds = 0.0 ;


        for (var i = 0 ; i < this.bpmList.length ; i++ ) {
            let bpmInfo = this.bpmList [i] ;


            let nextBeatInList = this.bpmList [i+1] !== undefined ? this.bpmList [i+1][0] : undefined ;
            const beatInList = bpmInfo[0] ;
            const bpm = bpmInfo[1] ;


            let secondsInSlot = ((nextBeatInList - beatInList) /  bpm) * 60 ;


            if ( nextBeatInList  !== undefined && currentAudioTime >= secondsInSlot + totalSeconds ) {
                yShift += (nextBeatInList - beatInList) ;
            } else {


                const elapseTime = currentAudioTime - totalSeconds ;
                const beatElapse = (bpm / 60)*elapseTime ;


                yShift += beatElapse ;
                break ;
            }

            totalSeconds += ((nextBeatInList - beatInList) /  bpm) * 60 ;



        }

        return yShift ;
    }



}