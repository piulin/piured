varying vec2 vUv;
uniform sampler2D uNoteTexture;


uniform vec2 uOffset ;
uniform vec2 uRepeat ;

varying vec4 endNotePosition ;

uniform float uInvisible ;

void main() {


    // Position of the receptor in the texture

    vec4 color = texture2D(uNoteTexture, vUv*uRepeat + uOffset);
//    if ( activeColor.a < 0.9 ) {
//        activeColor = vec4( 0, 0, 0 ,0 );
//    }

    // Same effect as alphaTest
    if ( color.a < 0.1f || endNotePosition.y > -0.0f ) {
        discard;
    } else {
        // Naive color mix.
        gl_FragColor = vec4( color.rgb, color.a ) ;
    }

//        gl_FragColor = vec4( 0.0,0.0,endNotePosition.y+1.0,1.0 ) ;

}