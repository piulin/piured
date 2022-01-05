'use strict' ;

class WhiteTap extends GameObject {

    _mesh ;
    _kind ;

    _tweenOpacityEffect ;



    constructor(resourceManager, kind ) {

        super(resourceManager);
        this._kind = kind ;
        // this._mesh = this._resourceManager.constructGenericTap( ) ;


        // Create one step out of the five available.
        let tap = this._resourceManager.constructGenericWhiteTap() ;
        tap.material.map.repeat.set(1/5,1/2);

        switch (kind) {
            case 'dl':
                tap.material.map.offset.set( 0 , 1/2 );
                break ;
            case 'ul':
                tap.material.map.offset.set( 1/5 , 1/2 );
                break ;
            case 'c':
                tap.material.map.offset.set( 2/5 , 1/2 );
                break ;
            case 'ur':
                tap.material.map.offset.set( 3/5 , 1/2 );
                break ;
            case 'dr':
                tap.material.map.offset.set( 4/5 , 1/2 );
                break ;
        }

        this._mesh = tap ;

        this._tweenOpacityEffect = undefined ;

    }

    ready() {

    }

    animate() {

        const time = 250 ;
        const opacityDelay = 100 ;
        this._mesh.material.opacity = 1.0 ;
        this._mesh.scale.set(1,1) ;

        if ( this._tweenOpacityEffect !== null ) {
            TWEEN.remove(this._tweenOpacityEffect) ;
        }

        this._tweenOpacityEffect = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0 }, time-opacityDelay ).delay(opacityDelay).start();
        new TWEEN.Tween( this._mesh.scale ).to( { x: 1.2, y: 1.2 }, time ).start();

    }

    update(delta) {


    }

    get object () {
        return this._mesh;
    }
}