'use strict' ;

class ReceptorMaterial {


    _material ;

    constructor(map) {


        const uniforms = {
            textureReceptor: {type: "t", value: map},
            activeColorContribution: {type: "f", value: 0.0}
        };


        let vs = '';
        readFileContent('shaders/receptor.vert', function (content) {
            vs = content;
        })

        let fs = '';
        readFileContent('shaders/receptor.frag', function (content) {
            fs = content;
        })

        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs
        });

    }


    get material() {
        return this._material;
    }
}