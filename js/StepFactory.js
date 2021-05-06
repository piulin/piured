"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class StepFactory {


    constructor(noteskinPath) {

        //Create all 5 step prototypes. Instantiate them by cloning them when needed.
        this.stepGeometry = new THREE.PlaneGeometry( 1 , 1 , 1, 1 ) ;

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
        [this.downLeftMapHoldEndNote, this.downLeftMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/DownLeft Hold 6x1.PNG') ;
        [this.upLeftMapHoldEndNote, this.upLeftMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/UpLeft Hold 6x1.PNG') ;
        [this.centerMapHoldEndNote, this.centerMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/Center Hold 6x1.PNG') ;
        [this.upRightMapHoldEndNote, this.upRightMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/UpRight Hold 6x1.PNG') ;
        [this.downRightMapHoldEndNote, this.downRightMaterialHoldEndNote] = this.getHoldEndNoteMapAndMaterial(noteskinPath + '/DownRight Hold 6x1.PNG') ;



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

    getHoldEndNoteMapAndMaterial (pathToTexture) {
        let holdEndNoteMap = new THREE.TextureLoader().load(pathToTexture) ;

        // to accurately represent the colors
        holdEndNoteMap.encoding = THREE.sRGBEncoding;


        // This acts as UV mapping.
        holdEndNoteMap.repeat.set(1/6,1/3) ;
        // myTexture.offset.set( -1, 2/3 );

        let holdEndNoteMaterial = new THREE.MeshBasicMaterial( { map: holdEndNoteMap, transparent: true } );


        // So they can meet inbetween.
        holdEndNoteMaterial.alphaTest = 0.1;

        return [holdEndNoteMap, holdEndNoteMaterial] ;
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

        const XOffset6x1 = ((animationPosition + 3)%6)* (1/6) ;
        const YOffset6x1HoldEndNote = 0 ;
        const YOffset6x1Hold = 1/3 ;

        this.downLeftMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        this.upLeftMapHoldEndNote.offset.set(XOffset6x1, YOffset6x1HoldEndNote) ;
        this.centerMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        this.upRightMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;
        this.downRightMapHoldEndNote.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;

        this.downLeftMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;
        this.upLeftMapHold.offset.set(XOffset6x1, YOffset6x1Hold) ;
        this.centerMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;
        this.upRightMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;
        this.downRightMapHold.offset.set( XOffset6x1, YOffset6x1Hold) ;





    }


}





