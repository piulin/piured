'use strict' ;

class LFBar extends GameObject {

    _barFX ;
    _barFXRed ;
    _bar ;
    _pulse ;
    _tip ;
    _object ;
    kind ;

    pulseXSize = 0.5 ;
    pulseXHalfSize = this.pulseXSize / 2 ;
    barXSize = 4 ;
    barXHalfSize = this.barXSize / 2 ;


    constructor( resourceManager, beatManager, kind ) {
        super(resourceManager);

        this._object = new THREE.Object3D() ;


        this.kind = kind ;

        this._barFX = new LFBarFX(this._resourceManager, kind) ;
        this._barFXRed = new LFBarFXRed(this._resourceManager, beatManager, kind) ;
        this._pulse = new LFPulse(this._resourceManager, beatManager, kind) ;
        this._tip = new LFTip(this._resourceManager) ;

        let bar = null ;
        if ( kind === 'single') {
            bar = this._resourceManager.constructSLifeBarBar() ;

        } else if ( kind === 'double') {

            this.pulseXSize = 1 ;
            this.pulseXHalfSize = this.pulseXSize / 2 ;
            this.barXSize = 8 ;
            this.barXHalfSize = this.barXSize / 2 ;
            bar = this._resourceManager.constructDLifeBarBar() ;
        }


        bar.material.map.repeat.set(-1,1/2);
        bar.material.map.offset.set(0,1/2);
        this._bar = bar ;

        this._object.add(bar) ;
        this._object.add(this._pulse.object) ;
        engine.addToUpdateList(this._pulse) ;
        this._object.add(this._tip.object) ;
        engine.addToUpdateList(this._tip) ;
        this._object.add(this._barFX.object) ;
        engine.addToUpdateList(this._barFX) ;
        this._object.add(this._barFXRed.object) ;
        engine.addToUpdateList(this._barFXRed) ;

        // this._tweenOpacityEffect = undefined ;

    }

    setsize(size) {

        if (size < 0.3) {
            this._barFXRed.blink = true ;
            this._tip.red() ;
        } else {
            this._tip.blue() ;
            this._barFXRed.blink = false ;
        }


        if ( size < 0.02 ) {
            this.setsize(0.02) ;
            return ;
        }

        if (size >= 1.0) {
            this._bar.position.x = 0 ;
            this._bar.scale.x = 1 ;
            this._bar.material.map.repeat.set(-1,1/2);
            this._pulse.opacity = 0.0;
            if ( this.kind === 'single') {
                this._tip.object.position.x = 1.92;
            } else {
                this._tip.object.position.x = 3.84;
            }
            // this._bar.material.opacity = 0.8 ;
            this._barFX.blink = true ;

        } else {
            // this._bar.material.opacity = 1.0 ;
            this._pulse.opacity = 1.0;
            this._bar.material.map.repeat.set(-size,1/2);
            this._bar.position.x = -(this.barXHalfSize- this.barXSize*(size/2)) - this.pulseXHalfSize ;

            this._bar.scale.x = size * (this.barXSize*size-this.pulseXSize)/(this.barXSize*size);

            if (this._bar.scale.x < 0) {
                this._bar.scale.x = 0;
            }

            this._pulse.object.position.x = (-this.barXHalfSize+(size*this.barXSize)) + (this.pulseXSize/2) -this.pulseXSize ;

            if (this._pulse.object.position.x < -this.barXHalfSize + this.pulseXSize/2) {


                const diff = this._pulse.object.position.x  -(-this.barXHalfSize + this.pulseXSize/2) ;
                const newsize = this.pulseXSize+diff ;

                this._pulse.object.scale.x = newsize / this.pulseXSize ;
                // console.log(diff) ;

                this._pulse.object.position.x = -this.barXHalfSize + newsize/2 ;
            } else {
                this._pulse.object.scale.x = 1 ;
            }

            this._tip.object.position.x = -this.barXHalfSize + this.barXSize*size ;
            this._barFX.blink = false ;

        }



    }

    ready() {

        this._bar.position.z = 0.0 ;
        this._barFX.object.position.z = 0.001 ;
        this._pulse.object.position.z = 0.001 ;
        this._tip.object.position.z = 0.031 ;


        this._tip.object.scale.x = 1.6 ;
        this._tip.object.scale.y = 1.6 ;

        this._barFX.object.scale.x = 1.02 ;
        this._barFX.object.scale.y = 1.8 ;
        this._barFX.object.material.map.repeat.x = -1 ;

        this._barFXRed.object.scale.x = 1.02 ;
        this._barFXRed.object.scale.y = 1.8 ;

    }

    animate() {


    }

    update(delta) {


    }

    get object () {
        return this._object ;
    }
}