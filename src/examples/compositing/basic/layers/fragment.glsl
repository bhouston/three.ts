precision highp float;

uniform sampler2D layerMap;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

#pragma include <color/spaces/srgb>

void main() {
  vec3 outputColor = vec3(0.);
  vec4 layerColor = texture2D( layerMap, v_uv );
  outputColor += sRGBToLinear( layerColor.rgb );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = layerColor.a;

}