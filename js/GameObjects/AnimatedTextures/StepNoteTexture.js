'use strict' ;


class StepNoteTexture extends GameObject {


    _map;
    _kind;

    _spritePosition ;
    _stepAnimationRate ;
    _animationDelta ;

    constructor(resourceManager, kind, animationRate) {

        super(resourceManager);
        this._kind = kind;
        this._stepAnimationRate = animationRate ;

        this._map = this._resourceManager.getStepNoteTexture( this._kind ) ;

    }

    ready() {


        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._map.repeat.set(1/3,1/2);
    }

    // This one is not empty
    update(delta) {

        this.updateTextureAnimation(delta) ;


    }

    updateTextureAnimation(delta) {

        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const col = this._spritePosition % 3 ;
            // in UV cordinates, the first row is the lowest one.

            const row = Math.floor( this._spritePosition / 3 ) ;

            const XOffset3x2 = col * (1/3) ;

            const YOffset3x2 = row * (1/2) ;


            this._map.offset.set(  XOffset3x2, YOffset3x2 ) ;

            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }




}