'use strict' ;


class BackgroundMaterial {


    _material ;


    constructor( ) {

        let colorBG = new THREE.Color( 0x334455 ) ;

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

        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs
        });


        // // color picker
        // const colorThief = new ColorThief();
        //
        //
        // const img = new Image();
        // let M = this._material ;
        //
        // // Make sure image is finished loading
        // img.addEventListener('load', function() {
        //     let color = colorThief.getColor(img) ;
        //     console.log(color) ;
        //     M.uniforms.uMaterialColor.value =  new THREE.Color ( color[0]/255.0, color[1]/255.0, color[2]/255.0) ;
        // });
        //
        // img.src = coverPath ;

    }


    get material() {
        return this._material;
    }
}