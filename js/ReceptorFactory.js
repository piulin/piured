"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class ReceptorFactory {

    constructor(noteskinPath) {

        let receptor_size = 1 ;
        var receptorPolygon = new THREE.PlaneGeometry( 5*receptor_size , receptor_size , 1, 1) ;

        var receptorMap = new THREE.TextureLoader().load(noteskinPath + '/Center Receptor 1x2.PNG') ;


        // to accurately represent the colors
        receptorMap.encoding = THREE.sRGBEncoding;

        receptorMap.repeat.set(1,1/2);
        receptorMap.offset.set(0,1/2);


        // document.getElementById(shadertype).textContent;

        // for the shader.
        var uniforms = {
            textureReceptor: { type: "t", value: receptorMap },
            activeColorContribution : { type: "f" , value: 0.0 }
        };


        // let vs = document.getElementById('vertex').textContent;
        let vs = '';
        readFileContent('shaders/receptor.vert',function (content) {
            vs = content ;
        })
        // let fs = document.getElementById('fragment').textContent;
        let fs = '' ;
        readFileContent('shaders/receptor.frag', function (content) {
            fs = content;
        })

        var receptorMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs
        });

        receptorMaterial.alphaTest = 0.01 ;

        this.receptorMesh = new THREE.Mesh( receptorPolygon, receptorMaterial );



    }

    getReceptor() {
        return this.receptorMesh.clone() ;
    }



}