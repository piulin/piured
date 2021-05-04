"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class ReceptorFactory {

    constructor(noteskinPath) {

            let receptor_size = 1 ;
            var receptorPolygon = new THREE.PlaneGeometry( 5*receptor_size , receptor_size , 1, 1) ;

            var receptorMap = new THREE.TextureLoader().load(noteskinPath + '/Center Receptor 1x2.PNG') ;
            // var myTexture = THREE.ImageUtils.loadTexture(texturePath) ;
            // receptorMap.magFilter = THREE.NearestFilter ;
            receptorMap.repeat.set(1,1/2);
            receptorMap.offset.set(0,1/2);

            var receptorMaterial = new THREE.MeshBasicMaterial( { map: receptorMap, transparent: true } );

            var receptorMesh = new THREE.Mesh( receptorPolygon, receptorMaterial );
            //myTexture.wrapS = myTexture.wrapT = THREE.MirroredRepeatWrapping;
            this.receptorMesh = receptorMesh;

    }

    getReceptor() {
        return this.receptorMesh.clone();
    }


}