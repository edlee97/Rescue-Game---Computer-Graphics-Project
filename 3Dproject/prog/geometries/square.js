/**
 * Specifies a Square. A subclass of Geometry.
 *
 * @author Edward Lee
 * @this {Square}
 */
class Square extends Geometry {
  constructor(size, centerX, centerY, colors, tileX, tileY) {
    super();
	this.Xtile = tileX;
	this.Ytile = tileY;
    this.WaterLoss = 1;
    this.FatigueLoss = 0;
    this.TimeLoss = 0;
	this.tickColor = [];
	this.selected = false;
	this.revealed = false;
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.vertices = this.generateSquareVertices(size, centerX, centerY, colors);
	this.selectSquare = this.generateselectionsquare(size, centerX, centerY);
	this.selectSquareColors = generateuniformarray(1, 1, 1, 16);
	this.Unrevealed = generateuniformarray(0, 0, 0, 36);
	this.terrainDescription = '';
	this.terrainType = this.setTerrainType(colors);
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
  getTerrain(){
    return this.terrainType;
  }
  getWaterLoss(){
    return this.WaterLoss;
  }
  getFatigueLoss(){
    return this.FatigueLoss;
  }
  getTimeLoss(){
    return this.TimeLoss;
  }
  setTerrainType(colors){
	var terrain = '';
	if((colors[0]==(25/255)) && (colors[1]==(100/255)) && (colors[2]==(25/255))){
	  terrain = 'Grass';
	  this.terrainDescription = 'Flat, lightly grown grass.';
      this.WaterLoss = 5;
      this.FatigueLoss = 5;
      this.TimeLoss = 1;
    } else if ((colors[0]==(25/255)) && (colors[1]==(100/255)) && (colors[2]==(26/255))){
	  terrain = 'Grass';
	  this.terrainDescription = 'Flat, lightly grown grass.';
      this.WaterLoss = 5;
      this.FatigueLoss = 5;
      this.TimeLoss = 1;
      LostAtX = this.Xtile;
      LostAtY = this.Ytile;
    } else if ((colors[0]==(81/255)) && (colors[1]==(64/255)) && (colors[2]==(33/255))){
	  terrain = 'Trees';
	  this.terrainDescription = 'Healthy, fully-grown trees. Difficult to climb.';
      this.WaterLoss = 5;
      this.FatigueLoss = 15;
      this.TimeLoss = 2;
	} else if ((colors[0]==(84/255)) && (colors[1]==(165/255)) && (colors[2]==(255/255))){
	  terrain = 'Water';
	  this.terrainDescription = 'Clean, running water. Refills your canteen, but lethal if you collapse here!';
      this.WaterLoss = 0;
      this.FatigueLoss = 20;
      this.TimeLoss = 4;
	} else if ((colors[0]==(193/255)) && (colors[1]==(154/255)) && (colors[2]==(91/255))){
	  terrain = 'Dirt';
	  this.terrainDescription = 'Flat, dry, ungrown dirt.';
      this.WaterLoss = 10;
      this.FatigueLoss = 5;
      this.TimeLoss = 1;
	} else if ((colors[0]==(193/255)) && (colors[1]==(154/255)) && (colors[2]==(92/255))){
	  terrain = 'Dirt';
	  this.terrainDescription = 'Flat, dry, ungrown dirt.';
      this.WaterLoss = 10;
      this.FatigueLoss = 5;
      this.TimeLoss = 1;
	  StartAtX = this.Xtile;
	  StartAtY = this.Ytile;
	} else if ((colors[0]==(66/255)) && (colors[1]==(66/255)) && (colors[2]==(66/255))){
	  terrain = 'Rocks';
	  this.terrainDescription = 'Rough, precipitous cliff face. Impassable.';
      this.WaterLoss = null;
      this.FatigueLoss = null;
      this.TimeLoss = null;
	} else {
      terrain = 'Some kind of terrain';
	  this.terrainDescription = 'This terrain defies explanation!';
      this.WaterLoss = 5;
      this.FatigueLoss = 10;
      this.TimeLoss = 2;
    }
	return terrain;
  }
  setTickColors(tickRed, tickGreen, tickBlue){
	this.tickColor[0] = tickRed;
	this.tickColor[1] = tickGreen;
	this.tickColor[2] = tickBlue;
	this.selectTileColors = generateuniformarray(tickRed/255, tickGreen/255, tickBlue/255, 24);
  }
  generateselectionsquare(size, centerX, centerY) {
	var selectvertices = [];
	var margin = size * 0.5;
	for (var i = 2; i < 12; i = i+3) {
	  selectvertices[i] = 0.01;
	}
	selectvertices[0] = centerX + margin;
	selectvertices[1] = (centerY + margin);
	selectvertices[3] = centerX + margin;
	selectvertices[4] = (centerY - margin);
	selectvertices[6] = centerX - margin;
	selectvertices[7] = (centerY - margin);
	selectvertices[9] = centerX - margin;
	selectvertices[10] = (centerY + margin);
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
  generateSquareVertices(size, centerX, centerY, colors) {
	var k = 0;
    var height = size/2;
	var squarevertices = [];
	for (var i = 0; i < 6; i++) {
	  squarevertices[i] = new Vertex();
	  squarevertices[i].points[2] = 0.0;
	}
	squarevertices[0].points[0] = centerX-height;
	squarevertices[0].points[1] = centerY-height;
	squarevertices[1].points[0] = centerX-height;
	squarevertices[1].points[1] = centerY+height;
	squarevertices[2].points[0] = centerX+height;
	squarevertices[2].points[1] = centerY+height;
	squarevertices[3].points[0] = centerX+height;
	squarevertices[3].points[1] = centerY+height;
	squarevertices[4].points[0] = centerX+height;
	squarevertices[4].points[1] = centerY-height;
	squarevertices[5].points[0] = centerX-height;
	squarevertices[5].points[1] = centerY-height;
	for(var i=0; i<6; i++){
	  for(var j=0; j<4; j++) {
	    squarevertices[i].color[j] = colors[k];
		k++;
	  }
	}
	return squarevertices;
  }
  revealTile(){
	this.revealed = true;
  }
  unselectTile(){
	this.selected = false;
  }
  selectTile(){
	this.selected = true;
	if(this.revealed){
	  HUDText1 = this.terrainType;
	  HUDText2 = this.terrainDescription;
      HUDText3 = this.WaterLoss + ' water, ' + this.FatigueLoss + ' fatigue to cross.';
	} else {
	  HUDText1 = 'Unexplored land! What could there be?';
	  HUDText2 = '';
      HUDText3 = '';
	}
	HUDText4 = 'Position: (' + this.Xtile + ', ' + this.Ytile + ').';
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
	if(this.selected){
	  sendAttributeBufferToGLSL(this.GLSelectSquare, 3, 'a_Position');
	  sendAttributeBufferToGLSL(this.GLSelectColors, 4, 'a_Color');
	  sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	  gl.drawArrays(gl.LINE_LOOP, 0, 4);
	}
  }
}
