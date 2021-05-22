'use strict' ;

class Explosion extends GameObject {

    _mesh ;
    _explosionAnimationRate ;
    _lastStepTimeStamp ;
    _animationPosition ;


    constructor(resourceManager) {

        super(resourceManager);
        this._explosionAnimationRate = 20 ;
        this._mesh = this._resourceManager.constructExplosion( ) ;

    }

    ready() {

        // This acts as UV mapping.
        this._mesh.material.map.repeat.set(2/20,2/4);
        // explosionMap.offset.set( 0 , 0 );
        this._mesh.material.map.offset.set(  1/20 , 1/4 );

        // explosionMap.blending = THREE.AdditiveBlending ;

        // Augment the brightness of the explosion
        let scale = 1.0 ;

        this._mesh.material.color.r = scale ;
        this._mesh.material.color.g = scale ;
        this._mesh.material.color.b = scale ;


        this._mesh.scale.x = 2.5 ;
        this._mesh.scale.y = 2.5 ;

        this._lastStepTimeStamp = 0 ;
        this._animationPosition = 10 ;



    }

    set animationPosition(value){
        this._animationPosition = value ;
    }

    animate() {
        this._animationPosition = 0 ;
        this._lastStepTimeStamp = 0 ;
        this._mesh.material.opacity = 1.0 ;

    }

    update(delta) {


        if (this._animationPosition <= 4 ) {

            this._mesh.material.opacity = 1.0;

            let timeStamp = this._lastStepTimeStamp + delta;

            let movement = timeStamp * this._explosionAnimationRate;

            if (movement > 1) {
                this._animationPosition = (this._animationPosition + 1);

                // if we reach the end of the animation, stop and reset values.
                if (this._animationPosition > 4) {
                    this._mesh.material.opacity = 0.0;
                    this._lastStepTimeStamp = 0;
                    return;
                }
                this._mesh.material.map.offset.set(this._animationPosition * (1 / 5) + 1 / 20, 1 / 4);
                this._lastStepTimeStamp = 0;
            } else {
                this._lastStepTimeStamp += delta;
            }
        }



    }


    get object () {
        return this._mesh;
    }
}