"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class Engine {

    _updateList = [] ;
    _inputList = [] ;
    _onKeyDownList = [] ;
    _onKeyUpList = [] ;
    _onTouchDownList = [] ;
    _onTouchUpList = [] ;
    _id ;
    song ;
    stage ;
    scene ;
    clock ;
    camera ;
    renderer ;
    stageCleared = undefined ;
    containerId ;

    //public

    constructor() {

        this.clock = new THREE.Clock();

        // For grading the window is fixed in size; here's general code:
        var canvasWidth = window.innerWidth;
        var canvasHeight = window.innerHeight;
        var canvasRatio = canvasWidth / canvasHeight;
        // scene
        this.scene = new THREE.Scene();

        // Camera: Y up, X right, Z up

        this.camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 ) ;

        //camera = new THREE.OrthographicCamera(windowWidth/-2, windowWidth/2, windowHeight/2, windowHeight/-2, 0, 40);

        this.camera.position.x = 0;
        this.camera.position.y = -3;
        this.camera.position.z = 10;

        // This way, the X axis increases to the right, the Z axis increases to the bottom, and the Y axis in pointing directly
        // towards the camera.


        this.camera.up = new THREE.Vector3(0,1,0) ;


        this.renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: false});
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.gammaInput = true;

        this.renderer.gammaOutput = true;
        // Important for HiDPI devices.


        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( canvasWidth, canvasHeight );
        // this.renderer.setClearColor(new THREE.Color(0xffffff));

        this.renderer.setClearColor(new THREE.Color(0x000000));

        // this.cameraControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        // this.cameraControls.target = focus ;
        // this.camera.lookAt(focus);
        // this.stats = this.createStats();
        // document.body.appendChild( this.stats.domElement );

        // document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );



    }

    showGrids() {
        // Background grid and axes. Grid step size is 1, axes cross at 0, 0
        Coordinates.drawGrid({size:100,scale:1,orientation:"z", scene: this.scene});
        Coordinates.drawAxes({axisLength:11,axisOrientation:"x",axisRadius:0.04});
        Coordinates.drawAxes({axisLength:11,axisOrientation:"z",axisRadius:0.04});
    }

    updateOffset(stageId, newOffsetOffset) {

        this.stage.updateOffset(stageId, newOffsetOffset) ;

    }

    tunePlayBackSpeed ( playBackSpeedOffset ) {

        this.playBackSpeed += playBackSpeedOffset ;
        if (this.playBackSpeed < 0) {
            this.playBackSpeed = 0.0 ;
        }
        this.song.setNewPlayBackSpeed( this.playBackSpeed ) ;
        this.stage.setNewPlayBackSpeed( this.playBackSpeed ) ;

    }

    keyDown(event) {
        for (let i = 0 ; i < this._onKeyDownList.length ; i++ ) {
            this._onKeyDownList[i].onKeyDown(event) ;
        }
    }

    keyUp(event) {
        for (let i = 0 ; i < this._onKeyUpList.length ; i++ ) {
            this._onKeyUpList[i].onKeyUp(event) ;
        }
    }

    touchDown(event) {
        for (let i = 0 ; i < this._onTouchDownList.length ; i++ ) {
            this._onTouchDownList[i].onTouchDown(event) ;
        }
    }

    touchUp(event) {
        for (let i = 0 ; i < this._onTouchUpList.length ; i++ ) {
            this._onTouchUpList[i].onTouchUp(event) ;
        }
    }

    addToDOM(containerId) {
        this.containerId = containerId ;
        let container = document.getElementById( containerId );
        container.appendChild( this.renderer.domElement );
    }

    configureStage( SSCFile, audioFile, playBackSpeed, offset, noteskin ) {

        this.playBackSpeed = playBackSpeed ;
        this.song = new Song(SSCFile, audioFile, offset, playBackSpeed);
        let resourceManager = new ResourceManager('noteskins/' + noteskin + '/UHD', 'stage_UHD') ;
        this.stage = new Stage(resourceManager, this.song) ;
        engine.addToUpdateList(this.stage) ;
        this.scene.add(this.stage.object) ;

    }

    addPlayer( playerConfig ) {
        this.stage.addPlayerStage( playerConfig, this.playBackSpeed ) ;
    }

    setCameraPosition( X,Y,Z ) {
        this.camera.position.x = X;
        this.camera.position.y = Y;
        this.camera.position.z = Z;
    }

    queryStageType(level) {
        return this.song.getLevelStyle(level) ;
    }

    start ( ) {

        this.performReady() ;

        this.song.play() ;

        this.animate();
    }

    stop ( ) {

        this.removeFromDOM() ;

        this.freeEngineResources() ;

        let performances = this.stage.retrievePerformancePlayerStages() ;

        if (this.stageCleared !== undefined ) {
            this.stageCleared( performances ) ;
        }



    }

    //private

    // set new canvas size
    onWindowResize ( ) {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    addToUpdateList(gameObject) {
        this._updateList.push(gameObject) ;
    }

    addToInputList(gameObject) {
        this._inputList.push(gameObject) ;
    }

    addToKeyUpList(gameObject) {
        this._onKeyUpList.push(gameObject) ;
    }

    addToKeyDownList(gameObject) {
        this._onKeyDownList.push(gameObject) ;
    }

    addToTouchUpList(gameObject) {
        this._onTouchUpList.push(gameObject) ;
    }

    addToTouchDownList(gameObject) {
        this._onTouchDownList.push(gameObject) ;
    }

    createStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0';
        stats.domElement.style.top = '0';
        return stats;
    }

    removeFromDOM() {
        let container = document.getElementById( this.containerId );
        container.removeChild( this.renderer.domElement );
    }

    setAllCulled(obj, culled) {
        obj.frustumCulled = culled;
        obj.children.forEach(child => this.setAllCulled(child, culled));
    }

    performReady() {
        for (var i = 0 ; i < this._updateList.length ; i++ ) {
            this._updateList[i].ready() ;
        }
    }

    animate() {
        //Note that .bind(this) is important so it doesnt lose the local context.
        this._id = window.requestAnimationFrame(this.animate.bind(this));
        this.render();

    }

    freeEngineResources() {

        cancelAnimationFrame(this._id) ;

        this.renderer.dispose()


        const cleanMaterial = material => {
            material.dispose()

            // dispose textures
            for (const key of Object.keys(material)) {
                const value = material[key]
                if (value && typeof value === 'object' && 'minFilter' in value) {
                    value.dispose()
                }
            }
        }

        this.scene.traverse(object => {
            if (!object.isMesh) return
            object.geometry.dispose()

            if (object.material.isMaterial) {
                cleanMaterial(object.material)
            } else {
                // an array of materials
                for (const material of object.material) cleanMaterial(material)
            }
        })
    }

    render() {

        // It is the amount of time since last call to render.
        const delta = this.clock.getDelta();


        for (var i = 0 ; i < this._inputList.length ; i++ ) {
            this._inputList[i].input() ;
        }

        // Update position of the steps
        for (var i = 0 ; i < this._updateList.length ; i++ ) {
            this._updateList[i].update(delta) ;
        }

        // for tweening the judgments.
        TWEEN.update();

        // this.cameraControls.update(delta);
        this.renderer.render(this.scene, this.camera);
        // this.stats.update();
    }


}