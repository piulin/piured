"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Draw a Square Exercise
// Your task is to complete the function square (at line 28).
// The function takes 4 arguments - coordinates x1, y1, x2, y2
// for the square and returns a geometry object (THREE.Geometry())
// that defines a square at the provided coordinates.
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document*/
var camera, scene, renderer;
var windowScale;
var cameraControls;
var clock = new THREE.Clock();
var stats;

function exampleTriangle() {
	// This code demonstrates how to draw a triangle
	var triangle = new THREE.BufferGeometry();
	triangle.vertices.push( new THREE.Vector3( 3, 3, 0 ) );

	triangle.faces.push( new THREE.Face3( 0, 1, 2 ) );

	return triangle;
}

function drawSquare(x1, y1, x2, y2) {

	var square = new THREE.BufferGeometry() ;
	// Your code goes here
	square.vertices.push( new THREE.Vector3( x1, y1, 0) ) ;
	square.vertices.push( new THREE.Vector3( x1, y2, 0) ) ;
	square.vertices.push( new THREE.Vector3( x2, y1, 0) ) ;
	square.vertices.push( new THREE.Vector3( x2, y2, 0) ) ;

	square.faces.push( new THREE.Face3(0,1,2) ) ;
	square.faces.push( new THREE.Face3(3,1,2) ) ;
	// don't forget to return the geometry!	The following line is required!
	return square;
}



function createReceptor(receptor_size, texturePath, flip=false) {


	var myPolygon = new THREE.PlaneGeometry( receptor_size , receptor_size , 1, 1) ;
	var myTexture = new THREE.TextureLoader().load(texturePath) ;
	// var myTexture = THREE.ImageUtils.loadTexture(texturePath) ;
	myTexture.magFilter = THREE.NearestFilter ;
	myTexture.wrapS = myTexture.wrapT = THREE.MirroredRepeatWrapping;

	// This acts as UV mapping.
	myTexture.repeat.set(1,1/3);

	if ( flip ) {
		myTexture.offset.set( -1, 2/3 );
	} else {
		myTexture.offset.set( 0, 2/3 );
	}


	myTexture.needsUpdate = true;
	var myPolygonMaterial = new THREE.MeshBasicMaterial( { map: myTexture, transparent: true } );
	myPolygonMaterial.alphaTest = 0.1;
	var polygonObject = new THREE.Mesh( myPolygon, myPolygonMaterial );

	return polygonObject;

}



function createReceptors() {



	//let receptors = new THREE.Object3D();

	let receptor_size = 1 ;
	var receptorPolygon = new THREE.PlaneGeometry( 5*receptor_size , receptor_size , 1, 1) ;
	var receptorMap = new THREE.TextureLoader().load('piunoteskins-master/EXCEED2-OLD/HD/Center ReceptorFactory 1x2.PNG') ;
	// var myTexture = THREE.ImageUtils.loadTexture(texturePath) ;
	// receptorMap.magFilter = THREE.NearestFilter ;
	receptorMap.repeat.set(1,1/2);
	receptorMap.offset.set(0,1/2);

	var receptorMaterial = new THREE.MeshBasicMaterial( { map: receptorMap, transparent: true } );

	var receptorMesh = new THREE.Mesh( receptorPolygon, receptorMaterial );
	//myTexture.wrapS = myTexture.wrapT = THREE.MirroredRepeatWrapping;

	//
	//
	//
	// let left_edge_distance = 0.05;
	//
	//
	//
	// // Create receptor tiles.
	// let downLeft = createReceptor(receptor_size, 'noteskins/nxa/DownLeft Ready ReceptorFactory 1x3.png');
	// let downRight = createReceptor(receptor_size, 'noteskins/nxa/DownLeft Ready ReceptorFactory 1x3.png', true);
	// let upRight = createReceptor(receptor_size,'noteskins/nxa/UpLeft Ready ReceptorFactory 1x3.png', true);
	// let upLeft = createReceptor(receptor_size,'noteskins/nxa/UpLeft Ready ReceptorFactory 1x3.png');
	// let center = createReceptor(receptor_size,'noteskins/nxa/Center Ready ReceptorFactory 1x3.png');
	//
	//
	//
	// //Position them in place
	// downLeft.position.x = receptor_size / 2 ;
	// downLeft.position.y = receptor_size / 2 - 0.095;
	//
	// upLeft.position.x = 1 + receptor_size / 2 - 0.25;
	// upLeft.position.y = receptor_size / 2 -  0.063;
	// upLeft.position.z = -0.01;
	//
	// center.position.x = 2 + receptor_size / 2;
	// center.position.y = receptor_size / 2;
	//
	// upRight.position.x = 3 + receptor_size / 2;
	// upRight.position.y = receptor_size / 2;
	//
	// downRight.position.x = 4 + receptor_size / 2;
	// downRight.position.y = receptor_size / 2;
	//
	// //flip
	//
	//
	// receptors.add(downLeft) ;
	// receptors.add(upLeft) ;
	// receptors.add(center) ;
	// receptors.add(upRight) ;
	// receptors.add(downRight) ;

	return receptorMesh;
}

function createArrow(arrowTexturePath) {
	var myPolygon = new THREE.PlaneGeometry( 1 , 1 , 1, 1) ;
	var myTexture = new THREE.TextureLoader().load(arrowTexturePath) ;
	// This acts as UV mapping.
	myTexture.repeat.set(1/3,1/2);
	// myTexture.offset.set( -1, 2/3 );



	myTexture.needsUpdate = true;
	var myPolygonMaterial = new THREE.MeshBasicMaterial( { map: myTexture, transparent: true } );
	myPolygonMaterial.alphaTest = 0.1;
	var polygonObject = new THREE.Mesh( myPolygon, myPolygonMaterial );

	return polygonObject;
}

function createStats() {
	var stats = new Stats();
	stats.setMode(0);

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';

	return stats;
}



function init() {
	console.log(THREE.version);
	// Set up some parameters
	var canvasWidth = 1920/4;
	var canvasHeight = 1080/4;
	// For grading the window is fixed in size; here's general code:
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;
	// scene
	scene = new THREE.Scene();

	// Camera: Y up, X right, Z up
	windowScale = 20;
	var windowWidth = windowScale * canvasRatio;
	var windowHeight = windowScale;

	camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 40 ) ;

	//camera = new THREE.OrthographicCamera(windowWidth/-2, windowWidth/2, windowHeight/2, windowHeight/-2, 0, 40);

	var focus = new THREE.Vector3( 0,0,0 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 5;

	// This way, the X axis increases to the right, the Z axis increases to the bottom, and the Y axis in pointing directly
	// towards the camera.

	camera.up = new THREE.Vector3(0,1,0) ;
	camera.lookAt(focus);


	renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor(new THREE.Color(0xffffff));

	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

	stats = createStats();
	document.body.appendChild( stats.domElement );
}

function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function showGrids() {
	// Background grid and axes. Grid step size is 1, axes cross at 0, 0
	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
	// Coordinates.drawAxes({axisLength:11,axisOrientation:"x",axisRadius:0.04});
	// Coordinates.drawAxes({axisLength:11,axisOrientation:"z",axisRadius:0.04});
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}
function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(scene, camera);
	stats.update();
}


try {
	init();
	showGrids();

	scene.add(createReceptors());
	// scene.add(createArrow('piunoteskins-master/EXCEED2-OLD/HD/Center TapNote 3x2.PNG'))
	// let UpLeftArrow = createArrow('piunoteskins-master/EXCEED2-OLD/HD/UpLeft TapNote 3x2.PNG');
	// UpLeftArrow.position.x = -(4/5 - 0.02);
	// scene.add(UpLeftArrow);
	//
	// let DownLeftArrow = createArrow('piunoteskins-master/EXCEED2-OLD/HD/DownLeft TapNote 3x2.PNG');
	// DownLeftArrow.position.x = -2*(4/5 - 0.02);
	// scene.add(DownLeftArrow);


	const axesHelper = new THREE.AxisHelper(5) ;
	scene.add(axesHelper) ;

	addToDOM();
	animate();

} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}

