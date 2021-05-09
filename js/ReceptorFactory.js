"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class ReceptorFactory {


    constructor(noteskinPath) {

        this.noteskinPath = noteskinPath ;

        let receptor_size = 1 ;
        var receptorPolygon = new THREE.PlaneGeometry( 5*receptor_size , receptor_size , 1, 1) ;

        var receptorMap = new THREE.TextureLoader().load(noteskinPath + '/Center Receptor 1x2.PNG') ;

        this.tapGeometry = new THREE.PlaneGeometry( 1 , 1 , 1, 1 ) ;

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



        this.dlTap = this.constructTap(noteskinPath + '/Tap 5x2.PNG', 0) ;
        this.ulTap = this.constructTap(noteskinPath + '/Tap 5x2.PNG', 1/5) ;
        this.cTap = this.constructTap(noteskinPath + '/Tap 5x2.PNG', 2/5) ;
        this.urTap = this.constructTap(noteskinPath + '/Tap 5x2.PNG', 3/5) ;
        this.drTap = this.constructTap(noteskinPath + '/Tap 5x2.PNG', 4/5) ;

    }

    getReceptor() {
        return this.receptorMesh.clone() ;
    }

    getTap(kind) {

        // Create one step out of the five available.
        switch (kind) {
            case 'dl':
                return  this.dlTap.clone() ;
                break ;
            case 'ul':
                return  this.ulTap.clone() ;
                break ;
            case 'c':
                return  this.cTap.clone() ;
                break ;
            case 'ur':
                return  this.urTap.clone() ;
                break ;
            case 'dr':
                return  this.drTap.clone() ;
                break ;
        }

    }

    constructTap(pathToTexture, position) {
        let stepMap = new THREE.TextureLoader().load(pathToTexture) ;


        // to accurately represent the colors
        stepMap.encoding = THREE.sRGBEncoding;

        // This acts as UV mapping.
        stepMap.repeat.set(1/5,1/2);
        stepMap.offset.set( position , 0 );


        let stepMaterial = new THREE.MeshBasicMaterial( { map: stepMap, transparent: true } );


        // So they can meet inbetween.
        stepMaterial.alphaTest = 0.1;


        return new THREE.Mesh( this.tapGeometry, stepMaterial );
    }

    constructExplosion() {

        let explosionMap = new THREE.TextureLoader().load(this.noteskinPath + '/StepFX 5x1.PNG') ;


        // to accurately represent the colors
        explosionMap.encoding = THREE.sRGBEncoding;

        // This acts as UV mapping.
        explosionMap.repeat.set(1/5,1);
        // explosionMap.offset.set( 0 , 0 );
        explosionMap.offset.set( 0 , 0 );

        // explosionMap.blending = THREE.AdditiveBlending ;


        let stepMaterial = new THREE.MeshBasicMaterial( { map: explosionMap, transparent: true } );

        // Augment the brightness of the explosion
        let scale = 1.5 ;

        stepMaterial.color.r = scale ;
        stepMaterial.color.g = scale ;
        stepMaterial.color.b = scale ;

        stepMaterial.blending = THREE.AdditiveBlending ;


        // So they can meet inbetween.
        // stepMaterial.alphaTest = 0.8;


        let explosion =  new THREE.Mesh( this.tapGeometry, stepMaterial );
        explosion.scale.x = 5 ;
        explosion.scale.y = 5 ;

        return explosion ;
    }



}