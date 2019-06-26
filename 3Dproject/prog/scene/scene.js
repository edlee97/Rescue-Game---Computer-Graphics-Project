/**
 * Specifies a WebGL scene.
 *
 * @author Edward Lee
 * @this {Scene}
 */
class Scene {
  constructor() {
    this.geometries = [];
    this.targetFound = false;
	this.passableTerrain = true;
	this.foundMessage = false;
	this.lightX = 0.0;
	this.lightY = 0.0;
	this.lightZ = 1.0;
	this.lightRed = 1.0;
	this.lightGreen = 1.0;
	this.lightBlue = 1.0;
	this.amblightRed = 0.6;
	this.amblightGreen = 0.6;
	this.amblightBlue = 0.6;
	this.tickRed = 0;
	this.tickGreen = 0;
	this.tickBlue = 0;
	this.hikerIndex = 0;
    this.friendIndex = null;
	this.index = null;
	this.FOV = 50;
	this.NearPort = 1;
	this.FarPort = 100;
	this.cameraX = 0.0;
    this.cameraY = 0.0;
    this.cameraZ = 2.0;
	this.angleHorizontal = 0.0;
	this.horizontalRads = (this.angleHorizontal*Math.PI)/180;
	this.viewMatrix = new Matrix4();
	this.fovMatrix = new Matrix4();
	this.fovMatrix.setPerspective(this.FOV, canvas.width/canvas.height, this.NearPort, this.FarPort);
	gl.clearColor(0.15, 0.30, 0.10, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  getFriendIndex(){
	return this.friendIndex;
  }
  updateFOV(){
	var FOVstring = "FOV: " + this.FOV;
	document.getElementById('currentFOV').innerHTML = FOVstring;
  }
  
  changeViewMode(){
    if(this.PerspectiveMode){
      this.PerspectiveMode = false;
    } else {
      this.PerspectiveMode = true;
    }
  }

  toggleLight(){
	if(usingLight){
	  usingLight = false;
	} else {
	  usingLight = true;
	}
  }
  
  changeNearPort(value){
    this.NearPort = value;
  }
  
  changeFarPort(value){
	this.FarPort = value;
  }
  
  selectObject(colorID){
	if(this.geometries[this.index]!=null){
	  this.geometries[this.index].unselectTile();
	}
    this.index = (colorID[0] + colorID[1] + colorID[2]);
	if(this.geometries[this.index]!=null){
	  this.geometries[this.index].selectTile();
    }
  }
  addGeometry(geometry) {
	geometry.setTickColors(this.tickRed, this.tickGreen, this.tickBlue);
    this.geometries.push(geometry);
	if(geometry instanceof Hiker){
      if(geometry.returnPlayer()){
	    this.hikerIndex = this.tickRed + this.tickGreen*256 + this.tickBlue*65536;
		var coords = this.geometries[this.hikerIndex].getCoords();
        var x = coords[0];
	    var y = coords[1];
		this.cameraX = x * 0.1;
		this.cameraY = y * 0.1;
      } else {
        this.friendIndex = this.tickRed + this.tickGreen*256 + this.tickBlue*65536;
      }
    }
	if(this.tickRed<255){
	  this.tickRed++;
	} else if(this.tickGreen<255){
	  this.tickGreen++;
      this.tickRed = 0;
	} else if(this.tickBlue<255){
	  this.tickBlue++;
      this.tickGreen = 0;
      this.tickRed = 0;
	} else {
	  console.log("Error: Too many objects!");
	}
  }

  clearGeometry(){
	this.geometries.length = 0;
	this.targetFound = false;
	this.passableTerrain = true;
	this.foundMessage = false;
	this.tickRed = 0;
	this.tickGreen = 0;
	this.tickBlue = 0;
	this.hikerIndex = 0;
    this.friendIndex = null;
	this.index = null;
	time = 0;
	currentlyDay = true;
	usingLight = false;
  }
  
  updateAnimation() {
    var n = this.geometries.length;
	for(var i=0; i<n; i++){
	  if(this.geometries[i]!=null){
	    this.geometries[i].updateAnimation();
	  }
	}
  }
  
  rest(){
	var hiker = this.hikerIndex + 0;
	var friend = this.friendIndex + 0;
	var friendDiscovered = this.geometries[friend].isRevealed();
	var resources = this.geometries[hiker].getWaterandFatigue();
	var water = resources[0];
	var hikerCoords = this.geometries[hiker].getCoords();
	var hikerTile = to1DArray(hikerCoords[0], hikerCoords[1]);
	var hikerTileType = this.geometries[hikerTile].getTerrain();
	if(hikerTileType=='Water'){
	  HUDText1 = 'You cannot rest in running water!';
	  return;
	}
	if(friendDiscovered){
	  if(water<20){
		HUDText1 = 'You need at least 20 water to properly rest two people.';
		return;
	  } else {
		this.geometries[hiker].reduceWater(20);
	    advanceTime(8);
	    HUDText1 = 'The two of you rest for 8 hours. Fatigue replenished.';
	    this.geometries[hiker].replenishFatigue(true);
	    resources = this.geometries[hiker].getWaterandFatigue();
	    HUDText2 = 'Fatigue: ' + resources[1] + '/100' ;
	    HUDText3 = 'Water: ' + resources[0] + '/150';
	  }
	} else {
	  if(water<10){
		HUDText1 = 'You need at least 10 water to properly rest yourself.';
		return;
	  } else {
		this.geometries[hiker].reduceWater(10);
	    advanceTime(8);
	    HUDText1 = 'You rest for 8 hours. Fatigue replenished.';
	    this.geometries[hiker].replenishFatigue(true);
	    resources = this.geometries[hiker].getWaterandFatigue();
	    HUDText2 = 'Fatigue: ' + resources[1] + '/100' ;
	    HUDText3 = 'Water: ' + resources[0] + '/150';
	  }
	}
  }
  
  collapse(){
	var hiker = this.hikerIndex + 0;
	var friend = this.friendIndex + 0;
	var friendDiscovered = this.geometries[friend].isRevealed();
	var resources = this.geometries[hiker].getWaterandFatigue();
	var hikerCoords = this.geometries[hiker].getCoords();
	var hikerTile = to1DArray(hikerCoords[0], hikerCoords[1]);
	var hikerTileType = this.geometries[hikerTile].getTerrain();
	if(hikerTileType=='Water'){
	  alert('You collapsed of exhaustion while crossing a moving river, sending you to the ocean - and thus to a watery grave. Try again.');
	  this.geometries[hiker].end();
	  this.geometries[this.friendIndex].end();
      HUDTime = 'Stats:';
      HUDText1 = 'You expired in ' + time + ' hours.';
	  HUDText2 = 'You took ' + moves + ' moves.';
	  HUDText3 = 'You drank ' + waterExpended + ' mL of water.';
	  HUDText4 = 'You expended ' + fatigueExpended + ' watts of power.';
      return;
	} else if(hikerTileType=='Trees'){
	  alert('You collapsed of exhaustion while climbing precipitous woodsome heights, falling to the ground and straight to heaven. Try again.');
	  this.geometries[hiker].end();
	  this.geometries[this.friendIndex].end();
      HUDTime = 'Stats:';
      HUDText1 = 'You expired in ' + time + ' hours.';
	  HUDText2 = 'You took ' + moves + ' moves.';
	  HUDText3 = 'You drank ' + waterExpended + ' mL of water.';
	  HUDText4 = 'You expended ' + fatigueExpended + ' watts of power.';
      return;
    } else {
      advanceTime(8);
	  HUDText1 = 'You collapse of exhaustion, waking 8 hours later and partially restoring Fatigue.';
	  this.geometries[hiker].replenishFatigue(false);
	  resources = this.geometries[hiker].getWaterandFatigue();
	  HUDText2 = 'Fatigue: ' + resources[1] + '/100' ;
	  HUDText3 = 'Water: ' + resources[0] + '/100';
	  return;
	}
  }
  advanceTurn(direction){
    if(this.geometries[this.index]!=null){
	  this.geometries[this.index].unselectTile();
	}
    var resources = this.geometries[this.hikerIndex].getWaterandFatigue();
    if(resources[1]<=0){
	  if(resources[0]>0){
		this.collapse();
		return;
	  } else {
        alert('You ran out of water and collapsed of exhaustion, sealing your fate - along with the fate of your friend - among the vultures and earthworms. Try again.');
		this.geometries[this.hikerIndex].end();
		this.geometries[this.friendIndex].end();
        HUDTime = 'Stats:';
        HUDText1 = 'You expired in ' + time + ' hours.';
	    HUDText2 = 'You took ' + moves + ' moves.';
	    HUDText3 = 'You drank ' + waterExpended + ' mL of water.';
	    HUDText4 = 'You expended ' + fatigueExpended + ' watts of power.';
        return;
      }
	}
	switch(direction){
	  case 'null':
	    break;
	  case 'forward':
	    this.passableTerrain = this.geometries[this.hikerIndex].moveHiker(0, 1);
		break;
	  case 'back':
	    this.passableTerrain = this.geometries[this.hikerIndex].moveHiker(0, -1);
		break;
	  case 'left':
	    this.passableTerrain = this.geometries[this.hikerIndex].moveHiker(-1, 0);
		break;
	  case 'right':
	    this.passableTerrain = this.geometries[this.hikerIndex].moveHiker(1, 0);
		break;
	}
	if(!this.passableTerrain){
	  return;
	}
    var coords = this.geometries[this.hikerIndex].getCoords();
	var friendCoords = this.geometries[this.friendIndex].getCoords();
    var x = coords[0];
	var y = coords[1];
    var arrayindex = to1DArray(x, y);
    if((arrayindex == 0) && (this.targetFound)){
      alert("You've found your friend and safely left the trail! Hopefully this will teach him to bring a map next time...");
      HUDTime = 'Stats:';
      HUDText1 = 'You found your friend in ' + time + ' hours.';
	  HUDText2 = 'You took ' + moves + ' moves.';
	  HUDText3 = 'You drank ' + waterExpended + ' mL of water.';
	  HUDText4 = 'You expended ' + fatigueExpended + ' watts of power.';
      return;
    } else {
      var currentTerrain = this.geometries[arrayindex].getTerrain();
      var waterLoss = this.geometries[arrayindex].getWaterLoss();
	  if(waterLoss==0){
		this.geometries[this.hikerIndex].replenishWater();
	  } else if(this.geometries[this.friendIndex].isRevealed()){
		waterLoss = waterLoss * 2;
	  }
      var fatigueLoss = this.geometries[arrayindex].getFatigueLoss();
      var timeLoss = this.geometries[arrayindex].getTimeLoss();
      this.geometries[this.hikerIndex].reduceWater(waterLoss);
      this.geometries[this.hikerIndex].reduceFatigue(fatigueLoss);
      advanceTime(timeLoss);
	  this.revealArea();
      this.geometries[this.hikerIndex].selectTile();
	  var friendX = friendCoords[0];
      var friendY = friendCoords[1];
      var distX = Math.abs(x-friendX);
      var distY = Math.abs(y-friendY);
      if((distX < 2) && (distY < 2)){
        this.targetFound = this.geometries[this.friendIndex].reveal();
		if(!this.foundMessage){
	      HUDText1 = "You've located your friend.";
	      HUDText2 = "He will now follow you. Return to the starting location.";
	      HUDText3 = "Be careful, for he has to drink water too...";
		  this.foundMessage = true;
        }
	  }
    }
  }
  revealArea(){
	var coords = this.geometries[this.hikerIndex].getCoords();
	var x = coords[0];
	var y = coords[1];
	if(currentlyDay){
	  for(var i = 0; i < 3; i++){
	    for(var j = 0; j < 3; j++){
		  var arrayindex = to1DArray((x-1+i), (y-1+j));
	      if((arrayindex!=null) && (arrayindex>=0) && (arrayindex<(squareLength*squareLength))){
		    this.geometries[arrayindex].revealTile();
		  }
	    }
	  }
    } else {
	  var arrayindex = to1DArray(x, y);
	  this.geometries[arrayindex].revealTile();
	}
  }
  moveCamera(direction){
    switch(direction){
      case 'right':
	    this.cameraX = this.cameraX + 0.05;
		break;
	  case 'left':
	    this.cameraX = this.cameraX - 0.05;
		break;
	  case 'forward':
	    this.cameraY = this.cameraY + 0.05;
		break;
	  case 'back':
	    this.cameraY = this.cameraY - 0.05;
		break;
	  case 'up':
	    this.cameraZ = this.cameraZ + 0.05;
		break;
	  case 'down':
	    this.cameraZ = this.cameraZ - 0.05;
		break;
	  case 'camerarotateRight':	
	    this.angleHorizontal = this.angleHorizontal + 5;
		this.horizontalRads = (this.angleHorizontal*Math.PI)/180;
		break;
	  case 'camerarotateLeft':
	    this.angleHorizontal = this.angleHorizontal - 5;
		this.horizontalRads = (this.angleHorizontal*Math.PI)/180;
		break;
	  case 'FOVin':
	    this.FOV--;
        this.updateFOV();
		break;
	  case 'FOVout':
	    this.FOV++;
		this.updateFOV();
		break;
	}
  }
  render(selection) {
	resize(canvas)
	gl.clearColor(0.15, 0.35, 0.15, 1.0);
	if((usingLight) && (!selection)){
	  useShader(gl, phongShader);
	  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
	  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
      gl.uniform3f(u_AmbientLight, this.amblightRed, this.amblightGreen, this.amblightBlue);
	  var lightColors = new Vector3([this.lightRed, this.lightGreen, this.lightBlue]);
	  sendUniformVec4ToGLSL(lightColors.elements, "u_LightColor");
	  var lightDirection = new Vector3([this.lightX, this.lightY, this.lightZ]);
	  lightDirection.normalize();
      gl.uniform3fv(u_LightDirection, lightDirection.elements);
	} else {
	  useShader(gl, rainbowShader);
	}
	var atZ = (-1*Math.cos(this.horizontalRads)) + this.cameraZ;
	var atX = (1*Math.sin(this.horizontalRads)) + this.cameraX;
	this.viewMatrix.setLookAt(this.cameraX, this.cameraY, this.cameraZ, atX, this.cameraY, atZ, 0, 1, 0);
	this.fovMatrix.setPerspective(this.FOV, canvas.width/canvas.height, this.NearPort, this.FarPort);
	sendUniformMatToGLSL(this.fovMatrix.elements, "u_ProjMatrix");
	sendUniformMatToGLSL(this.viewMatrix.elements, "u_ViewMatrix");
	gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var n = this.geometries.length;
	for(var i=0; i<n; i++){
	  if(this.geometries[i]!=null){
	    this.geometries[i].render(selection);
	  }
	}
  }
}
