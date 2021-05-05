"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Composer {



    constructor ( song, noteskinPath, speed = 1 ) {


        this.receptorFactory = new ReceptorFactory(noteskinPath);
        this.stepFactory = new StepFactory(noteskinPath);

        this.song = song;
        this.speed = speed ;

        this.stepAnimationRate = 24 ;


    }

    // Returns 3DObject containing the steps of the level.
    run (level) {

        // Save the level.
        this.level = level ;

        this.bpms = this.song.levels[level].meta['BPMS'] ;

        // Keeps
        this.lastStepTimeStamp = 0.0;
        this.animationPosition = 0 ;


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
        receptor.position.z = -0.0001;
        this.receptor = receptor;


        this.steps = steps ;
        return [steps, receptor];

    }


    update(delta) {

        this.updateStepsPosition(delta) ;
        this.updateStepsAnimation(delta) ;
        this.updateReceptorAnimation(delta) ;

    }

    updateStepsPosition(delta) {
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

    updateReceptorAnimation(delta) {


        const bpm = this.bpms[0][1] ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;

        const audioTime = this.song.getCurrentAudioTime() ;

        if ( audioTime < 0 ) {
            this.receptor.material.uniforms.activeColorContribution.value = 0 ;
            return ;
        }

        const timeInBeat = Math.abs(  audioTime % secondsPerBeat  ) ;
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
        let opacityLevel = (1 - normalizedTimeInBeat) ;
        // if (opacityLevel > 0.9 ) {
        //     opacityLevel = 1 ;
        // }

        // f(x) = 1/(1+(x/(1-x))^(- <beta>))
        const beta = 1.5 ;
        const outputOpacityLevel = 1/(1+ Math.pow( (opacityLevel/(1-opacityLevel)), (- beta)) )

        // to dump the energy over time
        // this.activeReceptor.material.opacity = outputOpacityLevel ;
        this.receptor.material.uniforms.activeColorContribution.value = opacityLevel*opacityLevel ;

        // console.log(this.activeReceptor.material.opacity) ;




    }

    updateStepsAnimation(delta) {

        let timeStamp = this.lastStepTimeStamp + delta;

        let movement = timeStamp*this.stepAnimationRate ;

        if ( movement > 1 ) {

            this.animationPosition = (this.animationPosition + 1)%6 ;
            const col = this.animationPosition % 3 ;
            // in UV cordinates, the first row is the lowest one.
            const row = Math.floor( this.animationPosition / 3 ) ;

            this.stepFactory.changeTexturePosition(col,row) ;

            this.lastStepTimeStamp = 0 ;
        } else {
            this.lastStepTimeStamp += delta ;
        }

    }



}