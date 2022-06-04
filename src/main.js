/*eslint-disable*/
import * as THREE from 'three';
import GameObject from './game_object';
import Scene from './scene';
import Player from './player';
import NpObject from './np_object';
import sky from './assets/images/sky.png';
import brick from './assets/images/brick.png';
import rf1 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-1.png';
import rf2 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-2.png';
import rf3 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-3.png';
import rf4 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-4.png';
import rf5 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-5.png';
import rf6 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-6.png';
import sf1 from './assets/images/Jumping Boy Sprites/Transparent PNG/standing/frame-1.png';
import sf2 from './assets/images/Jumping Boy Sprites/Transparent PNG/standing/frame-2.png';
import jf1 from './assets/images/Jumping Boy Sprites/Transparent PNG/jump/jump_up.png';
import jf2 from './assets/images/Jumping Boy Sprites/Transparent PNG/jump/jump_fall.png';

const SKY_BG_RENDER_ORDER = 1;
const WATER__BG_RENDER_ORDER = 2;

function createImage(src) {
  let image = new Image();
  image.src = src;
  return image;
}


const vs_water = `
precision mediump float;

const float pi = 3.14285714286;

uniform float iResolutionx;
uniform float iResolutiony;
uniform float iTime;

varying vec4 fragColor;

void main() 
{
  vec2 uv = position.xy / vec2(iResolutionx, iResolutiony).xy;
  uv.y = -1.0 - uv.y;
  vec3 fragCoord = position;
	
	// Modify using sinusodal functions to oscillate back and forth up in this.
	uv.x += sin(uv.y*10.0+iTime)/10.0;
  uv.y += sin(uv.x*10.0+iTime)/10.0;
  uv.x += sin(uv.y*10.0+iTime)/10.0;

  float mod_val = clamp(fract(abs(sin(fragCoord.x *iTime / 100.))), .7, .3);
  if (mod_val < .50) fragCoord.y += mod_val * 10.;
  else fragCoord.y -= mod_val * 10.;

  // fragCoord.y += wave;

  vec4 texture_color = vec4(.2, .2, .9, 1.0);
  vec4 k = vec4(iTime)*0.8;
	k.xy = uv * 15.0;
  float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
  float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
  float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
  vec4 color = vec4 ( pow(min(min(val1,val2),val3), 7.0) * 3.0)+texture_color;
  fragColor = color;
	vec4 modelViewPosition = modelViewMatrix * vec4(fragCoord, 1.0);
	gl_Position = projectionMatrix * modelViewPosition;
}
`

const vs_grass = `
precision mediump float;

uniform float iResolutionx;
uniform float iResolutiony;
uniform float iTime;

varying vec4 fragColor;

vec2 iResolution;

// #### CLOUDS/BACKGROUND
// Value noise
// https://www.shadertoy.com/view/lsf3WH
float hash(vec2 p)  // replace this by something better
{
    p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
    return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
}
float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( hash( i + vec2(0.0,0.0) ),
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ),
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}
// Fractal noise
float fbm(vec2 uv) {
    uv *= 8.0;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 ); // Rotation matrix
    float total = 0.0;
    float amplitude = 0.5;
	for (int i = 0; i < 4; i++) {
		total += noise(uv) * amplitude;
		uv = m * uv;
		amplitude *= 0.5;
	}
    // Modification to make background lighter and soften the darker parts
    total = 0.5 + 0.5*total;
	return total;
}


// #### GRASS
// https://www.shadertoy.com/view/MdBcWK -- This shadertoy was forked and used as a template. I adjusted and tweaked this code to produce my version. Most of the code is general. Specifically
// took curve function of the curve of grass and the blurring. I will denote with a * comment

float random(float co)
{
    //-- https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
    return fract(sin(dot(vec2(co ,co ) ,vec2(12.9898,78.233))) * 43758.5453);
}
float randomRange(float low, float high, float randy)
{
	return low + (high - low) * random(randy);
}
vec3 randomColor(vec3 col, vec3 variation, float randy)
{
    return vec3(col.x + randomRange(-variation.x, + variation.x, randy),
                col.y + randomRange(-variation.y, + variation.y, randy),
                col.z + randomRange(-variation.z, + variation.z, randy));
}
vec4 grass(vec2 p, int i, vec2 q, vec2 pos, float curve, float height)
{
    //Setting 0 to be bottom of screen
    pos = q + pos;
    pos.y += 0.5;
    
    //Grass radius
    float r = .005;
    
    //Shape of grass
    r = r * (1.0 - smoothstep(0.0, height, pos.y));
    
    //Grass curve function code x = c * y^2 *****
    float s = sign(curve);
    float grass_curve = abs(pos.x - s * pow(curve * pos.y, 2.0) );
    
    // Grass bluring function code ****
    float res = 1.0-(1.0 - smoothstep(r, r+0.006,grass_curve  )) * (1.0 - smoothstep(height-0.1, height, pos.y));
    
    //Coloring the grass
    vec3 bottom_color = randomColor(vec3(0.5,0.3,0.1), vec3(0.0,0.30,0.0), float(i));
    vec3 top_color =  randomColor(vec3(0.0,0.6,0.0), vec3(0.0,0.30,0.0), float(i));
    vec3 col = mix(bottom_color, top_color, pos.y);
    
    return vec4(col, 1.0-res);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = fragCoord.xy / iResolution.xy;
    // BACKGROUND/CLOUDS
    vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0) + iTime*0.025;
    vec3 skycolor = vec3(0.4, 0.7, 1.0);
    vec3 cloudcolor = vec3(1.0, 1.0, 1.0);
    float f = fbm(uv);
    vec3 col = mix(skycolor, cloudcolor, f); // background color
    
    // GRASS
    vec2 q = p - vec2(0.5, 0.33);
    q.x *= 0.5;
    for(int i = 0; i <300; i += 1)
    {
        float height = randomRange(.2, .4, float(i+2));
        
        //Grass curve vs height *****
        float max_curve = 1.0 - height + 0.30;
        float curve = 0.1*sin(iTime+float(i)) + randomRange(-max_curve, max_curve, float(i+1));
        vec2 pos = vec2(randomRange(-0.35, 0.35, float(i+3)) , 0.0);
        vec4 ret = grass(p,i,q*1.4, pos, curve, height);
        
        //Background blend *****
        col = mix(col, ret.xyz, ret.w);
    }
	fragColor = vec4(col,1.0);
}

void main() {
  iResolution = vec2(iResolutionx, iResolutiony);
  mainImage(fragColor, position.xy);
  vec4 scale = vec4(0.1);
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * modelViewPosition;
}
`

const fs_text = `
precision mediump float;

varying vec4 fragColor;

void main() {
	gl_FragColor = fragColor;
}
`
var renderer,
    scene,
    camera,
    context,
    env,
    player,
    waterMesh,
    skyMesh,
    front_canvas,
    back_canvas;

export default function start() {
  back_canvas = document.getElementById('back-canvas');
  front_canvas = document.getElementById('front-canvas');
  front_canvas.width = window.innerWidth;
  front_canvas.height = window.innerHeight;
  context = front_canvas.getContext('2d');
  

  //RENDERER
  renderer = new THREE.WebGLRenderer({
    canvas: back_canvas, 
    antialias: true
  });
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  env = new Scene(front_canvas.width, front_canvas.height);
  env.limit = 10000;
  const backGround = new GameObject(env.limit + env.width, env.height, new THREE.Vector2(0, 0), null);
  backGround.key = 'background';
  backGround.enableMovement();
  env.addChild(backGround);

  player = new Player(env, [
    createImage(sf1),
    createImage(sf2),
    createImage(rf1),
    createImage(rf2),
    createImage(rf3),
    createImage(rf4),
    createImage(rf5),
    createImage(rf6),
    createImage(jf1),
    createImage(jf2),
    (player) => {
      if (player.velocity.y === 0 && player.velocity.x === 0) {
        if (player.frame > 2) {
          player.frame = 0;
          player.frameStart = 0;
          player.frameLimit = 2;
        }
      } else if (player.velocity.y < 0) {
        if (player.frame !== 8) {
          player.frame = 8;
          player.frameStart = 8;
          player.frameLimit = 8;
        }
      } else if (player.velocity.y > player.parent.gravity) {
        if (player.frame !== 9) {
          player.frame = 9;
          player.frameStart = 9;
          player.frameLimit = 9;
        }
      } else if (player.velocity.x !== 0) {
        if (player.frame < 2 || player.frame > 7) {
          player.frame = 2;
          player.frameStart = 2;
          player.frameLimit = 7;
        }
      }
    }
  ]);
  player.enableMovement();

  let x_pos = 0;
  let obj;

  for (let i = 0; i < 500; i++) {
    obj = new NpObject(env, 0 + x_pos, 750, 200, 200, createImage(brick));
    obj.key = 'foreground';
    obj.enableMovement();

    obj = new NpObject(env, 350 + (200 * Math.min(i, 1) + i * front_canvas.width), 550, 150, 50, createImage(brick));
    obj.key = 'foreground';
    obj.enableMovement();

    obj = new NpObject(env, 750 + (200 * Math.min(i, 1) + i * front_canvas.width), 300, 200, 50, createImage(brick));
    obj.key = 'foreground';
    obj.enableMovement();

    obj = new NpObject(env, 100 + (200 * Math.min(i, 1) + i * front_canvas.width), 250, 200, 50, createImage(brick));
    obj.key = 'foreground';
    obj.enableMovement();

    obj = new NpObject(env, 600 + (200 * Math.min(i, 1) + i * front_canvas.width), 400, 75, 50, createImage(brick));
    obj.key = 'foreground';
    obj.enableMovement();

    x_pos += 400
  }

  //CAMERA
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000 );

  //SCENE
  scene = new THREE.Scene();

  //LIGHTS
  var light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  var light2 = new THREE.PointLight(0xffffff, 0.5);
  scene.add(light2);

  var uniforms = {
      iTime: {value: 0},
  };

  var skyMaterial = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, iResolutionx: {value: window.innerWidth + 1200}, iResolutiony: {value: 500} },
    vertexShader: vs_grass,
    fragmentShader: fs_text
  });

  var skyGeomerty = new THREE.PlaneGeometry(window.innerWidth + 1200, window.innerHeight + 200, 500, 500);
  skyMesh = new THREE.Mesh(skyGeomerty, skyMaterial);
  skyMesh.renderOrder = SKY_BG_RENDER_ORDER;
  skyMesh.position.z = -1000;
  skyMesh.position.y = -200;
  skyMesh.position.x = -600;

  var waterMaterial = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, iResolutionx: {value: window.innerWidth}, iResolutiony: {value: 150} },
    vertexShader: vs_water,
    fragmentShader: fs_text
  });

  var waterGeometry = new THREE.PlaneGeometry(window.innerWidth, 100, 100, 100);
  waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
  waterMesh.renderOrder = WATER__BG_RENDER_ORDER;
  waterMesh.position.z = -1000;
  waterMesh.position.y = -300


  scene.add(skyMesh);
  scene.add(waterMesh);

  //RENDER LOOP
  render();
}

const render  = (timeStamp)=> {
  context.clearRect(0, 0, front_canvas.width, front_canvas.height);
  env.update(context);
  env.draw(context);
  player.draw(context);
  player.update(context);
  waterMesh.material.uniforms.iTime.value = timeStamp / 1000;
  skyMesh.material.uniforms.iTime.value = timeStamp / 1000;
  renderer.render(scene, camera);
  if (env.gameOver) start();
  else requestAnimationFrame(render);
}