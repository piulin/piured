'use strict' ;


class Stage extends GameObject {



    _object ;
    _bg ;
    p1 ;

    constructor(resourceManager, song, levels, userSpeeds, lpad, rpad, playBackSpeed, useTouchInput) { //...

        super(resourceManager);

        this.animationRate = 30 ;
        this.song = song ;
        this.levels = levels ;
        this.userSpeeds = userSpeeds ;



        engine.addToUpdateList( new StepNoteTexture(this._resourceManager,'dl',this.animationRate) ) ;
        engine.addToUpdateList( new StepNoteTexture(this._resourceManager,'ul',this.animationRate) ) ;
        engine.addToUpdateList( new StepNoteTexture(this._resourceManager,'c',this.animationRate) ) ;
        engine.addToUpdateList( new StepNoteTexture(this._resourceManager,'ur',this.animationRate) ) ;
        engine.addToUpdateList( new StepNoteTexture(this._resourceManager,'dr',this.animationRate) ) ;

        engine.addToUpdateList( new HoldExtensibleTexture(this._resourceManager,'dl',this.animationRate) ) ;
        engine.addToUpdateList( new HoldExtensibleTexture(this._resourceManager,'ul',this.animationRate) ) ;
        engine.addToUpdateList( new HoldExtensibleTexture(this._resourceManager,'c',this.animationRate) ) ;
        engine.addToUpdateList( new HoldExtensibleTexture(this._resourceManager,'ur',this.animationRate) ) ;
        engine.addToUpdateList( new HoldExtensibleTexture(this._resourceManager,'dr',this.animationRate) ) ;

        this._object = new THREE.Object3D() ;




        if (lpad !== null ) {
            this.leftKeyMap = lpad ;
        } else {
            this.leftKeyMap = {
                dl: 90,
                ul : 81,
                c : 83,
                ur : 69,
                dr: 67
            }
        }


        if (rpad !== null) {
            this.rightKeyMap = rpad ;
        } else {
            this.rightKeyMap = {
                dl: 86,
                ul: 82,
                c: 71,
                ur: 89,
                dr: 78
            }
        }

        let accuracyMargin = 0.15 ;
        let touchInput = null ;
        if (useTouchInput) {
            touchInput = new TouchInput(this._resourceManager);
            touchInput.object.position.z = 1.0;
            touchInput.object.position.y = -9;
            touchInput.object.scale.x = 8.0;
            touchInput.object.scale.y = 8.0;
            touchInput.object.material.opacity = 0.3;
            this._object.add(touchInput.object);
            engine.addToUpdateList(touchInput);
            accuracyMargin = 0.25 ;
        }


        //TODO:
        var P1 = new KeyInput(this._resourceManager, touchInput)  ;
        P1.addPad(this.leftKeyMap, '0') ;
        P1.addPad(this.rightKeyMap, '1') ;
        // ti = touchInput ;

        // touchInput.getScreenPositionInPixels() ;




        let stage1 = new PlayerStage(this._resourceManager, this.song, P1, this.levels[0], this.userSpeeds[0],'0','1', playBackSpeed, accuracyMargin) ;
        this.p1 = stage1 ;
        this._object.add(stage1.object) ;
        engine.addToUpdateList(stage1) ;


        if ( this.levels.length === 2 ) {

            stage1.object.position.x = -3.5 ;


            let stage2 = new PlayerStage(this._resourceManager,
                this.song,
                P1,
                this.levels[1],
                this.userSpeeds[1],
                '1',
                '2',
                playBackSpeed,
                accuracyMargin) ;

            this._object.add(stage2.object) ;
            engine.addToUpdateList(stage2) ;

            stage2.object.position.x = 3.5 ;
        }
        // P1.addPad(this.rightKeyMap, '1') ;

        this._bg = new Background(this._resourceManager, stage1.beatManager) ;
        this._bg.object.position.y = -3 ;
        this._bg.object.position.z = -1 ;
        this._object.add(this._bg.object) ;
        engine.addToUpdateList(this._bg) ;

        // this has to be later than the stages.
        engine.addToUpdateList(P1) ;

    }

    setNewPlayBackSpeed ( newPlayBackSpeed ) {
        this.p1.setNewPlayBackSpeed ( newPlayBackSpeed ) ;
    }

    ready() {


    }

    update(delta) {


    }

    get object () {
        return this._object ;
    }




}