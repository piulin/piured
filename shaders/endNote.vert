
varying vec2 vUv;
varying vec4 endNotePosition ;

void main() {

    vUv = uv ;
    endNotePosition = modelMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}