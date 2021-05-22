'use strict' ;

class Combo extends GameObject {

    _mesh ;

    _object ;


    constructor(resourceManager) {

        super(resourceManager);

        this._mesh = this._resourceManager.constructCombo( ) ;

        this._mesh.material.map.repeat.set (1,1/2) ;
        this._mesh.material.map.offset.set (0, 1/2 );

        this._mesh.scale.set(0.37, 0.37) ;
        this._mesh.material.opacity = 0.0 ;
        this.scaleFadeTween = null ;
        this.opacityFadeTween = null ;

        this._object = new THREE.Object3D() ;
        this.object.add(this._mesh) ;
        //

    }

    ready() {


    }


    animate() {

        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (5/60)*1000     ;

        if ( this.tweenOpacityEffect !== null ) {
            TWEEN.remove(this.scaleFadeTween) ;
            TWEEN.remove(this.opacityFadeTween) ;
        }

        // similarly we update the tweens for the combo label
        this._mesh.material.opacity = 1.0;
        this._mesh.scale.set(0.37, 0.37);
        this.scaleFadeTween = new TWEEN.Tween(this._mesh.scale).to({
            x: 0.97,
            y: 0.0
        }, diffuseAnimation).delay(diffuseTimeWait).start();

        new TWEEN.Tween( this._mesh.material ).to( { opacity: 0.8 } , diffuseTimeWait ).start();

        this._mesh.material.opacity = 0.8 ;

        this.opacityFadeTween = new TWEEN.Tween(this._mesh.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();

        this._mesh.scale.set(0.63, 0.73);
        this._mesh.material.opacity = 1.0;
        this._mesh.position.y = - this._mesh.scale.y / 6;


        new TWEEN.Tween(this._mesh.scale).to({x: 0.37, y: 0.37}, time).start();
        new TWEEN.Tween(this._mesh.position).to({y: 0}, time).start();
    }


    update(delta) {

    }


    get object () {
        return this._object;
    }
}