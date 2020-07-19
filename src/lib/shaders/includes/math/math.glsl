#pragma once

const float PI = 3.141592653589793;
const float PI2 = 6.283185307179586;
const float PI_HALF = 1.5707963267948966;
const float RECIPROCAL_PI = 0.3183098861837907;
const float RECIPROCAL_PI2 = 0.15915494309189535;
const float EPSILON = 1e-6;

float saturate( const in float a ) { return clamp( a, 0., 1. ); }
vec3 saturate( const in vec3 a ) { return clamp( a, 0., 1. ); }
vec3 whiteComplement( const in vec3 a ) { return 1.0 - saturate(a); }
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.333333333333 ) ); }

// https://stackoverflow.com/questions/9446888/best-way-to-detect-nans-in-opengl-shaders
bool isnan( const float val ) {
  return ( val < 0.0 || 0.0 < val || val == 0.0 ) ? false : true;
}
