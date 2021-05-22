'use strict' ;

class EndNote extends GameObject {

    _mesh;
    _kind;

    _spritePosition ;
    _stepAnimationRate ;
    _animationDelta ;

    constructor(resourceManager, kind, animationRate) {
        super(resourceManager);
        this._kind = kind;

        this._stepAnimationRate = animationRate ;

        this._mesh = this._resourceManager.constructHoldEndNote( this._kind ) ;

    }

    ready() {

        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._mesh.material.map.repeat.set(1/6,1/3) ;

    }

    // This one is not empty
    update(delta) {

        this.updateTextureAnimation(delta) ;

        // TODO: handle input data here also?


    }

    updateTextureAnimation(delta) {

        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const XOffset6x1 = ((this._spritePosition + 3)% 6) * (1/6) ;

            const YOffset6x1HoldEndNote = 0 ;


            this._mesh.material.map.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;

            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }

    get object () {
        return this._mesh;
    }

}