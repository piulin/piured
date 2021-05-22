'use strict' ;

class Digit extends GameObject {

    _mesh ;


    constructor(resourceManager) {

        super( resourceManager );

        this._mesh = this._resourceManager.constructDigit( ) ;

        this._mesh.material.map.repeat.set ( 1/4, 1/4 ) ;
        this._mesh.material.map.offset.set ( 0, 3/4 );

        this._mesh.material.opacity = 0.0 ;

        this.opacityFadeTween = null ;

    }

    ready() {


    }


    update(delta) {

    }

    animate() {

        if ( this.opacityFadeTween !== null ) {
            TWEEN.remove(this.opacityFadeTween) ;
        }

        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (5/60)*1000;
        this._mesh.material.opacity = 1.0;

        new TWEEN.Tween( this._mesh.material ).to( {opacity: 0.8 } , diffuseTimeWait ).start();

        this._mesh.material.opacity = 0.8 ;
        // we need to do this for each digit.
        this.opacityFadeTween = new TWEEN.Tween(this._mesh.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();



    }

    displayDigit(digit) {

        const [row, col] = this.getCoordinatesForDigit(digit) ;
        // console.log(index) ;
        this._mesh.material.map.offset.set(col * (1/4), row * (1/4)) ;
    }

    hide(){
        this._mesh.material.map.offset.set(1,1) ;
    }

    getCoordinatesForDigit(digit) {

        const col = digit % 4 ;
        const row = 3 - Math.floor( digit/4 ) ;

        return [row, col] ;

    }


    get object () {
        return this._mesh;
    }
}