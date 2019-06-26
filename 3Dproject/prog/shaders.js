var RAINBOW_VSHADER =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_transformMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_transformMatrix * a_Position;\n' +
  '  v_Color = a_Color;' +
  '}\n';

var RAINBOW_FSHADER =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;' +
  '}\n';
  
var TEXTURE_VSHADER = 
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_transformMatrix;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_transformMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

var TEXTURE_FSHADER = 
  'precision mediump float;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';
  
var PHONG_VSHADER = 
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_transformMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'varying vec4 v_Color;\n' +
  'uniform vec3 u_LightColor;\n' +
  'uniform vec3 u_LightDirection;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform vec3 u_AmbientLight;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_transformMatrix * a_Position;\n' +
  '  vec3 normal = normalize(vec3(a_Normal));\n' +
  '  float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +
  '  vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
  '  v_Color = vec4(diffuse + ambient, a_Color.a);\n' + 
  '}\n';
  
var PHONG_FSHADER = 
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;' +
  '}\n';