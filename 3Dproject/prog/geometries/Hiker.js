/**
 * Specifies a Square. A subclass of Geometry.
 *
 * @author Edward Lee
 * @this {Square}
 */
class Hiker extends Geometry {
  constructor(isPlayer, size, centerX, centerY, colors, tileX, tileY) {
    super();
    this.isPlayer = isPlayer;
    if(this.isPlayer){
      this.revealed = true;
    } else {
      this.revealed = false;
    }
	this.size = size;
	this.tickColor = [];
	this.water = 150;
	this.waterMax = 150;
	this.fatigue = 100;
	this.fatigueMax = 100;
	this.Xtile = tileX;
	this.Ytile = tileY;
	this.selected = false;
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.vertices = this.generateTriangleVertices(size, centerX, centerY, colors);
	this.selectSquare = this.generateselectionsquare(size, centerX, centerY);
	this.selectSquareColors = generateuniformarray(1, 1, 1, 16);
    this.Unrevealed = generateuniformarray(0, 0, 0, 36);
	this.selectTileColors = [];
	this.vertexarray = [];
	this.colorarray = [];
	this.normalarray = [];
    for(var i = 0; i<this.vertices.length; i++){
	  for(var j = 0; j < 3; j++){
		if(this.vertices[i].points.elements){
		  this.vertexarray.push(this.vertices[i].points.elements[j]);
		} else {
	      this.vertexarray.push(this.vertices[i].points[j]);
        }
	  }
	  for(var k = 0; k < 4; k++){
		if(this.vertices[i].color.elements){
		  this.colorarray.push(this.vertices[i].color.elements[k]);
		} else {
		  this.colorarray.push(this.vertices[i].color[k]);
		}
	  }
	  for(var k = 0; k < 3; k++){
		if(this.vertices[i].normal.elements){
		  this.normalarray.push(this.vertices[i].normal.elements[k]);
		} else {
		  this.normalarray.push(this.vertices[i].normal[k]);
		}
	  }
	}
	this.GLvertices = new Float32Array(this.vertexarray);
	this.GLnormals = new Float32Array(this.normalarray);
	this.GLSelectColors = new Float32Array(this.selectSquareColors);
	this.GLSelectSquare = new Float32Array(this.selectSquare);
  }
  isRevealed(){
	return this.revealed;
  }
  reveal(){
    this.revealed = true;
	return true;
  }
  end(){
	this.revealed = false;
  }
  getWaterandFatigue(){
    var resources = [];
    resources.push(this.water);
    resources.push(this.fatigue);
    return resources;
  }
  returnPlayer(){
    return this.isPlayer;
  }
  replenishWater(){
	this.water = this.waterMax;
	HUDText3 = 'Water replenished to ' + this.waterMax;
  }
  reduceWater(reduce){
    if(this.water > 0){
      this.water = this.water - reduce;
      waterExpended = waterExpended + reduce;
	  if(this.water < 0){
		this.water = 0;
	  }
    } else {
      this.reduceFatigue(reduce);
    }
  }
  replenishFatigue(naturalRest){
	if(naturalRest){
	  this.fatigue = this.fatigueMax + 0;
    } else {
	  var half = (this.fatigueMax - this.fatigue)/2;
	  this.fatigue = this.fatigue + half;
	}
  }
  reduceFatigue(reduce){
    this.fatigue = this.fatigue - reduce;
    fatigueExpended = fatigueExpended + reduce;
	if(this.fatigue<=0){
	  this.fatigue = 0;
	}
  }
  setTickColors(tickRed, tickGreen, tickBlue){
	this.tickColor[0] = tickRed;
	this.tickColor[1] = tickGreen;
	this.tickColor[2] = tickBlue;
	this.selectTileColors = generateuniformarray(tickRed/255, tickGreen/255, tickBlue/255, 24);
  }
  generateselectionsquare(size, centerX, centerY) {
	var selectvertices = [];
	var height = size * 0.5;
	for (var i = 2; i < 9; i = i+3) {
	  selectvertices[i] = 0.01;
	}
	selectvertices[0] = centerX-height;
	selectvertices[1] = centerY-(height/Math.sqrt(3));
	selectvertices[3] = centerX+height;
	selectvertices[4] = centerY-(height/Math.sqrt(3));
	selectvertices[6] = centerX;
	selectvertices[7] = centerY+(height*Math.sqrt(3))-(height/Math.sqrt(3));
	return selectvertices;
  }
  generateuniformarray(red, green, blue, number) {
	var blankarray = [];
	for (var i = 0; i < number; i = i + 4) {
      blankarray[i] = red;
	  blankarray[i+1] = green;
	  blankarray[i+2] = blue;
	  blankarray[i+3] = 1.0;
	}
	return blankarray;
  }
  generateTriangleVertices(size, centerX, centerY, colors) {
	var k = 0;
    var height = size/2;
	var threevertexes = [];
	threevertexes[0] = new Vertex();
	threevertexes[1] = new Vertex();
	threevertexes[2] = new Vertex();
	threevertexes[0].points[0] = centerX-height;
	threevertexes[0].points[1] = centerY-(height/Math.sqrt(3));
	threevertexes[0].points[2] = 0.01;
	threevertexes[1].points[0] = centerX+height;
	threevertexes[1].points[1] = centerY-(height/Math.sqrt(3));
	threevertexes[1].points[2] = 0.01;
	threevertexes[2].points[0] = centerX;
	threevertexes[2].points[1] = centerY+(height*Math.sqrt(3))-(height/Math.sqrt(3));
	threevertexes[2].points[2] = 0.01;
	for(var i=0; i<3; i++){
	  for(var j=0; j<4; j++) {
	    threevertexes[i].color[j] = colors[k];
		k++;
	  }
	}
	return threevertexes;
  }
  getCoords(){
	var coords = [];
	coords.push(this.Xtile);
	coords.push(this.Ytile);
	return coords;
  }
  moveHiker(x, y){
	if(!this.revealed){
	  return;
	}
    var targetX = this.Xtile + x;
    var targetY = this.Ytile + y;
    var index = to1DArray(targetX, targetY);
    var terrain = driverScene.geometries[index].getTerrain();
    if(terrain=='Rocks'){
      HUDText1 = 'Rocks are impassable.';
      return false;
    } else if(!((this.Xtile+x)<0) && !((this.Xtile+x)>=squareLength) && !((this.Ytile+y)<0) && !((this.Ytile+y)>=squareLength)){
	  this.modelMatrix.translate(x*0.1, y*0.1, 0);
      moves++;
	  var friendIndex = driverScene.getFriendIndex();
	  if(friendIndex!=null){
	    if(driverScene.geometries[friendIndex].isRevealed()){
		  var coords = driverScene.geometries[friendIndex].getCoords();
		  var friendX = this.Xtile - coords[0];
		  var friendY = this.Ytile - coords[1];
		  driverScene.geometries[friendIndex].simpleMove(friendX, friendY);
		}
	  }
	  this.Xtile = targetX;
	  this.Ytile = targetY;
    }
	return true;
  }
  simpleMove(x, y){
	this.modelMatrix.translate(x*0.1, y*0.1, 0);
    this.Xtile = this.Xtile + x;
	this.Ytile = this.Ytile + y;
  }
  unselectTile(){
	this.selected = false;
  }
  selectTile(){
	this.selected = true;
    if(this.isPlayer){
      HUDText1 = 'The Venerable Hiker, aka You';
	  HUDText2 = 'Fatigue: ' + this.fatigue + '/' + this.fatigueMax;
	  HUDText3 = 'Water: ' + this.water + '/' + this.waterMax;
	  HUDText4 = 'Position: (' + this.Xtile + ', ' + this.Ytile + ').';
    } else if (!this.revealed) {
      HUDText1 = "Unexplored land! What could there be?";
      HUDText2 = '';
      HUDText3 = '';
      HUDText4 = 'Position: (' + this.Xtile + ', ' + this.Ytile + ').';
    } else {
      HUDText1 = 'Your Hapless Friend.';
      HUDText2 = 'He looks rough. Get him out of here the way you arrived.';
      HUDText3 = '';
      HUDText4 = 'Position: (' + this.Xtile + ', ' + this.Ytile + ').';
    }
  }
  render(selection){
	if (selection) {
	  var GLcolors = new Float32Array(this.selectTileColors);
	} else if (!this.revealed) {
	  var GLcolors = new Float32Array(this.Unrevealed);
    } else {
	  var GLcolors = new Float32Array(this.colorarray);
	}
    sendAttributeBufferToGLSL(this.GLvertices, 3, "a_Position");
	sendAttributeBufferToGLSL(GLcolors, 4, "a_Color");
	if(usingLight){
	  sendAttributeBufferToGLSL(this.GLnormals, 3, "a_Normal");
	}
	sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	tellGLSLToDrawCurrentBuffer(this.GLvertices.length/3);
	if((this.selected) && (this.revealed)){
	  sendAttributeBufferToGLSL(this.GLSelectSquare, 3, 'a_Position');
	  sendAttributeBufferToGLSL(this.GLSelectColors, 4, 'a_Color');
	  sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	  gl.drawArrays(gl.LINE_LOOP, 0, 3);
	}
  }
}
