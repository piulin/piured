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

        // let song = new Song('songs/bc/dp.ssc');
        // let song = new Song('songs/wdurw/A11 - What Do You Really Want.ssc'); // 7
        // let song = new Song('songs/cd/B19 - Canon-D.ssc'); // 6
        // let song = new Song('songs/wotw/712 - Will O The Wisp.ssc'); //6
        // let song = new Song('songs/h/B02 - Hot.ssc'); //5
        // let song = new Song('songs/pd/A20 - Power of Dreams.ssc');
        // let song = new Song('songs/pma/A05 - Pump Me Amadeus.ssc'); // 8
        let song = new Song('songs/bc/105 - Black Cat.ssc'); // 5
        song.play() ;

        // this.composer = new Composer(song, 'noteskins/EXCEED2-OLD/HD/' ,1);
        // this.composer = new Composer(song, 'noteskins/PREMIERE/HD/' ,2);
        this.composer = new Composer(song, 'noteskins/NXA/HD/' ,4);

        // Get the steps and receptor in position
        let [steps, receptor] = this.composer.run(5) ;

        this.scene.add(steps) ;
        this.scene.add(receptor) ;


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