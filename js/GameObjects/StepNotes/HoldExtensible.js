"use strict" ;



class HoldExtensible extends GameObject {

    _mesh ;
    _kind ;


    constructor(resourceManager, kind) {
        super(resourceManager);

        this._kind = kind ;

        this._mesh = this._resourceManager.constructHoldExtensible( this._kind ) ;

    }

    ready() {

    }

    update(delta) {

    }

    get object () {
        return this._mesh;
    }
}