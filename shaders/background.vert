varying vec4 vModelPosition;
varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vUv = uv ;
    vModelPosition = modelMatrix * vec4( position, 1.0 );
}