"use strict" ;


class JudgmentScale extends GameObject {

    _judgment ;

    constructor(resourceManager, accuracyMargin) {

        super(resourceManager) ;


        this.accuracyMargin = accuracyMargin ;

        this._judgment = new Judgment(this._resourceManager) ;
        engine.addToUpdateList(this._judgment) ;

    }

    ready() {

        this.comboCount = 0 ;
        this.missComboCount = 0 ;

        this.stats = {
            p:0,
            gr:0,
            go:0,
            b:0,
            m:0
        }
    }

    update(delta) {

    }

// TODO:
    miss ( comboIncrement = 1 ) {
        this.comboCount = 0 ;
        this.missComboCount += 1 ;
        this.stats.m += 1;
        this._judgment.animate('m',this.comboCount) ;

    }
    bad ( ) {
        this.missComboCount = 0;
        this.comboCount = 0 ;
        this.stats.b += 1;
        this._judgment.animate('b',this.comboCount) ;
    }

    good ( ) {
        this.missComboCount = 0 ;
        this.stats.go += 1;
        this._judgment.animate('go',this.comboCount) ;
    }

    great ( ) {
        this.missComboCount = 0;
        this.stats.gr += 1;
        this.comboCount += 1 ;
        this._judgment.animate('gr',this.comboCount) ;

    }

    perfect ( comboIncrement = 1 ) {
        this.missComboCount = 0 ;
        this.stats.p += 1;
        this.comboCount += comboIncrement ;
        this._judgment.animate('p',this.comboCount) ;
    }


    grade(timeElapse) {

        const tiersTime = this.accuracyMargin / 8;
        const tier = Math.floor( timeElapse / tiersTime ) ;



        let grade = null ;

        switch (tier) {
            case 0:
            case 1:
            case 2:
                this.perfect() ;
                grade = 'p' ;
                break ;
            case 3:
            case 4:
                this.great() ;
                grade =  'gr' ;
                break ;
            case 5:
            case 6:
                this.good() ;
                grade =  'go' ;
                break ;
            case 7:
                this.bad() ;
                grade =  'b' ;
                break ;

        }

        return grade ;

    }

    get object() {
        return this._judgment.object ;
    }



}