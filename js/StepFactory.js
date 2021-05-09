"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class StepFactory {


    constructor(noteskinPath) {

        //Create all 5 step prototypes. Instantiate them by cloning them when needed.
        this.stepGeometry = new THREE.PlaneGeometry( 1 , 1 , 1, 1 ) ;

        this.noteskinPath = noteskinPath ;

        this.holdEndNoteMapList = [] ;

        this.stepCopyList = [];

        //Steps
        [this.downLeftMap, this.downLeftMaterial] = this.getStepMapAndMaterial(noteskinPath + '/DownLeft TapNote 3x2.PNG') ;
        [this.upLeftMap, this.upLeftMaterial] = this.getStepMapAndMaterial(noteskinPath + '/UpLeft TapNote 3x2.PNG') ;
        [this.centerMap, this.centerMaterial] = this.getStepMapAndMaterial(noteskinPath + '/Center TapNote 3x2.PNG') ;
        [this.upRightMap, this.upRightMaterial] = this.getStepMapAndMaterial(noteskinPath + '/UpRight TapNote 3x2.PNG') ;
        [this.downRightMap, this.downRightMaterial] = this.getStepMapAndMaterial(noteskinPath + '/DownRight TapNote 3x2.PNG') ;

        //Holds
        [this.downLeftMapHold, this.downLeftMaterialHold] = this.getHoldMapAndMaterial(noteskinPath + '/DownLeft Hold 6x1.PNG') ;
        [this.upLeftMapHold, this.upLeftMaterialHold] = this.getHoldMapAndMaterial(noteskinPath + '/UpLeft Hold 6x1.PNG') ;
        [this.centerMapHold, this.centerMaterialHold] = this.getHoldMapAndMaterial(noteskinPath + '/Center Hold 6x1.PNG') ;
        [this.upRightMapHold, this.upRightMaterialHold] = this.getHoldMapAndMaterial(noteskinPath + '/UpRight Hold 6x1.PNG') ;
        [this.downRightMapHold, this.downRightMaterialHold] = this.getHoldMapAndMaterial(noteskinPath + '/DownRight Hold 6x1.PNG') ;


        // Hold endNotes

        // this.downLeftMapHoldEndNote = this.getHoldEndNoteMap(noteskinPath + '/DownLeft Hold 6x1.PNG') ;
        // this.upLeftMapHoldEndNote = this.getHoldEndNoteMap(noteskinPath + '/UpLeft Hold 6x1.PNG') ;
        // this.centerMapHoldEndNote = this.getHoldEndNoteMap(noteskinPath + '/Center Hold 6x1.PNG') ;
        // this.upRightMapHoldEndNote = this.getHoldEndNoteMap(noteskinPath + '/UpRight Hold 6x1.PNG') ;
        // this.downRightMapHoldEndNote = this.getHoldEndNoteMap(noteskinPath + '/DownRight Hold 6x1.PNG') ;



        [this.downLeftMapHoldEndNote, this.downLeftMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/DownLeft Hold 6x1.PNG', 'dl') ;
        [this.upLeftMapHoldEndNote, this.upLeftMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/UpLeft Hold 6x1.PNG', 'ul') ;
        [this.centerMapHoldEndNote, this.centerMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/Center Hold 6x1.PNG', 'c') ;
        [this.upRightMapHoldEndNote, this.upRightMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/UpRight Hold 6x1.PNG', 'ur') ;
        [this.downRightMapHoldEndNote, this.downRightMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/DownRight Hold 6x1.PNG', 'dr') ;



    }

    getStepMapAndMaterial(pathToTexture) {
        let stepMap = new THREE.TextureLoader().load(pathToTexture) ;


        // to accurately represent the colors
        stepMap.encoding = THREE.sRGBEncoding;


        // This acts as UV mapping.
        stepMap.repeat.set(1/3,1/2);
        // myTexture.offset.set( -1, 2/3 );


        let stepMaterial = new THREE.MeshBasicMaterial( { map: stepMap, transparent: true } );


        // So they can meet inbetween.
        stepMaterial.alphaTest = 0.1;

        return [stepMap, stepMaterial] ;

    }

    getHoldMapAndMaterial (pathToTexture) {
        let holdMap = new THREE.TextureLoader().load(pathToTexture) ;

        // to accurately represent the colors
        holdMap.encoding = THREE.sRGBEncoding;


        // This acts as UV mapping.
        holdMap.repeat.set(1/6,2/3) ;
        holdMap.offset.set(0,1/3);
        // myTexture.offset.set( -1, 2/3 );

        let holdMaterial = new THREE.MeshBasicMaterial( { map: holdMap, transparent: true } );


        // So they can meet inbetween.
        holdMaterial.alphaTest = 0.1;

        return [holdMap, holdMaterial] ;
    }


    getHoldEndNoteMap (pathToTexture) {
        // let tl = new THREE.TextureLoaddAsync(pathToTexture) ;

        let holdEndNoteMap = new THREE.TextureLoader().load(pathToTexture) ;

        // to accurately represent the colors
        holdEndNoteMap.encoding = THREE.sRGBEncoding;


        // This acts as UV mapping.
        holdEndNoteMap.repeat.set(1/6,1/3) ;
        return holdEndNoteMap ;
    }

    getHoldEndNoteMapAndMaterial (pathToTexture, kind) {

        let hl = this.holdEndNoteMapList ;
        let holdEndNoteMap = new THREE.TextureLoader().load(pathToTexture,

            // When the texture is loaded, be sure to update all the generated holds. Otherwise they
            // will not appear on screen.
            function (){
                for ( var i = 0 ; i < hl.length ; i++) {
                    let m = hl [ i ] ;
                    if ( m.kind === kind ) {
                        m.image = holdEndNoteMap.image ;
                        m.needsUpdate = true ;
                    }
                }

            }) ;

        // to accurately represent the colors
        holdEndNoteMap.encoding = THREE.sRGBEncoding;


        // // This acts as UV mapping.
        holdEndNoteMap.repeat.set(1/6,1/3) ;


        let holdMaterial = new THREE.MeshBasicMaterial( { map: holdEndNoteMap, transparent: true , alphaTest: 0.1 } );
        // So they can meet inbetween.
        holdMaterial.alphaTest = 0.1;

        return [holdEndNoteMap, holdMaterial] ;


        // for the shader.
        // var uniforms = {
        //     uNoteTexture: { type: "t", value: holdEndNoteMap },
        //     uOffset : { type: "v2" , value: new THREE.Vector2(0,0) },
        //     uRepeat : { type: "v2" , value: new THREE.Vector2(1/6,1/3) },
        //     uInvisible : { type: "f" , value : 0.0 }
        // };
        //
        //
        // // let vs = document.getElementById('vertex').textContent;
        // let vs = '';
        // readFileContent('shaders/endNote.vert',function (content) {
        //     vs = content ;
        // })
        // // let fs = document.getElementById('fragment').textContent;
        // let fs = '' ;
        // readFileContent('shaders/endNote.frag', function (content) {
        //     fs = content;
        // })
        //
        // var holdEndNoteMaterial = new THREE.ShaderMaterial({
        //     uniforms: uniforms,
        //     vertexShader: vs,
        //     fragmentShader: fs
        // });
        //
        //
        // return [holdEndNoteMap, holdEndNoteMaterial] ;
    }


    getNewHoldEndNoteObject(kind) {

        let mapPath ;
        let holdEndNoteMap ;

        switch (kind) {
            case 'dl':
                mapPath = this.noteskinPath + '/DownLeft Hold 6x1.PNG' ;
                holdEndNoteMap = this.downLeftMapHoldEndNote.clone() ;
                break ;
            case 'ul':
                mapPath = this.noteskinPath + '/UpLeft Hold 6x1.PNG' ;
                holdEndNoteMap = this.upLeftMapHoldEndNote.clone() ;
                break ;
            case 'c':
                mapPath = this.noteskinPath + '/Center Hold 6x1.PNG' ;
                holdEndNoteMap = this.centerMapHoldEndNote.clone() ;
                break ;
            case 'ur':
                mapPath = this.noteskinPath + '/UpRight Hold 6x1.PNG' ;
                holdEndNoteMap = this.upRightMapHoldEndNote.clone() ;
                break ;
            case 'dr':
                mapPath = this.noteskinPath + '/DownRight Hold 6x1.PNG' ;
                holdEndNoteMap = this.downRightMapHoldEndNote.clone() ;
                break ;
        }

        holdEndNoteMap.kind = kind ;
        this.holdEndNoteMapList.push(holdEndNoteMap) ;

        // let holdEndNoteMap = new THREE.TextureLoader().load(mapPath) ;

        // to accurately represent the colors
        holdEndNoteMap.encoding = THREE.sRGBEncoding;


        // // This acts as UV mapping.
        holdEndNoteMap.repeat.set(1/6,1/3) ;
        //
        //
        let holdMaterial = new THREE.MeshBasicMaterial( { map: holdEndNoteMap, transparent: true , alphaTest: 0.1 } );
        // // So they can meet inbetween.
        holdMaterial.alphaTest = 0.1;

        return new THREE.Mesh( this.stepGeometry, holdMaterial );


    }

    getCommonHoldEndNoteObject(kind) {
        switch (kind) {
            case 'dl':
                return  new THREE.Mesh( this.stepGeometry, this.downLeftMaterialHoldEndNote );
                break ;
            case 'ul':
                return  new THREE.Mesh( this.stepGeometry, this.upLeftMaterialHoldEndNote );
                break ;
            case 'c':
                return  new THREE.Mesh( this.stepGeometry, this.centerMaterialHoldEndNote );
                break ;
            case 'ur':
                return  new THREE.Mesh( this.stepGeometry, this.upRightMaterialHoldEndNote );
                break ;
            case 'dr':
                return  new THREE.Mesh( this.stepGeometry, this.downRightMaterialHoldEndNote );
                break ;
        }
    }

    getStep(kind) {

        // Create one step out of the five available.
        switch (kind) {
            case 'dl':
                return  new THREE.Mesh( this.stepGeometry, this.downLeftMaterial );
                break ;
            case 'ul':
                return  new THREE.Mesh( this.stepGeometry, this.upLeftMaterial );
                break ;
            case 'c':
                return  new THREE.Mesh( this.stepGeometry, this.centerMaterial );
                break ;
            case 'ur':
                return  new THREE.Mesh( this.stepGeometry, this.upRightMaterial );
                break ;
            case 'dr':
                return  new THREE.Mesh( this.stepGeometry, this.downRightMaterial );
                break ;
        }

    }

    getStepEffect(kind) {

        // Create one step out of the five available.

        let step = null ;
        switch (kind) {
            case 'dl':
                let [downLeftMap, downLeftMaterial] = this.getStepMapAndMaterial(this.noteskinPath + '/DownLeft TapNote 3x2.PNG') ;
                downLeftMaterial.blending = THREE.AdditiveBlending ;

                step =  new THREE.Mesh( this.stepGeometry, downLeftMaterial );
                break ;
            case 'ul':
                let [upLeftMap, upLeftMaterial] = this.getStepMapAndMaterial(this.noteskinPath + '/UpLeft TapNote 3x2.PNG') ;
                upLeftMaterial.blending = THREE.AdditiveBlending ;
                step =  new THREE.Mesh( this.stepGeometry, upLeftMaterial );
                break ;
            case 'c':
                let [centerMap, centerMaterial] = this.getStepMapAndMaterial(this.noteskinPath + '/Center TapNote 3x2.PNG') ;
                centerMaterial.blending = THREE.AdditiveBlending ;
                step =   new THREE.Mesh( this.stepGeometry, centerMaterial );
                break ;
            case 'ur':
                let [upRightMap, upRightMaterial] = this.getStepMapAndMaterial(this.noteskinPath + '/UpRight TapNote 3x2.PNG') ;
                upRightMaterial.blending = THREE.AdditiveBlending ;
                step =   new THREE.Mesh( this.stepGeometry, upRightMaterial );
                break ;
            case 'dr':
                let [downRightMap, downRightMaterial] = this.getStepMapAndMaterial(this.noteskinPath + '/DownRight TapNote 3x2.PNG') ;
                downRightMaterial.blending = THREE.AdditiveBlending ;
                step =   new THREE.Mesh( this.stepGeometry, downRightMaterial );
                break ;
        }

        let scale = 100.0 ;
        step.material.color.r = scale ;
        step.material.color.g = scale ;
        step.material.color.b = scale ;
        // in order to animate these too.
        this.stepCopyList.push(step) ;

        return step ;

    }

    getHold(kind) {
        switch (kind) {
            case 'dl':
                return  new THREE.Mesh( this.stepGeometry, this.downLeftMaterialHold );
                break ;
            case 'ul':
                return  new THREE.Mesh( this.stepGeometry, this.upLeftMaterialHold );
                break ;
            case 'c':
                return  new THREE.Mesh( this.stepGeometry, this.centerMaterialHold );
                break ;
            case 'ur':
                return  new THREE.Mesh( this.stepGeometry, this.upRightMaterialHold );
                break ;
            case 'dr':
                return  new THREE.Mesh( this.stepGeometry, this.downRightMaterialHold );
                break ;
        }
    }

    getHoldEndNote(kind) {

        return this.getNewHoldEndNoteObject(kind) ;

        // this produces some glitches. We need separate textures for each end note.
        // return this.getCommonHoldEndNoteObject(kind) ;

    }



    changeTexturePosition(animationPosition) {

        const col = animationPosition % 3 ;
        // in UV cordinates, the first row is the lowest one.
        const row = Math.floor( animationPosition / 3 ) ;

        const XOffset3x2 = col * (1/3) ;
        const YOffset3x2 = row * (1/2) ;

        this.downLeftMap.offset.set(  XOffset3x2, YOffset3x2 );
        this.upLeftMap.offset.set( XOffset3x2, YOffset3x2) ;
        this.centerMap.offset.set( XOffset3x2, YOffset3x2 );
        this.upRightMap.offset.set ( XOffset3x2, YOffset3x2 );
        this.downRightMap.offset.set( XOffset3x2, YOffset3x2 );


        for ( var i = 0 ; i < this.stepCopyList.length ; i++ ) {
            this.stepCopyList[i].material.map.offset.set( XOffset3x2, YOffset3x2 ) ;

        }

        const XOffset6x1 = ((animationPosition + 3)%6)* (1/6) ;
        const YOffset6x1HoldEndNote = 0 ;
        const YOffset6x1Hold = 1/3 ;

        this.downLeftMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        this.upLeftMapHoldEndNote.offset.set(XOffset6x1, YOffset6x1HoldEndNote) ;
        this.centerMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        this.upRightMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        this.downRightMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;

        // Use only with custom shader
        // this.downLeftMaterialHoldEndNote.uniforms.uOffset.value.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        // this.upLeftMaterialHoldEndNote.uniforms.uOffset.value.set(XOffset6x1, YOffset6x1HoldEndNote) ;
        // this.centerMaterialHoldEndNote.uniforms.uOffset.value.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        // this.upRightMaterialHoldEndNote.uniforms.uOffset.value.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        // this.downRightMaterialHoldEndNote.uniforms.uOffset.value.set( XOffset6x1, YOffset6x1HoldEndNote) ;

        this.downLeftMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;
        this.upLeftMapHold.offset.set(XOffset6x1, YOffset6x1Hold) ;
        this.centerMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;
        this.upRightMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;
        this.downRightMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;


        // Iterate all holdEndNote items.
        for ( var i = 0 ; i < this.holdEndNoteMapList.length ; i++ ) {
            // console.log(i);
            let hl = this.holdEndNoteMapList[i] ;
            hl.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;


        }


    }


}





