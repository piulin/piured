"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class Engine {


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


        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true});
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

    start ( ) {


        const keyBoardLag = 0.06 ;
        // const keyBoardLag = 0.00 ;

        // let song = new Song('songs/bc/dp.ssc');
        // let song = new Song('songs/wdurw/A11 - What Do You Really Want.ssc'); // 7, 14
        // let song = new Song('songs/fl/103 - Forever Love.ssc'); // 7
        // let song = new Song('songs/s/B18 - Solitary 2.ssc'); // 6
        // let song = new Song('songs/cd/B19 - Canon-D.ssc'); // 6
        // let song = new Song('songs/wotw/712 - Will O The Wisp.ssc', keyBoardLag); //6, -2
        // let song = new Song('songs/h/B02 - Hot.ssc', keyBoardLag); //5
        // let song = new Song('songs/bblbr/A16 - Ba Be Loo Be Ra.ssc', keyBoardLag); //3
        // let song = new Song('songs/mf/A03 - Monkey Fingers.ssc', keyBoardLag); //4
        // let song = new Song('songs/or/401 - Oh! Rosa.ssc', keyBoardLag); //6
        // let song = new Song('songs/liadg/C04 - Love is a Danger Zone 2.ssc'); //4
        // let song = new Song('songs/pd/A20 - Power of Dreams.ssc',keyBoardLag); //5
        // let song = new Song('songs/pma/A05 - Pump Me Amadeus.ssc', keyBoardLag); // 8
        // let song = new Song('songs/bc/105 - Black Cat.ssc', keyBoardLag); // 5, -3
        // let song = new Song('songs/e/C08 - Emergency.ssc', keyBoardLag); // 4 //TODO: fails -3
        // let song = new Song('songs/kos/1665 - Norazo - King of Sales.ssc', keyBoardLag); // 5, 8
        // let song = new Song('songs/c/1101 - Cleaner.ssc', keyBoardLag); // 5
        let song = new Song('songs/cm/1547 - Chase Me - Dreamcatcher.ssc', keyBoardLag); // 5
        // let song = new Song('songs/cw/911 - Chicken Wing.ssc', keyBoardLag); // 10
        // let song = new Song('songs/st/906 - Starian.ssc', keyBoardLag); // 7
        song.play() ;

        this.composer = new Composer(song, 'noteskins/EXCEED2-OLD/HD/' ,3, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/NX/HD/' ,3, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/PREMIERE/HD/' ,8, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/NXA/HD/' ,8, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/NX2/HD/' ,2, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/PRIME/HD/' ,3, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/FIESTAEX-BASIC/HD/' ,5, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/FIESTA2/HD/' ,3, keyBoardLag);
        // this.composer = new Composer(song, 'noteskins/ZERO-POKER/HD/' ,5, keyBoardLag);

        // Get the steps and receptor in position
        let playerCourse = this.composer.composeStage(song.levels.length - 3) ;

        this.scene.add(playerCourse) ;


        // Display 3d grids.
        this.showGrids() ;

        // display 3D axis.
        const axesHelper = new THREE.AxisHelper(5) ;
        this.scene.add(axesHelper) ;


        // Main loop.
        this.addToDOM();
        this.animate();
    }

    animate() {
        //Note that .bind(this) is important so it doesnt lose the local context.dddddddd
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
    render() {

        // It is the amount of time since last call to render.
        var delta = this.clock.getDelta();

        // for tweening the judgments.
        TWEEN.update();

        // Update position of the steps
        this.composer.update(delta) ;

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


}