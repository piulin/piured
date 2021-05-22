'use strict' ;

class Judgment extends GameObject {

    _banner ;
    _combo ;
    _whiteDigits ;



    _object ;


    constructor(resourceManager) {

        super(resourceManager);


        this.judgmentZDepth = 0.00002;
        this.maxNumDigits = 5 ;

        this._object = new THREE.Object3D() ;


        this._banner = new Banner(this._resourceManager) ;
        this._banner.object.position.z = this.judgmentZDepth ;
        this._object.add(this._banner.object) ;
        engine.addToUpdateList(this._banner) ;


        this._combo = new Combo(this._resourceManager) ;
        this.comboYPosition = this._banner.object.position.y - 0.45 ;
        this._combo.object.position.z = this.judgmentZDepth ;
        this._combo.object.position.y = this.comboYPosition ;
        this._object.add(this._combo.object) ;
        engine.addToUpdateList(this._combo) ;



        this._whiteDigits = new Digits(this._resourceManager, this.maxNumDigits) ;
        this._whiteDigits.object.position.z = this.judgmentZDepth ;
        this._whiteDigits.object.position.y = this.comboYPosition - 0.35;
        this._object.add(this._whiteDigits.object) ;
        engine.addToUpdateList(this._whiteDigits) ;


    }

    ready() {

        this._banner.setGrade('p') ;
        this._whiteDigits.displayComboCount(0) ;

    }

    update(delta) {

    }

    animate(grade, comboCount) {

        this._banner.animate() ;
        this._banner.setGrade(grade)

        if ( comboCount > 3 ) {
            this._whiteDigits.displayComboCount(comboCount) ;
            this._combo.animate() ;
            this._whiteDigits.animate() ;
        }

    }



    get object () {
        return this._object;
    }
}