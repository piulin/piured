'use strict' ;

class StepBounce extends GameObject {

    _mesh ;
    _kind ;

    _spritePosition ;
    _stepAnimationRate ;
    _animationDelta ;
    _tweenOpacityEffect ;



    constructor(resourceManager, kind, stepAnimationRate) {

        super(resourceManager);
        this._kind = kind ;
        this._stepAnimationRate = stepAnimationRate ;
        this._mesh = this._resourceManager.constructStepBounce( this._kind ) ;
        this._tweenOpacityEffect = undefined ;

    }

    ready() {


        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._mesh.material.map.repeat.set(1/3,1/2);
    }

    animate() {

        // Animate tap
        const time = 380 ;
        const delayOpacity = 250 ;
        this._mesh.material.opacity = 1.0 ;
        this._mesh.scale.set(1,1) ;

        // for early stopping the tween
        if ( this._tweenOpacityEffect !== undefined ) {
            TWEEN.remove( this._tweenOpacityEffect ) ;
        }

        this._tweenOpacityEffect = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0 }, time-delayOpacity ).delay(delayOpacity).start();
        new TWEEN.Tween( this._mesh.scale ).to( { x: 1.3, y: 1.3 }, time ).start();
    }

    update(delta) {



        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const col = this._spritePosition % 3 ;
            // in UV cordinates, the first row is the lowest one.

            const row = Math.floor( this._spritePosition / 3 ) ;

            const XOffset3x2 = col * (1/3) ;

            const YOffset3x2 = row * (1/2) ;




            this._mesh.material.map.offset.set(  XOffset3x2, YOffset3x2 ) ;

            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }


    get object () {
        return this._mesh;
    }
}