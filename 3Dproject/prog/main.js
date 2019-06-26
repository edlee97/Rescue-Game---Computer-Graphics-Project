function main() {
  alert("Your friend went hiking in these parts. He is now missing. Find him, but be careful not to get lost yourself. (Make sure to check the tutorials!)");
  canvas = document.getElementById('mainCanvas');
  hud = document.getElementById('hud');
  ctx = hud.getContext('2d');
  resize(canvas);
  window.addEventListener('keydown', this.WASD);
  gl = getWebGLContext(canvas);
  driverScene = new Scene();
  usingLight = false;
  squareLength = 0;
  time = 0;
  HUDTime = 'Preparing canteen.';
  HUDText1 = 'Stretching.';
  HUDText2 = 'Lacing boots.';
  HUDText3 = 'Brushing off jacket.';
  HUDText4 = 'Lyfting to last known location.';
  moves = 0;
  waterExpended = 0;
  fatigueExpended = 0;
  StartAtX = null;
  StartAtY = null;
  LostAtX = null;
  LostAtY = null;
  currentlyDay = true;
  currentViewingMode = "perspective";
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  rainbowShader = createShader(gl, RAINBOW_VSHADER, RAINBOW_FSHADER);
  textureShader = createShader(gl, TEXTURE_VSHADER, TEXTURE_FSHADER);
  phongShader = createShader(gl, PHONG_VSHADER, PHONG_FSHADER);
  canvas.onmousedown = function(e){ click(gl, e); };
  tick();
}

function makecolor(){
  var j = 0;
  var carray = [];
  for(var i = 0; i < 36; i++){
	carray[j] = 1.0;
	carray[j+1] = 0.0;
	carray[j+2] = 0.0;
	carray[j+3] = 1.0;
	j = j + 4;
  }
  return carray;
}

function drawHUD(ctx){
  ctx.clearRect(0, 0, 400, 240);
  ctx.beginPath();
  ctx.moveTo(400, 0);
  ctx.lineTo(400, 240);
  ctx.lineTo(0, 240);
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.stroke();
  ctx.font = '14px "Arial"';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fillText(HUDTime, 20, 40);
  ctx.fillText(HUDText1, 20, 80);
  ctx.fillText(HUDText2, 20, 120);
  ctx.fillText(HUDText3, 20, 160);
  ctx.fillText(HUDText4, 20, 200);
}

function resize(canvas){
  var displayWidth  = window.innerWidth*0.8;
  var displayHeight = window.innerHeight*0.8;
  if (canvas.width  != displayWidth || canvas.height != displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}