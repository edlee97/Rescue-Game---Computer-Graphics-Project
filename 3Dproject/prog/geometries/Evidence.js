/*Evidence: What you're looking for*/
class Evidence extends Geometry {
  constructor(size, centerX, centerY, colors, tileX, tileY) {
    super();
	this.tickColor = [];
	this.Xtile = tileX;
	this.Ytile = tileY;
	this.selected = false;
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.vertices = this.generateCircleVertices(size, 6, centerX, centerY, colors);
	this.selectSquare = this.generateselectionCircle(size, centerX, centerY);
	this.selectSquareColors = generateuniformarray(1, 1, 1, 72);
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
  setTickColors(tickRed, tickGreen, tickBlue){
	this.tickColor[0] = tickRed;
	this.tickColor[1] = tickGreen;
	this.tickColor[2] = tickBlue;
	this.selectTileColors = generateuniformarray(tickRed/255, tickGreen/255, tickBlue/255, 72);
  }
  generateselectionCircle(size, centerX, centerY) {
	var k = 0;
	var comprad = size/2;
    var iteratedSegments = 0;
	var vertexIteration = 0;
	var currentAngle = 0;
	var iterationAngle = 60;
	var selectvertices = [];
	var LocalX = 0;
	var LocalY = 0;
	for (var i = 2; i < 18; i = i+3) {
	  selectvertices[i] = 0.01;
	}
	while(iteratedSegments<6){
      var DegreeRads = (currentAngle*Math.PI)/180;
	  LocalX = (comprad*Math.sin(DegreeRads)) + centerX;
	  LocalY = (comprad*Math.cos(DegreeRads)) + centerY;
	  selectvertices.push(LocalX);
	  selectvertices.push(LocalY);
	  vertexIteration++;
	  iteratedSegments++;
	}
	return selectvertices;
  }
  generateCircleVertices(radius, segments, centerX, centerY, colors) {
	var k = 0;
	var comprad = radius/4;
    var iteratedSegments = 0;
	var vertexIteration = 0;
	var currentAngle = 0;
	var iterationAngle = 360/segments;
	var cvertices = [];
	var LocalX = 0;
	var LocalY = 0;
	while(iteratedSegments<segments){
	  cvertices[vertexIteration] = new Vertex();
	  cvertices[vertexIteration].points[0] = centerX;
	  cvertices[vertexIteration].points[1] = centerY;
	  cvertices[vertexIteration].points[2] = 0.0;
	  vertexIteration++;
      var DegreeRads = (currentAngle*Math.PI)/180;
	  LocalX = (comprad*Math.sin(DegreeRads)) + centerX;
	  LocalY = (comprad*Math.cos(DegreeRads)) + centerY;
	  cvertices[vertexIteration] = new Vertex();
	  cvertices[vertexIteration].points[0] = LocalX;
	  cvertices[vertexIteration].points[1] = LocalY;
	  cvertices[vertexIteration].points[2] = 0.0;
	  vertexIteration++;
	  currentAngle = currentAngle + iterationAngle;
	  var DegreeRads = (currentAngle*Math.PI)/180;
	  LocalX = (comprad*Math.sin(DegreeRads)) + centerX;
	  LocalY = (comprad*Math.cos(DegreeRads)) + centerY;
	  cvertices[vertexIteration] = new Vertex();
	  cvertices[vertexIteration].points[0] = LocalX;
	  cvertices[vertexIteration].points[1] = LocalY;
	  cvertices[vertexIteration].points[2] = 0.0;
	  vertexIteration++;
	  iteratedSegments++;
	}
	for(var i=0; i<segments*3; i++){
	  for(var j=0; j<4; j++) {
	    cvertices[i].color[j] = colors[k];
		k++;
	  }
	}
	return cvertices;
  }
  unselectTile(){
	this.selected = false;
  }
  selectTile(){
	this.selected = true;
	HUDText1 = this.terrainType;
	HUDText2 = this.terrainDescription;
	HUDText3 = 'Position: (' + this.Xtile + ', ' + this.Ytile + ').';
  }
  render(selection){
	if (selection) {
	  var GLcolors = new Float32Array(this.selectTileColors);
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
	  gl.drawArrays(gl.LINE_LOOP, 0, 6);
	}
  }
}
