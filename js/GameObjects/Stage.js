'use strict' ;


class Stage extends GameObject {



    _object ;
    _bg ;
    _playerStages ;
    p1 ;
    song ;
    animationRate ;

    constructor( resourceManager, song ) { //...

        super(resourceManager);

        this.animationRate = 30;
        this.song = song;

        this._object = new THREE.Object3D();

        this._playerStages = [] ;

        this.configureNoteTextures() ;


    }

    retrievePerformancePlayerStages() {
        let performances = [] ;
        for (let i = 0 ; i < this._playerStages.length ; i++) {
            performances.push( this._playerStages[i].judgment.performance ) ;
        }
        return performances ;
    }

    configureNoteTextures() {
        engine.addToUpdateList(new StepNoteTexture(this._resourceManager, 'dl', this.animationRate));
        engine.addToUpdateList(new StepNoteTexture(this._resourceManager, 'ul', this.animationRate));
        engine.addToUpdateList(new StepNoteTexture(this._resourceManager, 'c', this.animationRate));
        engine.addToUpdateList(new StepNoteTexture(this._resourceManager, 'ur', this.animationRate));
        engine.addToUpdateList(new StepNoteTexture(this._resourceManager, 'dr', this.animationRate));

        engine.addToUpdateList(new HoldExtensibleTexture(this._resourceManager, 'dl', this.animationRate));
        engine.addToUpdateList(new HoldExtensibleTexture(this._resourceManager, 'ul', this.animationRate));
        engine.addToUpdateList(new HoldExtensibleTexture(this._resourceManager, 'c', this.animationRate));
        engine.addToUpdateList(new HoldExtensibleTexture(this._resourceManager, 'ur', this.animationRate));
        engine.addToUpdateList(new HoldExtensibleTexture(this._resourceManager, 'dr', this.animationRate));
    }

    configureBG() {

        this._bg = new Background(this._resourceManager, this._playerStages[0].beatManager) ;
        this._bg.object.position.y = -3 ;
        this._bg.object.position.z = -1 ;
        this._object.add(this._bg.object) ;
        engine.addToUpdateList(this._bg) ;

    }


    addPlayerStage( playerConfig, playBackSpeed ) {


        let lifebarOrientation ;

        if ( this._playerStages.length % 2 === 0 ) {
            lifebarOrientation = 'left2right' ;
        } else {
            lifebarOrientation = 'right2left' ;
        }


        let stage = new PlayerStage(this._resourceManager,
            this.song,
            playerConfig,
            playBackSpeed,
            lifebarOrientation) ;

        stage.setScale(playerConfig.scale) ;

        this._object.add(stage.object) ;
        engine.addToUpdateList(stage) ;
        this._playerStages.push(stage) ;
        this.adjustPlayerStages() ;

        // We can only configure the background if we have at least one stage (beat manager) set up.
        if ( this._playerStages.length === 1 )  {
            this.configureBG() ;
        }

        // stageID
        return this._playerStages.length -1 ;


    }

    adjustPlayerStages() {

        let no_stages = this._playerStages.length ;

        // if (no_stages === 1) {
        //     return ;
        // }


        let distance = 0 ;
        if (no_stages === 2 ) {
            distance = 7 ;
        } else  {
            distance = 5 ;
        }

        for (let i = 0 ; i < no_stages ; i++ ) {
            if (  this.song.getLevelStyle(this._playerStages[i]._level) === 'pump-double' || this.song.getLevelStyle(this._playerStages[i]._level) === 'pump-halfdouble' ) {
                distance = 9 ;
                break ;
            }
        }


        let Xpos = -(distance*no_stages)/2 + distance/2;

        for (let i = 0 ; i < no_stages ; i++ ) {
            this._playerStages[i].object.position.x = Xpos + this._playerStages[i].playerConfig.receptorX ;
            this._playerStages[i].object.position.y = this._playerStages[i].playerConfig.receptorY ;
            Xpos += distance ;
        }

    }

    setNewPlayBackSpeed ( newPlayBackSpeed ) {
        for (let i = 0 ; i < this._playerStages.length ; i++ ) {
            this._playerStages[i].setNewPlayBackSpeed ( newPlayBackSpeed ) ;
        }
    }

    updateOffset(stageId, newOffsetOffset) {
        this._playerStages[stageId].beatManager.updateOffset(newOffsetOffset) ;
    }

    ready() {


    }

    update(delta) {


    }

    get object () {
        return this._object ;
    }




}