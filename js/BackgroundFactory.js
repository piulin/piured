"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class BackgroundFactory {


    constructor(coverPath) {

        let xsize = 20 ;
        let ysize = 12 ;
        var polygon = new THREE.PlaneGeometry( xsize , ysize , 1, 1) ;

        let colorBG = new THREE.Color( 0x0 ) ;


        // Make sure image is finished loading

        // procedural texturing.
        var uniforms = {
            uMaterialColor: { type: "c", value: colorBG },
            uKd: {
                type: "f",
                value: 1.0
            },
            uScale: {
                type: "f",
                value: 50.0
            },
            uThreshold : { type: "f", value: 0.5 },
            curvature : { type: "v2", value : new THREE.Vector2(2.0,1)},
            screenResolution : { type: "v2", value: new THREE.Vector2(500,500)},
            scanLineOpacity: {type: "v2", value : new THREE.Vector2(0.9,1.0) }
        };

        let vs = '';
        readFileContent('shaders/background.vert',function (content) {
            vs = content ;
        }) ;


        let fs = '' ;
        readFileContent('shaders/background.frag', function (content) {
            fs = content;
        }) ;

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs
        });


        this.mesh = new THREE.Mesh( polygon, material );
        this.mesh.position.z = -2 ;
        this.mesh.position.y = -ysize/2 + 4 ;



        const colorThief = new ColorThief();
        // const img = document.querySelector(img);
        const img = new Image();
        let M = this.mesh ;
        img.addEventListener('load', function() {
            let color = colorThief.getColor(img) ;
            console.log(color) ;
            M.material.uniforms.uMaterialColor.value =  new THREE.Color ( color[0]/255.0, color[1]/255.0, color[2]/255.0) ;
        });
        img.src = coverPath ;


    }




}