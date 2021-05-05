"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class StepFactory {


    constructor(noteskinPath) {

        //Create all 5 step prototypes. Instantiate them by cloning them when needed.
        this.stepGeometry = new THREE.PlaneGeometry( 1 , 1 , 1, 1 ) ;


        this.downLeftMap = new THREE.TextureLoader().load(noteskinPath + '/DownLeft TapNote 3x2.PNG') ;
        this.upLeftMap = new THREE.TextureLoader().load(noteskinPath + '/UpLeft TapNote 3x2.PNG') ;
        this.centerMap = new THREE.TextureLoader().load(noteskinPath + '/Center TapNote 3x2.PNG') ;
        this.upRightMap = new THREE.TextureLoader().load(noteskinPath + '/UpRight TapNote 3x2.PNG') ;
        this.downRightMap = new THREE.TextureLoader().load(noteskinPath + '/DownRight TapNote 3x2.PNG') ;


        // to accurately represent the colors
        this.downLeftMap.encoding = THREE.sRGBEncoding;
        this.upLeftMap.encoding = THREE.sRGBEncoding;
        this.centerMap.encoding = THREE.sRGBEncoding;
        this.upRightMap.encoding = THREE.sRGBEncoding;
        this.downRightMap.encoding = THREE.sRGBEncoding;


        // This acts as UV mapping.
        this.downLeftMap.repeat.set(1/3,1/2);
        this.upLeftMap.repeat.set(1/3,1/2);
        this.centerMap.repeat.set(1/3,1/2);
        this.upRightMap.repeat.set(1/3,1/2);
        this.downRightMap.repeat.set(1/3,1/2);
        // myTexture.offset.set( -1, 2/3 );



        // myTexture.needsUpdate = true;

        this.downLeftMaterial = new THREE.MeshBasicMaterial( { map: this.downLeftMap, transparent: true } );
        this.upLeftMaterial = new THREE.MeshBasicMaterial( { map: this.upLeftMap, transparent: true } );
        this.centerMaterial = new THREE.MeshBasicMaterial( { map: this.centerMap, transparent: true } );
        this.upRightMaterial = new THREE.MeshBasicMaterial( { map: this.upRightMap, transparent: true } );
        this.downRightMaterial = new THREE.MeshBasicMaterial( { map: this.downRightMap, transparent: true } );

        // So they can meet inbetween.
        this.downLeftMaterial.alphaTest = 0.1;
        this.upLeftMaterial.alphaTest = 0.1;
        this.centerMaterial.alphaTest = 0.1;
        this.upRightMaterial.alphaTest = 0.1;
        this.downRightMaterial.alphaTest = 0.1;

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

    changeTexturePosition(col, row) {
        this.downLeftMap.offset.set(  col * (1/3), row * (1/2) );
        this.upLeftMap.offset.set(col * (1/3), row * (1/2));
        this.centerMap.offset.set(col * (1/3), row * (1/2));
        this.upRightMap.offset.set(col * (1/3), row * (1/2));
        this.downRightMap.offset.set(col * (1/3), row * (1/2));
    }


}





