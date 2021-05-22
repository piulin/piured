'use strict' ;


class HoldExtensibleTexture extends GameObject {


    _map;
    _kind;

    _spritePosition ;
    _stepAnimationRate ;
    _animationDelta ;

    constructor(resourceManager, kind, animationRate) {
        super(resourceManager);
        this._kind = kind;
        this._stepAnimationRate = animationRate ;

        this._map = this._resourceManager.getHoldExtensibleTexture( this._kind ) ;

    }

    ready() {

        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._map.repeat.set(1/6,2/3) ;
        this._map.offset.set(0,1/3);


    }

    update(delta) {

        this.updateTextureAnimation(delta) ;

    }

    updateTextureAnimation(delta) {


        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const XOffset6x1 = ((this._spritePosition + 3)% 6) * (1/6) ;

            const YOffset6x1HoldExtensible = 1/3 ;


            this._map.offset.set( XOffset6x1, YOffset6x1HoldExtensible) ;

            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }




}