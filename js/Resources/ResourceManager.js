"use strict" ;


class ResourceManager {


    _materialsDict = { } ;
    _geometryDict = { } ;
    _textureDict = { } ;
    _shadersDict =  { } ;


    constructor( noteskinPath, stagePath ) {

        this.loadGeometries() ;
        this.loadTextures(noteskinPath, stagePath) ;
        this.loadMaterials() ;
        this.loadShaderMaterials() ;

    }


    loadGeometries() {
        // Geometries
        this._geometryDict['B'] = new BackgroundGeometry() ;
        this._geometryDict['C'] = new ComboGeometry() ;
        this._geometryDict['D'] = new DigitGeometry() ;
        this._geometryDict['S'] = new StepGeometry() ;
        this._geometryDict['J'] = new JudgmentGeometry() ;
        this._geometryDict['R'] = new ReceptorGeometry() ;
    }

    loadTextures ( noteskinPath, stagePath ) {

        // StepNotes
        this._textureDict['SDL'] = new PNGTexture(noteskinPath + '/DownLeft TapNote 3x2.PNG') ;
        this._textureDict['SUL'] = new PNGTexture(noteskinPath + '/UpLeft TapNote 3x2.PNG') ;
        this._textureDict['SC'] = new PNGTexture(noteskinPath + '/Center TapNote 3x2.PNG') ;
        this._textureDict['SUR'] = new PNGTexture(noteskinPath + '/UpRight TapNote 3x2.PNG') ;
        this._textureDict['SDR'] = new PNGTexture(noteskinPath + '/DownRight TapNote 3x2.PNG') ;


        //Holds & EndNotes
        this._textureDict['HDL'] = new PNGTexture(noteskinPath + '/DownLeft Hold 6x1.PNG') ;
        this._textureDict['HUL'] = new PNGTexture(noteskinPath + '/UpLeft Hold 6x1.PNG') ;
        this._textureDict['HC'] = new PNGTexture(noteskinPath + '/Center Hold 6x1.PNG') ;
        this._textureDict['HUR'] = new PNGTexture(noteskinPath + '/UpRight Hold 6x1.PNG') ;
        this._textureDict['HDR'] = new PNGTexture(noteskinPath + '/DownRight Hold 6x1.PNG') ;

        //Receptor
        this._textureDict['R'] = new PNGTexture(noteskinPath + '/Center Receptor 1x2.PNG') ;

        //Taps
        this._textureDict['T'] = new PNGTexture(noteskinPath + '/Tap 5x2.PNG') ;

        // FX
        this._textureDict['FX'] = new PNGTexture(noteskinPath + '/StepFX 5x1.PNG') ;


        // Digits Normal
        this._textureDict['DN'] = new PNGTexture(stagePath + '/Combo numbers Normal 4x4.png') ;

        // Digits Miss
        this._textureDict['DM'] = new PNGTexture(stagePath + '/Combo numbers Miss 4x4.png') ;

        // Combo
        this._textureDict['C'] = new PNGTexture(stagePath + '/Combo 1x2.png') ;

        // Judgment
        this._textureDict['J'] = new PNGTexture(stagePath + '/Player_Judgment Rank 1x6.png') ;

    }

    loadMaterials() {

        // StepNotes
        this._materialsDict['SDL'] = new TransparentMaterial(this._textureDict['SDL'].map) ;
        this._materialsDict['SUL'] =  new TransparentMaterial(this._textureDict['SUL'].map) ;
        this._materialsDict['SC'] =  new TransparentMaterial(this._textureDict['SC'].map) ;
        this._materialsDict['SUR'] =  new TransparentMaterial(this._textureDict['SUR'].map) ;
        this._materialsDict['SDR'] =  new TransparentMaterial(this._textureDict['SDR'].map) ;


        //Holds & EndNotes
        this._materialsDict['HDL'] = new TransparentMaterial(this._textureDict['HDL'].map) ;
        this._materialsDict['HUL'] =  new TransparentMaterial(this._textureDict['HUL'].map) ;
        this._materialsDict['HC'] = new TransparentMaterial(this._textureDict['HC'].map) ;
        this._materialsDict['HUR'] = new TransparentMaterial(this._textureDict['HUR'].map) ;
        this._materialsDict['HDR'] = new TransparentMaterial(this._textureDict['HDR'].map) ;


    }

    loadShaderMaterials() {
        // Background
        this._shadersDict['B'] = new BackgroundMaterial() ;

    }


    constructStepNote(kind) {
        switch (kind) {
            case 'dl':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['SDL'].material );
                break ;
            case 'ul':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['SUL'].material );
                break ;
            case 'c':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['SC'].material );
                break ;
            case 'ur':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['SUR'].material );
                break ;
            case 'dr':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['SDR'].material );
                break ;
        }
    }


    constructBackground() {
        return new THREE.Mesh( this._geometryDict['B'].backgroundGeometry,
            this._shadersDict['B'].material );
    }

    constructGenericTap() {
        let tex = this._textureDict['T'].cloneMap() ;
        return new THREE.Mesh( this._geometryDict['S'].stepGeometry,
            new TransparentMaterial(tex).material );
    }

    constructGenericWhiteTap() {
        let tex = this._textureDict['T'].cloneMap() ;
        return new THREE.Mesh( this._geometryDict['S'].stepGeometry,
            new AdditiveMaterial(tex).material );
    }

    constructStepBounce(kind) {
        switch (kind) {
            case 'dl':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(this._textureDict['SDL'].cloneMap()).material );
                break ;
            case 'ul':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(this._textureDict['SUL'].cloneMap()).material );
                break ;
            case 'c':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(this._textureDict['SC'].cloneMap()).material );
                break ;
            case 'ur':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(this._textureDict['SUR'].cloneMap()).material );
                break ;
            case 'dr':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(this._textureDict['SDR'].cloneMap()).material );
                break ;
        }
    }

    constructHoldExtensible(kind) {
        switch (kind) {
            case 'dl':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['HDL'].material );
                break ;
            case 'ul':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['HUL'].material );
                break ;
            case 'c':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['HC'].material );
                break ;
            case 'ur':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['HUR'].material );
                break ;
            case 'dr':
                return  new THREE.Mesh( this._geometryDict['S'].stepGeometry, this._materialsDict['HDR'].material );
                break ;
        }
    }

    constructJudgmentBanner() {

        let tex = this._textureDict['J'].cloneMap() ;
        return new THREE.Mesh( this._geometryDict['J'].judgmentGeometry,
            new TransparentMaterial(tex).material );

    }

    constructCombo() {
        return new THREE.Mesh( this._geometryDict['C'].comboGeometry,
            new TransparentMaterial(this._textureDict['C'].cloneMap()).material );
    }

    constructDigit() {
        return new THREE.Mesh( this._geometryDict['D'].digitGeometry,
            new TransparentMaterial(this._textureDict['DN'].cloneMap()).material );
    }

    constructHoldEndNote(kind) {

        let texture = this.getHoldExtensibleTextureCloned(kind) ;

        return new THREE.Mesh( this._geometryDict['S'].stepGeometry, new TransparentMaterial(texture).material );
    }

    constructReceptor() {

        let texture = this._textureDict['R'].cloneMap() ;

        return  new THREE.Mesh( this._geometryDict['R'].receptorGeometry, new ReceptorMaterial(texture).material );

    }

    constructExplosion( ) {
        return new THREE.Mesh( this._geometryDict['S'].stepGeometry,
            new AdditiveMaterial(this._textureDict['FX'].cloneMap()).material );


    }


    getStepNoteTexture(kind) {

        let texture ;

        switch (kind) {
            case 'dl':
                texture = this._textureDict['SDL'].map ;
                break ;
            case 'ul':
                texture = this._textureDict['SUL'].map ;
                break ;
            case 'c':
                texture = this._textureDict['SC'].map ;
                break ;
            case 'ur':
                texture = this._textureDict['SUR'].map ;
                break ;
            case 'dr':
                texture = this._textureDict['SDR'].map ;
                break ;
        }

        return texture ;
    }

    getHoldExtensibleTexture(kind) {

        let texture ;

        switch (kind) {
            case 'dl':
                texture = this._textureDict['HDL'].map ;
                break ;
            case 'ul':
                texture = this._textureDict['HUL'].map ;
                break ;
            case 'c':
                texture = this._textureDict['HC'].map ;
                break ;
            case 'ur':
                texture = this._textureDict['HUR'].map ;
                break ;
            case 'dr':
                texture = this._textureDict['HDR'].map ;
                break ;
        }
        return texture ;
    }

    getHoldExtensibleTextureCloned(kind) {

        let texture ;

        switch (kind) {
            case 'dl':
                texture = this._textureDict['HDL'].cloneMap() ;
                break ;
            case 'ul':
                texture = this._textureDict['HUL'].cloneMap() ;
                break ;
            case 'c':
                texture = this._textureDict['HC'].cloneMap() ;
                break ;
            case 'ur':
                texture = this._textureDict['HUR'].cloneMap() ;
                break ;
            case 'dr':
                texture = this._textureDict['HDR'].cloneMap() ;
                break ;
        }
        return texture ;
    }

}