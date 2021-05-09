"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class JudgmentFactory {

    constructor() {

        // Can be perfect, great, good, bad and miss
        this._judgement = this.loadJudgment() ;

        // the banner with combo
        this._combo = this.loadCombo() ;

        // this are the digits.
        [this.normalDigitsObjects, this.missDigitsObjects] = this.loadCount(5) ;

    }

    loadJudgment() {
        let size = 1 ;
        var polygon = new THREE.PlaneGeometry( 6*size , size , 1, 1) ;

        var map = new THREE.TextureLoader().load('stage/Player_Judgment Rank 1x6.png') ;

        // to accurately represent the colors


        map.encoding = THREE.sRGBEncoding;
        map.repeat.set(1,1/6);
        map.offset.set(0,0);

        let material = new THREE.MeshBasicMaterial( { map: map, transparent: true } );


        // So they can meet inbetween.
        material.alphaTest = 0.1;
        material.opacity = 1.0 ;


        return  new THREE.Mesh( polygon, material ) ;
    }

    loadCombo() {
        let size = 1 ;

        // 138/36 because of the resolution of the image
        var polygon = new THREE.PlaneGeometry( 138/36 , 1 , 1, 1) ;

        var map = new THREE.TextureLoader().load('stage/Combo 1x2.png') ;


        map.encoding = THREE.sRGBEncoding;

        map.repeat.set (1,1/2) ;
        map.offset.set (0, 1/2 );

        let material = new THREE.MeshBasicMaterial( { map: map, transparent: true } );


        // So they can meet inbetween.
        material.alphaTest = 0.1;
        material.opacity = 1.0 ;


        return  new THREE.Mesh( polygon, material ) ;
    }


    loadCount(count) {

        this.maxNumDigits = count ;

        this.normalDigits = [] ;
        this.missDigits = [] ;

        let normals = new THREE.Object3D();
        let misses = new THREE.Object3D();

        let normalNumber = this.normalDigits ;
        let missNumber = this.missDigits ;

        this.XsizeDigits = 60/80 ;

        // Due to texture dimensions, the object needs to have aspect ratio 60/80
        var polygon = new THREE.PlaneGeometry( 60/80 , 1 , 1, 1) ;


        // load up textures.
        var mapCombo = new THREE.TextureLoader().load('stage/Combo numbers Normal 4x4.png', function () {
            for ( let number of normalNumber ) {
                number.material.map.image = mapCombo.image ;
                number.material.map.needsUpdate = true ;
            }

        }) ;

        var mapMiss = new THREE.TextureLoader().load('stage/Combo numbers Miss 4x4.png', function () {
            for ( let number of missNumber ) {
                number.material.map.image = mapMiss.image ;
            }
        }) ;

        this.XscaleDigits = 0.8 ;
        // Load <count> number of digits into the arrays; one for each color
        for ( var i = 0 ; i < count ; i++ ) {


            let normal = this.loadNumberMesh(mapCombo, polygon);

            // place them into position
            normal.scale.set( this.XscaleDigits , this.XscaleDigits ) ;
            normal.position.x = i*this.XsizeDigits*normal.scale.x ;
            normalNumber.push(normal) ;
            normals.add(normal) ;

            let miss = this.loadNumberMesh(mapMiss, polygon);
            // miss.position.y = i*Xsize ;
            miss.scale.set(this.XscaleDigits, this.XscaleDigits) ;
            miss.position.x = i*this.XsizeDigits*miss.scale.x ;
            missNumber.push(miss) ;
            misses.add(miss) ;

        }

        normals.position.x -=  (count-1)*this.XsizeDigits*this.XscaleDigits/2 ;
        // normals.position.x = 0 ;

        return [normals, misses] ;

    }

    loadNumberMesh(map, polygon) {
        let number = map.clone() ;

        number.repeat.set (1/4,1/4) ;
        number.offset.set (0, 3/4 );

        let material = new THREE.MeshBasicMaterial( { map: number, transparent: true } );


        material.alphaTest = 0.1;
        material.opacity = 0.0 ;


        return new THREE.Mesh( polygon, material ) ;
    }


    get judgement() {
        return this._judgement;
    }

    get combo() {
        return this._combo;
    }

    updateCombo(color) {

        switch (color) {
            case 'w':
                this._combo.material.map.offset.set(0,1/2) ;
                break ;
            case 'r':
                this._combo.material.map.offset.set(0, 0) ;
                break;

        }
    }

    updateJudgementTexture(grade) {

        switch (grade) {
            case 'p':
                this._judgement.material.map.offset.set(0,5/6) ;
                break ;
            case 'gr':
                this._judgement.material.map.offset.set(0,4/6) ;
                break;
            case 'go':
                this._judgement.material.map.offset.set(0,2/6) ;
                break;
            case 'b':
                this._judgement.material.map.offset.set(0,1/6) ;
                break;
            case 'm':
                this._judgement.material.map.offset.set(0,0) ;
                break;

        }

    }

    updateNormalDigits(currentCombo) {
        const digitsInCount = currentCombo.toString().length ;
        const neededDigits = digitsInCount > 3 ? digitsInCount : 3 ;
        const difference = this.maxNumDigits - neededDigits ;


        // update position of numbers
        this.normalDigitsObjects.position.x = 0 ;
        this.normalDigitsObjects.position.x -= (neededDigits-1)*this.XsizeDigits*this.XscaleDigits/2 + difference*this.XsizeDigits*this.XscaleDigits;

        for ( var i = 0 ; i < neededDigits ; i++ ) {
            const index = this.normalDigits.length - i - 1 ;
            let digit = this.normalDigits[index] ;
            // make sure we show this digits
            const digitValue = Math.floor((currentCombo / Math.pow(10,i)) % 10); // 2

            const [row, col] = this.getCoordinatesForDigit(digitValue) ;
            console.log(index) ;
            digit.material.map.offset.set(col * (1/4), row * (1/4)) ;

        }

        // do not show the remainder digits, using an offset out of the range.
        for ( var i = neededDigits ; i < this.normalDigits.length ; i++ ) {
            const index = this.normalDigits.length - i - 1 ;
            let digit = this.normalDigits[index] ;
            digit.material.map.offset.set(1,1) ;
        }

    }

    getCoordinatesForDigit(digit) {

        const col = digit % 4 ;
        const row = 3 - Math.floor( digit/4 ) ;

        return [row, col] ;

    }

}