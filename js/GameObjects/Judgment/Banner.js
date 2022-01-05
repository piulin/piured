'use strict' ;

class Banner extends GameObject {

    _mesh ;


    constructor(resourceManager) {

        super(resourceManager);

        this._mesh = this._resourceManager.constructJudgmentBanner( ) ;

        // 0.6
        this._mesh.material.map.repeat.set(1,1/6);
        this._mesh.material.map.offset.set(0,0);
        this._mesh.scale.set( 0.6 , 0.6, 1 ) ;
        this._mesh.material.opacity = 0.0 ;


        this.scaleFadeTween = null ;
        this.opacityFadeTween = null ;


    }

    ready() {


    }




    update(delta) {

    }


    animate() {

        // remove scheduled tweens
        if ( this.scaleFadeTween !== null ) {

            TWEEN.remove(this.scaleFadeTween) ;
            TWEEN.remove(this.opacityFadeTween) ;


        }


        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (5/60)*1000     ;

        // schedule going out tweens for JUDGMENT
        this._mesh.material.opacity = 1.0 ;
        this._mesh.scale.set(0.6,0.6) ;

        new TWEEN.Tween( this._mesh.material ).to( {opacity: 0.7 } , diffuseTimeWait ).start();

        this._mesh.material.opacity = 0.7 ;
        this.scaleFadeTween = new TWEEN.Tween( this._mesh.scale ).to( { x: 1.5 , y: 0.0 }, diffuseAnimation ).delay(diffuseTimeWait).start();
        this.opacityFadeTween = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0.0 } , diffuseAnimation ).delay(diffuseTimeWait).start();




        this._mesh.scale.set(0.95, 0.95) ;
        this._mesh.material.opacity = 1.0 ;
        this._mesh.position.y = this._mesh.scale.y / 6;


        new TWEEN.Tween(this._mesh.scale).to({x: 0.6, y: 0.6}, time).start();
        new TWEEN.Tween(this._mesh.position).to({y: 0}, time).start();

    }

    setGrade(grade) {
        switch (grade) {
            case 'p':
                this._mesh.material.map.offset.set(0,5/6) ;
                break ;
            case 'gr':
                this._mesh.material.map.offset.set(0,4/6) ;
                break;
            case 'go':
                this._mesh.material.map.offset.set(0,2/6) ;
                break;
            case 'b':
                this._mesh.material.map.offset.set(0,1/6) ;
                break;
            case 'm':
                this._mesh.material.map.offset.set(0,0) ;
                break;

        }
    }


    get object () {
        return this._mesh;
    }
}