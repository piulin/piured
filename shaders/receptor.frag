varying vec2 vUv;
uniform sampler2D textureReceptor;

// Color contribution of the active receptor.
uniform float activeColorContribution ;

void main() {

    // Position of the receptor in the texture
    vec2 receptorUVOffset = vec2( 0, 1.0f/2.0f ) ;
    vec2 receptorUVRepeat = vec2( 1, 1.0f/2.0f ) ;

    // Position of the activeReceptor in the texture
    // vec2 activeReceptorUVOffset = vec2( 0, 0 ) ;
    vec2 activeReceptorUVRepeat = vec2( 1, 1.0f/2.0f ) ;

    // Getting colors
    vec4 receptorColor = texture2D(textureReceptor, vUv*receptorUVRepeat + receptorUVOffset);
    vec4 activeColor = texture2D(textureReceptor, vUv*activeReceptorUVRepeat);


    if ( activeColor.a < 0.9 ) {
        activeColor = vec4( 0, 0, 0 ,0 );
    }

    // Same effect as alphaTest
    if ( receptorColor.a < 0.9 ) {
        discard;
    } else {
        // Naive color mix. Change color contribution
        gl_FragColor = vec4( (receptorColor.rgb + activeColor.rgb*activeColorContribution), receptorColor.a) ;
    }

}