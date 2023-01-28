// https://www.shadertoy.com/view/wt2GRt

precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec3 texture_color;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.y;
    vec4 k = vec4(iTime)*0.8;
    k.xy = uv * 10.0;
    float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
    float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
    float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
    vec4 color = vec4 ( pow(min(min(val1,val2),val3), 7.0) * 4.0) + vec4(texture_color, 1.0);
    gl_FragColor = color;
}