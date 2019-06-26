function click(gl, e){
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect();
  var pixels = new Uint8Array(4);
  driverScene.render(true);
  gl.readPixels(x - rect.left, rect.bottom - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  driverScene.selectObject(pixels);
  driverScene.render(false);
}

function mouseCoords(e) {
  var x = e.clientX;
  var y = e.clientY;
  var rect = e.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  var xyCoordinates = "Coordinates: (" + x + ", " + y + ")";
  document.getElementById("xyc").innerHTML = xyCoordinates;
}

function resetCoords() {
  document.getElementById("xyc").innerHTML = "Coordinates: ";
}

function WASD(event) {
  var key = event.keyCode;
  switch(key){
	case 27:
	  driverScene.selectObject(null);
	  break;
    case 65:
	  driverScene.moveCamera('left');
	  break;
	case 68:
	  driverScene.moveCamera('right');
	  break;
	case 69:
	  driverScene.moveCamera('up');
	  break;
	case 73:
	  driverScene.moveCamera('FOVin');
	  break;
	case 74:
	  driverScene.moveCamera('camerarotateLeft');
	  break;
	case 75:
	  driverScene.moveCamera('FOVout');
	  break;
	case 76:
	  driverScene.moveCamera('camerarotateRight');
	  break;
	case 78:
	  driverScene.toggleLight();
	  break;
	case 81:
	  driverScene.moveCamera('down');
	  break;
	case 83:
	  driverScene.moveCamera('back');
	  break;
	case 87:
	  driverScene.moveCamera('forward');
	  break;
	case 84: //T
	  driverScene.advanceTurn('forward');
	  break;
	case 71: //G
	  driverScene.advanceTurn('back');
	  break;
	case 70: //F
	  driverScene.advanceTurn('left');
	  break;
	case 72: //H
	  driverScene.advanceTurn('right');
	  break;
	case 82: //R
	  driverScene.rest();
	  break;
  }
}

function parseMap(){
  let Reader = new FileReader();
  var colorArray = [];
  var event = new Event('parsed');
  Reader.addEventListener("load", function() {
	var image = new Image();
	image.src = Reader.result;
    image.onload = function() {
      colorArray = (sampleImageColor(image));
      document.dispatchEvent(event);
	};
  }, false);
  Reader.readAsDataURL(colorUpload.files[0]);
  document.addEventListener('parsed', function(e) {
    if(colorArray.length > 0){
      createMap(colorArray);
    }
  }, false);
}

function advanceTime(hours){
  time = time + hours;
  if((time%24)>12){
	var sun = 'It is currently night.';
	usingLight = true;
	currentlyDay = false;
  } else {
	var sun = 'It is currently day.';
	usingLight = false;
	currentlyDay = true;
  }
  HUDTime = time + ' hours have passed. ' + sun;
}

function createMap(colors){
  driverScene.clearGeometry();
  var newcolors = colorconvert(colors);
  var k = 0;
  var l = 0;
  var i = 0;
  var x = 0;
  var y = 0;
  var iterations = Math.sqrt(newcolors.length/4);
  squareLength = Math.sqrt(newcolors.length/4);
  for(k = 0; k < iterations; k++){
	for(l = 0; l < iterations; l++){
      var R = newcolors[i];
	  var G = newcolors[i+1];
	  var B = newcolors[i+2];
	  var A = newcolors[i+3];
	  var tilecolor = [];
	  for(var j = 0; j < 36; j++){
	    tilecolor.push(R);
		tilecolor.push(G);
		tilecolor.push(B);
		tilecolor.push(A);
	  }
      i = i + 4;
	  var newTile = new Square(0.1, x, y, tilecolor, k, l);
	  driverScene.addGeometry(newTile);
      y = y + 0.1;
	}
	y = 0;
    x = x + 0.1;
  }
  var hiker = new Hiker(true, 0.075, StartAtX*0.1, StartAtY*0.1, generateuniformarray(0, 1, 1, 18), StartAtX, StartAtY);
  driverScene.addGeometry(hiker);
  if((LostAtX!=null) && (LostAtY!=null)){
    var friend = new Hiker(false, 0.075, LostAtX*0.1, LostAtY*0.1, generateuniformarray(1, 1, 0, 18), LostAtX, LostAtY);
    driverScene.addGeometry(friend);
  }
  driverScene.revealArea();
}

function showControlsTutorial(){
  alert("WASD to pan camera, IJKL to rotate/zoom, TFGH to move hiker, R to rest, ESC to unselect tile.");
}
function showMechanicsTutorial(){
  alert("Crossing the park expends Water and Fatigue. Certain terrain types will require more resources to cross than others. If you run out of water, you will expend Exhaustion much faster. If you run out of Exhaustion, you will collapse on the spot and wake up eight hours later with your Exhaustion partially restored. If you collapse without any Water, the game is over, you die, and your friend dies alone. Bummer.");
  alert("Day and night will pass as you search for your friend. At night, scoping out terrain becomes much more difficult. I recommend sleeping during the night, lest you run out of Exhaustion on a Tree or Water tile you didn't see coming!");
}

function updatePort(){
  var currentNear = document.getElementById('nearslider').value;
  driverScene.changeNearPort = currentNear;
  var nearString = "Current near viewport: " + currentNear;
  document.getElementById("neartext").innerHTML = nearString;
  var currentFar = document.getElementById('farslider').value;
  driverScene.changeFarPort = currentFar;
  var farString = "Current far viewport: " + currentFar;
  document.getElementById("fartext").innerHTML = farString;
}

function changeMode(){
  driverScene.changeViewMode();
  if(currentViewingMode == "perspective"){
    currentViewingMode = "orthogonal";
  } else {
    currentViewingMode = "perspective";
  }
  var modeString = "Current mode: " + currentViewingMode;
  document.getElementById("modetext").innerHTML = modeString;
}
  
function colorconvert(colorarray){
  var newarray = [];
  for (var i = 0; i < colorarray.length; i++){
    newarray[i] = colorarray[i]/255;
  }
  return newarray;
}

function to1DArray(x, y){
  if((x>=0) && (y>=0) && (x<=squareLength) && (y<=squareLength)){
	var index = squareLength*x + y;
	return index;
  } else {
    return null;
  }
}

function updateFPS(t1, t0) {
  var frametime = 1000 / (t1 - t0);
  if(frametime > 999){
    frametime = ("A lot");
  }
  var frameMessage = "Frames per second: " + frametime;
  document.getElementById("framesperSecond").innerHTML = frameMessage;
}

function generateuniformarray(red, green, blue, number) {
  var blankarray = [];
  for (var i = 0; i < number; i = i + 4) {
    blankarray[i] = red;
	blankarray[i+1] = green;
	blankarray[i+2] = blue;
	blankarray[i+3] = 1.0;
  }
  return blankarray;
}
  
function hasElement(arr, elem) {
  for(var i = 0; i<arr.length; i++){
	if (arr[i] == elem){
	  return true;
	}
  }
  return false;
}
function halfarr(arr){
  var halfarr = [];
  for(var i = 0; i<arr.length; i++){
	halfarr[i] = arr[i]/2;
  }
  return halfarr;
}

function redarr(arr){
  var redarr = [];
  for(var i = 0; i<arr.length; i++){
	redarr[i] = arr[i] - 1;
  }
  return redarr;
}

function clearCanvas() {
  driverScene.clearGeometry();
}