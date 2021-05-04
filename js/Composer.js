"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Composer {



    constructor ( song, noteskinPath, speed = 1 ) {


        this.receptorFactory = new ReceptorFactory(noteskinPath);
        this.stepFactory = new StepFactory(noteskinPath);

        this.song = song;
        this.speed = speed ;


    }

    // Returns 3DObject containing the steps of the level.
    run (level) {

        // Save the level.
        this.level = level ;

        this.bpms = this.song.levels[level].meta['BPMS'] ;

        // Space to the right or left of a given step.
        const stepShift = 4/5;
        // Note that the receptor steps are a bit overlapped. This measure takes into
        // acount this overlap.
        const stepOverlap = 0.02 ;

        // object containing all the steps of the chart.
        let steps = new THREE.Object3D();

        const noteData = this.song.levels[level] ;

        // i loops the bars
        for (var i = 0 ; i < noteData.measures.length ; i++ ) {
            const measure = noteData.measures[i] ;

            const notesInBar = measure.length ;

            // j loops the notes inside the bar
            for ( var j = 0 ; j < measure.length ; j++ ) {
                const note = measure[j] ;

                // TODO: check what happens with tuplet (e.g. triplets) lol
                const currentYPosition = - (4*i + 4*j/notesInBar)* this.speed ;

                // dl
                if ( note[0] === '1' ) {
                    let step = this.stepFactory.getStep('dl');
                    step.position.y = currentYPosition ;
                    step.position.x = -2*(stepShift - stepOverlap) ;
                    steps.add(step) ;
                }

                // ul
                if ( note[1] === '1' ) {
                    let step = this.stepFactory.getStep('ul');
                    step.position.y = currentYPosition ;
                    step.position.x = -(stepShift - stepOverlap) ;
                    steps.add(step) ;
                }

                // c
                if ( note[2] === '1' ) {
                    let step = this.stepFactory.getStep('c');
                    step.position.y = currentYPosition ;
                    step.position.x = 0 ;
                    steps.add(step) ;
                }

                // ur
                if ( note[3] === '1' ) {
                    let step = this.stepFactory.getStep('ur');
                    step.position.y = currentYPosition ;
                    step.position.x = (stepShift - stepOverlap) ;
                    steps.add(step) ;
                }

                // dr
                if ( note[4] === '1' ) {
                    let step = this.stepFactory.getStep('dr');
                    step.position.y = currentYPosition ;
                    step.position.x = 2*(stepShift - stepOverlap) ;
                    steps.add(step) ;
                }

            }

        }

        // Get receptor
        let receptor = this.receptorFactory.getReceptor();
        this.receptor = receptor;

        this.steps = steps ;
        return [steps, receptor];

    }


    update(delta) {

        // const bpm = this.song.meta [ 'BPMS']
        // const bpm = 143 ;
        // const beatsPerSecond = bpm / 60 ;
        // const yDisplacement = beatsPerSecond * delta ;
        //
        // this.steps.position.y += yDisplacement* this.speed ;


        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        const audioTime = this.song.getCurrentAudioTime() ;
        const yDisplacement = beatsPerSecond * audioTime ;

        this.steps.position.y = yDisplacement* this.speed ;

        // console.log(audioTime);

    }



}