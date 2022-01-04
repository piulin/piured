"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class TouchInput extends GameObject {

    _mesh ;
    _scaled_mesh ;

    constructor(resourceManager) {

        super(resourceManager) ;

        this.pads = [] ;
        this.padsDic = {} ;
        // 15 fingers???
        this.touchEvents = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null] ;

        this._mesh = new THREE.Object3D() ;
        this._scaled_mesh = new THREE.Object3D() ;
        this._scaled_mesh.add(this._mesh) ;

    }

    getPadIds() {
        return Object.keys(this.padsDic) ;
    }

    addTouchPad(padId) {
        const pad = new TouchPad(this._resourceManager, padId) ;
        // pad.object.position.z = 0.05;
        // pad.object.position.y = -9;
        pad.object.scale.x = 8.0;
        pad.object.scale.y = 8.0;
        pad.object.material.opacity = 0.3;
        engine.addToUpdateList(pad) ;
        this._mesh.add(pad.object) ;

        this.pads.push( pad ) ;
        this.padsDic[padId] = pad ;

        this.adjustTouchPads() ;
    }

    adjustTouchPads() {

        let no_pads = this.pads.length ;

        if(no_pads === 1) {
            return ;
        }
        let distance = 7.25 ;

        let Xpos = -(distance*no_pads)/2 + distance/2;

        for (let i = 0 ; i < no_pads ; i++ ) {
            this.pads[i].object.position.x = Xpos ;
            Xpos += distance ;
        }

    }

    onTouchDown( event ) {

        var canvasPosition = engine.renderer.domElement.getBoundingClientRect();

        for ( let i = 0 ; i < event.touches.length ; i++) {

            let touch = event.touches[i];

            if (this.touchEvents[touch.identifier] == null) {

                this.touchEvents[touch.identifier] = touch;
                var mouseX = touch.pageX - canvasPosition.left;
                var mouseY = touch.pageY - canvasPosition.top;

                for (let pad of this.pads) {

                    let kind = pad.touched(mouseX, mouseY);

                    switch (kind) {
                        case 'dl':
                            pad.dlKeyPressed = true;
                            pad.dlKeyHold = true;
                            break;
                        case 'ul':
                            pad.ulKeyPressed = true;
                            pad.ulKeyHold = true;
                            break;
                        case 'c':
                            pad.cKeyPressed = true;
                            pad.cKeyHold = true;
                            break;
                        case 'ur':
                            pad.urKeyPressed = true;
                            pad.urKeyHold = true;
                            break;
                        case 'dr':
                            pad.drKeyPressed = true;
                            pad.drKeyHold = true;
                            break;
                    }
                }
            }
        }

    }

    onTouchUp( event ) {

        var canvasPosition = engine.renderer.domElement.getBoundingClientRect();

        for ( let i = 0 ; i < event.changedTouches.length ; i++) {

            let touch = this.touchEvents[event.changedTouches[i].identifier] ;
            this.touchEvents[event.changedTouches[i].identifier] = null ;
            var mouseX = touch.pageX - canvasPosition.left;
            var mouseY = touch.pageY - canvasPosition.top;

            for (let pad of this.pads) {

                let kind = pad.touched(mouseX, mouseY);
                switch (kind) {
                    case 'dl':
                        pad.dlKeyHold = false;
                        break;
                    case 'ul':
                        pad.ulKeyHold = false;
                        break;
                    case 'c':
                        pad.cKeyHold = false;
                        break;
                    case 'ur':
                        pad.urKeyHold = false;
                        break;
                    case 'dr':
                        pad.drKeyHold = false;
                        break;
                }
            }
        }

    }

    isPressed( kind, padId ) {
        return this.padsDic[padId].isPressed(kind) ;
    }

    isHeld( kind, padId ) {
        return this.padsDic[padId].isHeld(kind) ;
    }

    update(delta) {

    }


    getPressed() {

        var list = [] ;

        for ( let pad of this.pads ) {

            if ( pad.dlKeyPressed ) {
                list.push(['dl', pad.padId]) ;
            }

            if ( pad.ulKeyPressed ) {
                list.push(['ul', pad.padId]) ;
            }

            if ( pad.cKeyPressed ) {
                list.push(['c', pad.padId]) ;
            }

            if ( pad.urKeyPressed ) {
                list.push(['ur', pad.padId]) ;
            }

            if ( pad.drKeyPressed ) {
                list.push(['dr', pad.padId]) ;
            }

        }

        return list ;
    }

    setScale(scale) {
        this._mesh.scale.x *= scale ;
        this._mesh.scale.y *= scale ;
    }

    get object () {
        return this._scaled_mesh ;
    }

}