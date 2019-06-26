class FOB extends Geometry {
  constructor(size, centerX, centerY, blufor){
	super();
	this.tickID = null;
	this.vertices = this.generateFOBvertices(size, centerX, centerY, blufor);
	this.centrallines = this.generateCentralLines(size, centerX, centerY, blufor);
	this.selectsquare = this.generateselectionsquare(size, centerX, centerY, blufor);
	this.blank = this.generatemonochromearray(1, 1, 1, 16);
	this.selectcolor = null;
	this.maxsupply = 20000;
	this.currentsupply = 20000;
	this.health = 2000;
	this.maxdamage = 2;
	this.range = 0.3;
	this.modelMatrix = new Matrix4();
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.selected = false;
	this.blufor = blufor;
	this.designation = "";
	this.vertexarray = [];
	this.colorarray = [];
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
	}
  }
  settick(number){
	this.tickID = number;
	this.selectcolor = this.generatemonochromearray(0, 0, this.tickID/255, 24);
  }
  returndesignation(){
	return this.designation;
  }
  setdesignation(string){
	this.designation = string;
  }
  isblufor(){
	return this.blufor;
  }
  getrange(){
	return this.range;
  }
  getregdamage(){
	return this.maxdamage;
  }
  getX(){
    return this.Xvalue;
  }
  getY(){
	return this.Yvalue;
  }
  isareg(){
	return false;
  }
  inflictDamage(damage){
	this.currentsupply = this.currentsupply - damage;
  }
  getFOBsupply(){
	return this.curentsupply;
  }
  isSelected(){
	return this.selected;
  }
  unselect(number) {
	this.selected = false;
  }
  move(x, y){
	return;
  }
  onselect() {
	this.selected = true;
  }
  getreghealth(){
	return this.currentsupply;
  }
  generateCentralLines(size, centerX, centerY, blufor) {
	var height = size/2;
	var cvertices = [];
	for (var i = 2; i < 6; i = i+3) {
	  cvertices[i] = 0.001;
	}
	if(blufor){
	  cvertices[0] = centerX + height;
	  cvertices[1] = (centerY - height)/2.2;
	  cvertices[3] = centerX - height;
	  cvertices[4] = (centerY - height)/2.2;
	} else {
	  cvertices[0] = centerX + height/2;
	  cvertices[1] = centerY - height/2;
	  cvertices[3] = centerX - height/2;
	  cvertices[4] = centerY - height/2;
	}
	return cvertices;
  }
  generateFOBvertices(size, centerX, centerY, blufor) {
	var k = 0;
    var height = size/2;
	var regvertices = [];
	var colors = [];
	for (var i = 0; i < 6; i++) {
	  regvertices[i] = new Vertex();
	  regvertices[i].points[2] = 0.0;
	}
	if(blufor){
	  regvertices[0].points[0] = centerX-height;
	  regvertices[0].points[1] = (centerY-height)/2;
	  regvertices[1].points[0] = centerX-height;
	  regvertices[1].points[1] = (centerY+height)/2;
	  regvertices[2].points[0] = centerX+height;
	  regvertices[2].points[1] = (centerY+height)/2;
	  regvertices[3].points[0] = centerX+height;
	  regvertices[3].points[1] = (centerY+height)/2;
	  regvertices[4].points[0] = centerX+height;
	  regvertices[4].points[1] = (centerY-height)/2;
	  regvertices[5].points[0] = centerX-height;
	  regvertices[5].points[1] = (centerY-height)/2;
	  colors = this.generatemonochromearray(0.1, 0.3, 0.7, 24);
	} else {
	  regvertices[0].points[0] = centerX;
	  regvertices[0].points[1] = centerY+height;
	  regvertices[1].points[0] = centerX+height;
	  regvertices[1].points[1] = centerY;
	  regvertices[2].points[0] = centerX;
	  regvertices[2].points[1] = centerY-height;
	  regvertices[3].points[0] = centerX;
	  regvertices[3].points[1] = centerY+height;
	  regvertices[4].points[0] = centerX;
	  regvertices[4].points[1] = centerY-height;
	  regvertices[5].points[0] = centerX-height;
	  regvertices[5].points[1] = centerY;
	  colors = this.generatemonochromearray(0.7, 0.3, 0.1, 24);
	}
	for(var i=0; i<6; i++){
	  for(var j=0; j<4; j++) {
	    regvertices[i].color[j] = colors[k];
		k++;
	  }
	}
	return regvertices;
  }
  generateselectionsquare(size, centerX, centerY, blufor) {
	var selectvertices = [];
	var margin = size * 0.6;
	for (var i = 2; i < 12; i = i+3) {
	  selectvertices[i] = -0.01;
	}
	if(blufor){
	  selectvertices[0] = centerX + margin;
	  selectvertices[1] = (centerY + margin)/2;
	  selectvertices[3] = centerX + margin;
	  selectvertices[4] = (centerY - margin)/2;
	  selectvertices[6] = centerX - margin;
	  selectvertices[7] = (centerY - margin)/2;
	  selectvertices[9] = centerX - margin;
	  selectvertices[10] = (centerY + margin)/2;
	} else {
	  selectvertices[0] = centerX 
	  selectvertices[1] = centerY + margin;
	  selectvertices[3] = centerX + margin;
	  selectvertices[4] = centerY;
	  selectvertices[6] = centerX;
	  selectvertices[7] = centerY - margin;
	  selectvertices[9] = centerX - margin;
	  selectvertices[10] = centerY;
	}
	return selectvertices;
  }
  generatemonochromearray(red, green, blue, number) {
	var blankarray = [];
	for (var i = 0; i < number; i = i + 4) {
      blankarray[i] = red;
	  blankarray[i+1] = green;
	  blankarray[i+2] = blue;
	  blankarray[i+3] = 1.0;
	}
	return blankarray;
  }
  render(selection){
	if(this.destroyed){
	  return;
	} else {
    if (selection) {
	  var GLcolors = new Float32Array(this.selectcolor);
	} else {
	  var GLcolors = new Float32Array(this.colorarray);
	}
	var GLvertices = new Float32Array(this.vertexarray);
	sendAttributeBufferToGLSL(GLvertices, 3, 'a_Position');
	sendAttributeBufferToGLSL(GLcolors, 4, "a_Color");
	sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	tellGLSLToDrawCurrentBuffer(GLvertices.length/3);
	GLcolors = new Float32Array(this.generatemonochromearray(0.0, 0.0, 0.0, 8));
	var GLnato = new Float32Array(this.centrallines);
	sendAttributeBufferToGLSL(GLnato, 3, 'a_Position');
	sendAttributeBufferToGLSL(GLcolors, 4, 'a_Color');
	sendUniformMatToGLSL(this.modelMatrix.elements, 'u_transformMatrix');
	gl.drawArrays(gl.LINES, 0, 2);
	if(this.selected){
	  GLcolors = new Float32Array(this.blank);
	  var GLselect = new Float32Array(this.selectsquare);
	  sendAttributeBufferToGLSL(GLselect, 3, 'a_Position');
	  sendAttributeBufferToGLSL(GLcolors, 4, 'a_Color');
	  sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	  gl.drawArrays(gl.LINE_LOOP, 0, 4);
	}
  }
  }
  updateAnimation() {
	return;
  }
}