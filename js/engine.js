"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class Engine {


    _updateList = [] ;
    _inputList = [] ;

    constructor() {

        this.clock = new THREE.Clock();

        // For grading the window is fixed in size; here's general code:
        var canvasWidth = window.innerWidth;
        var canvasHeight = window.innerHeight;
        var canvasRatio = canvasWidth / canvasHeight;
        // scene
        this.scene = new THREE.Scene();

        // Camera: Y up, X right, Z up

        this.camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 4000 ) ;

        //camera = new THREE.OrthographicCamera(windowWidth/-2, windowWidth/2, windowHeight/2, windowHeight/-2, 0, 40);

        var focus = new THREE.Vector3( 0,-3,0 );
        this.camera.position.x = 0;
        this.camera.position.y = focus.y;
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

        this.cameraControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.cameraControls.target = focus ;
        // this.camera.lookAt(focus);
        this.stats = this.createStats();
        document.body.appendChild( this.stats.domElement );

    }



    addToUpdateList(gameObject) {
        this._updateList.push(gameObject) ;
    }

    addToInputList(gameObject) {
        this._inputList.push(gameObject) ;
    }

    createStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0';
        stats.domElement.style.top = '0';
        return stats;
    }

    addToDOM() {
        var container = document.getElementById('container');
        var canvas = container.getElementsByTagName('canvas');
        if (canvas.length>0) {
            container.removeChild(canvas[0]);
        }
        container.appendChild( this.renderer.domElement );
    }

    start ( songPath, audioBuf,  level, speed, offset, noteskin) {


        let resourceManagerL = new ResourceManager('noteskins/' + noteskin + '/UHD', 'stage_UHD') ;
        // let resourceManagerR = new ResourceManager('noteskins/NX/HD', 'stage') ;

        // let song = new Song('songs/bc/dp.ssc');
        // let song = new Song('songs/wdurw/A11 - What Do You Really Want.ssc'); // 7, 14
        // let song = new Song('songs/fl/103 - Forever Love.ssc'); // 7
        // let song = new Song('songs/s/B18 - Solitary 2.ssc'); // 6
        // let song = new Song('songs/cd/B19 - Canon-D.ssc'); // 6
        // let song = new Song('songs/wotw/712 - Will O The Wisp.ssc'); //6, -2
        // let song = new Song('songs/d/1013 - Destination.ssc'); //5,
        // let song = new Song('songs/h/B02 - Hot.ssc'); //5
        // let song = new Song('songs/bblbr/A16 - Ba Be Loo Be Ra.ssc'); //3
        // let song = new Song('songs/mf/A03 - Monkey Fingers.ssc'); //4
        // let song = new Song('songs/or/401 - Oh! Rosa.ssc'); //6
        // let song = new Song('songs/liadg/C04 - Love is a Danger Zone 2.ssc'); //4
        // let song = new Song('songs/pd/A20 - Power of Dreams.ssc',keyBoardLag); //5
        // let song = new Song('songs/pma/A05 - Pump Me Amadeus.ssc'); // 8
        // let song = new Song('songs/bc/105 - Black Cat.ssc'); // 5, -3
        // let song = new Song('songs/e/C08 - Emergency.ssc'); // 4 //TODO: fails -3
        this.song = new Song(songPath, audioBuf, offset); // 5, 8
        // let song = new Song('songs/c/1101 - Cleaner.ssc'); // 5
        // let song = new Song('songs/cm/1547 - Chase Me - Dreamcatcher.ssc'); // 5 -3
        // let song = new Song('songs/cw/911 - Chicken Wing.ssc', keyBoardLag); // 10
        // let song = new Song('songs/st/906 - Starian.ssc'); // 7
        // let song = new Song('songs/pzo/1431 - Point Zero One.ssc'); // 7


        let levels = [level];
        // let levels = [14] ;
        let speeds = [speed] ;
        // let resourceManagers = [resourceManagerL,resourceManagerR] ;

        let stage = new Stage(resourceManagerL, this.song, levels, speeds) ;

        engine.addToUpdateList(stage) ;


        this.scene.add(stage.object) ;

        this.performReady() ;

        this.song.play() ;


        // Display 3d grids.
        this.showGrids() ;

        // // display 3D axis.
        // const axesHelper = new THREE.AxisHelper(5) ;
        // this.scene.add(axesHelper) ;

        // Main loop.
        this.addToDOM();
        this.animate();
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
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
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

        this.cameraControls.update(delta);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    showGrids() {
        // Background grid and axes. Grid step size is 1, axes cross at 0, 0
        // Coordinates.drawGrid({size:100,scale:1,orientation:"z", scene: this.scene});
        // Coordinates.drawAxes({axisLength:11,axisOrientation:"x",axisRadius:0.04});
        // Coordinates.drawAxes({axisLength:11,axisOrientation:"z",axisRadius:0.04});
    }

    updateOffset(newOffsetOffset) {

        this.song.updateSyncTime(newOffsetOffset) ;

    }


}