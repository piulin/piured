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

        receptorMaterial.alphaTest = 0.1 ;

        this.receptorMesh = new THREE.Mesh( receptorPolygon, receptorMaterial );



        this.clonedTapMaps = [] ;
        let ctms = this.clonedTapMaps ;
        let tapMap = new THREE.TextureLoader().load(this.noteskinPath + '/Tap 5x2.PNG', function () {
            for ( var m of ctms) {
                m.image = tapMap.image ;
                m.needsUpdate = true ;
            }
        }) ;
        this.tapMap = tapMap ;



        // save it for later. This uses a lot of memory I guess.
        this.clonedExplosionMaps = [] ;
        let clem = this.clonedExplosionMaps ;
        let explosionMap = new THREE.TextureLoader().load(this.noteskinPath + '/StepFX 5x1.PNG', function () {
            for ( var m of clem) {
                    m.image = explosionMap.image ;
                    m.needsUpdate = true ;
                }
        }) ;
        this.explosionMap = explosionMap ;

    }

    getReceptor() {
        return this.receptorMesh.clone() ;
    }

    getTap(kind) {

        // Create one step out of the five available.
        switch (kind) {
            case 'dl':
                return  this.constructTap(this.noteskinPath + '/Tap 5x2.PNG', 0) ;
                break ;
            case 'ul':
                return  this.constructTap(this.noteskinPath + '/Tap 5x2.PNG', 1/5) ;
                break ;
            case 'c':
                return  this.constructTap(this.noteskinPath + '/Tap 5x2.PNG', 2/5)  ;
                break ;
            case 'ur':
                return  this.constructTap(this.noteskinPath + '/Tap 5x2.PNG', 3/5)  ;
                break ;
            case 'dr':
                return  this.constructTap(this.noteskinPath + '/Tap 5x2.PNG', 4/5) ;
                break ;
        }

    }

    constructTap(pathToTexture, position) {


        let stepMap = this.tapMap.clone() ;
        this.clonedTapMaps.push(stepMap) ;


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

        let explosionMap = this.explosionMap.clone() ;
        this.clonedExplosionMaps.push(explosionMap) ;


        // to accurately represent the colors
        explosionMap.encoding = THREE.sRGBEncoding;

        // This acts as UV mapping.
        explosionMap.repeat.set(2/20,2/4);
        // explosionMap.offset.set( 0 , 0 );
        explosionMap.offset.set(  1/20 , 1/4 );

        // explosionMap.blending = THREE.AdditiveBlending ;


        let stepMaterial = new THREE.MeshBasicMaterial( { map: explosionMap, transparent: true } );

        // Augment the brightness of the explosion
        let scale = 1.0 ;

        stepMaterial.color.r = scale ;
        stepMaterial.color.g = scale ;
        stepMaterial.color.b = scale ;

        stepMaterial.blending = THREE.AdditiveBlending ;
        stepMaterial.depthWrite = false ;

        // So they can meet inbetween.
        stepMaterial.alphaTest = 0.1;


        let explosion =  new THREE.Mesh( this.tapGeometry, stepMaterial );
        explosion.scale.x = 2.5 ;
        explosion.scale.y = 2.5 ;

        return explosion ;
    }



}