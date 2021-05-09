"use strict" ;


class JudgmentScale {


    constructor(accuracyMargin) {


        this.accuracyMargin = accuracyMargin ;
        this.comboCount = 0 ;

        this.judgmentFactory = new JudgmentFactory() ;


        //judgment position

        this.judgmentYPosition = -2.5 ;
        this.judgmentZDepth = 0.00002;

        // retrieve the judgement


        this.judgment = this.judgmentFactory.judgement ;
        this.judgment.position.z = this.judgmentZDepth ;
        this.judgment.position.y = this.judgmentYPosition ;
        // this.judgment.position.y = -0.5 ;
        // 0.6
        this.judgment.scale.set( 0.6 , 0.6, 1) ;
        this.judgment.material.opacity = 0.0 ;
        this.judgmentFactory.updateJudgementTexture('p') ;
        this.judgment.scaleFadeTween = null ;
        this.judgment.opacityFadeTween = null ;


        this.comboYPosition = this.judgmentYPosition - 0.45 ;

        this.combo = this.judgmentFactory.combo ;
        this.combo.position.z = this.judgmentZDepth ;
        this.combo.position.y = this.comboYPosition ;
        this.combo.material.opacity = 0.0 ;
        this.combo.scale.set(0.37, 0.37) ;
        this.combo.scaleFadeTween = null ;
        this.combo.opacityFadeTween = null ;


        // digits
        this.digitsYPosition = this.comboYPosition - 0.35;

        this.normalDigits = this.judgmentFactory.normalDigitsObjects ;
        this.normalDigits.position.y = this.digitsYPosition ;
        this.normalDigits.position.z = this.judgmentZDepth ;
        // this.judgmentFactory.updateNormalDigits(126) ;
        this.normalDigits.opacityFadeTween = null ;


        this.judgmentObject = new THREE.Object3D() ;

        this.judgmentObject.add(this.judgment) ;
        this.judgmentObject.add(this.combo) ;
        this.judgmentObject.add(this.normalDigits) ;
    }

    getJudgmentObject() {

        return this.judgmentObject ;

    }

    miss ( ) {
        this.comboCount = -1 ;
        this.animateJudgement('m') ;

    }

    bad ( ) {
        this.comboCount = -1 ;
        this.animateJudgement('b') ;

    }

    good ( ) {
        this.comboCount -= 1 ;
        this.animateJudgement('go') ;
    }

    animateJudgement(grade) {
        // remove scheduled tweens
        if ( this.judgment.scaleFadeTween !== null ) {

            TWEEN.remove(this.judgment.scaleFadeTween) ;
            TWEEN.remove(this.judgment.opacityFadeTween) ;


        }

        // update combo count
        this.comboCount += 1 ;




        this.judgmentFactory.updateJudgementTexture(grade) ;


        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (5/60)*1000     ;

        // schedule going out tweens for JUDGMENT
        this.judgment.material.opacity = 1.0 ;
        this.judgment.scale.set(0.6,0.6) ;
        this.judgment.scaleFadeTween = new TWEEN.Tween( this.judgment.scale ).to( { x: 1.5 , y: 0.0 }, diffuseAnimation ).delay(diffuseTimeWait).start();
        this.judgment.opacityFadeTween = new TWEEN.Tween( this.judgment.material ).to( {opacity: 0.0 } , diffuseAnimation ).delay(diffuseTimeWait).start();



        this.judgment.scale.set(0.90,0.90) ;
        this.judgment.material.opacity = 1.0 ;
        this.judgment.position.y = this.judgmentYPosition +  this.judgment.scale.y / 6;


        new TWEEN.Tween(this.judgment.scale).to({x: 0.6, y: 0.6}, time).start();
        new TWEEN.Tween(this.judgment.position).to({y: this.judgmentYPosition}, time).start();


        // only if combo is > 3
        if ( this.comboCount > 3 ) {

            // this can be updated inly here.
            this.judgmentFactory.updateNormalDigits(this.comboCount) ;

            if ( this.combo.tweenOpacityEffect !== null ) {
                TWEEN.remove(this.combo.scaleFadeTween) ;
                TWEEN.remove(this.combo.opacityFadeTween) ;

                for ( let digit of this.judgmentFactory.normalDigits) {
                    TWEEN.remove(digit.opacityFadeTween);
                }
            }

            // similarly we update the tweens for the combo label
            this.combo.material.opacity = 1.0;
            this.combo.scale.set(0.37, 0.37);
            this.combo.scaleFadeTween = new TWEEN.Tween(this.combo.scale).to({
                x: 0.97,
                y: 0.0
            }, diffuseAnimation).delay(diffuseTimeWait).start();
            this.combo.opacityFadeTween = new TWEEN.Tween(this.combo.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();

            this.combo.scale.set(0.57, 0.57);
            this.combo.material.opacity = 1.0;
            this.combo.position.y = this.comboYPosition - this.combo.scale.y / 6;


            new TWEEN.Tween(this.combo.scale).to({x: 0.37, y: 0.37}, time).start();
            new TWEEN.Tween(this.combo.position).to({y: this.comboYPosition}, time).start();


            // And lastly, for the digits
            for (let digit of this.judgmentFactory.normalDigits) {
                // console.log(digit);
                digit.material.opacity = 1.0;


            }

            // we need to do this for each digit.
            for (let digit of this.judgmentFactory.normalDigits) {
                digit.opacityFadeTween = new TWEEN.Tween(digit.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();
            }

            // combo

            this.normalDigits.position.y = this.digitsYPosition - 0.25;
            new TWEEN.Tween(this.normalDigits.position).to({y: this.digitsYPosition}, time).start();

        }


    }

    grade(timeElapse) {
        const tiersTime = this.accuracyMargin / 8;
        const tier = Math.floor( timeElapse / tiersTime ) ;

        switch (tier) {
            case 0:
            case 1:
            case 2:
                return 'p' ;
            case 3:
            case 4:
                return 'gr' ;
            case 5:
            case 6:
                return 'go' ;
            case 7:
                return 'b' ;

        }

    }



}