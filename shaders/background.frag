uniform vec3 uMaterialColor;
uniform float uKd;
uniform float uScale;
uniform float uThreshold;

uniform vec2 screenResolution;
uniform vec2 scanLineOpacity;


varying vec4 vModelPosition;
uniform vec2 curvature;
varying vec2 vUv;

#define PI 3.1415926538

vec2 curveRemapPos(vec2 uv)
{
    // as we near the edge of our screen apply greater distortion using a sinusoid.

    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

vec3 scanLineIntensity(float uv, float resolution, float opacity) {

    float intensity = sin(uv * resolution * PI * 2.0);
    intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
    return vec3(pow(intensity, opacity)) ;

}


void main() {

    vec2 mappedPos = curveRemapPos( vec2(vUv.x,vUv.y) ) ;

    // difuse circle
    float diffuse = sin(uScale*mappedPos.x) * sin(uScale*mappedPos.y)  ;

    vec3 texColor = uMaterialColor ;


    texColor *= scanLineIntensity(mappedPos.x, screenResolution.y, scanLineOpacity.x);
    texColor *= scanLineIntensity(mappedPos.y, screenResolution.x, scanLineOpacity.y);

    if ( diffuse > uThreshold ) {

        texColor *= uKd ;


    } else {
        texColor = vec3(0.0) ;
    }
    gl_FragColor = vec4( texColor, 1.0 );

}