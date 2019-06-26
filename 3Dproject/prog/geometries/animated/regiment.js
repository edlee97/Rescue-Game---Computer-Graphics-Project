class Regiment extends Geometry {
  constructor(size, centerX, centerY, type, blufor) {
    super();
	this.tickID = null;
	this.vertices = this.generateRegVertices(size, centerX, centerY, blufor);
	this.centrallines = this.generateCentralLines(size, centerX, centerY, blufor, type);
	this.selectsquare = this.generateselectionsquare(size, centerX, centerY, blufor);
	this.blank = this.generatemonochromearray(1, 1, 1, 16);
	this.selectcolor = null;
	this.unittype = type;
	this.minimumdamage = this.setminimumdamage(type);
	this.maxforces = 1000;
	this.forces = 1000;
	this.maxdamage = this.setmaximumdamage(type);
	this.range = this.setrange(type);
    this.modelMatrix = new Matrix4();
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.destinationX = centerX;
	this.destinationY = centerY;
	this.bearingX = 0;
	this.bearingY = 0;
	this.speed = this.setspeed(type);
	this.selected = false;
	this.destoyed = false;
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
  returntype(){
	return this.unittype;
  }
  setrange(type){
    if(type=="Infantry"){
	  var range = 0.3;
	} else if (type=="Armored"){
	  var range = 0.2;
	}
	return range;
  }
  setmaximumdamage(type){
	if(type=="Infantry"){
	  var maximumdamage = 1.0;
	} else if (type=="Armored"){
	  var maximumdamage = 1.5;
	}
	return maximumdamage;
  }
  setminimumdamage(type){
    if(type=="Infantry"){
	  var minimumdamage = 0.25;
	} else if (type=="Armored"){
	  var minimumdamage = 0.75;
	}
	return minimumdamage;
  }
  setspeed(type){
	if(type=="Infantry"){
	  var speed = 0.01;
	} else if (type=="Armored"){
	  var speed = 0.02;
	}
	return speed;
  }
  settick(number){
	this.tickID = number;
	this.selectcolor = this.generatemonochromearray(0, 0, this.tickID/255, 24);
  }
  getrange(){
	return this.range;
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
  isareg(){
	return true;
  }
  getreghealth(){
	return this.forces;
  }
  getregdamage(){
	var damage = this.maxdamage*(this.forces/this.maxforces);
	return Math.max(damage, this.minimumdamage);
  }
  isSelected(){
	return this.selected;
  }
  stop() {
	this.destinationX = this.Xvalue;
	this.destinationY = this.Yvalue;
	this.bearingX = 0;
	this.bearingY = 0;
  }
  unselect() {
	this.selected = false;
  }
  onselect() {
	this.selected = true;
  }
  inflictDamage(damage){
	this.forces = this.forces - damage;
  }
  move(x, y){
	if(this.selected){
	  this.destinationX = x;
	  this.destinationY = y;
	  var angle = Math.atan((this.destinationY-this.Yvalue)/(this.destinationX-this.Xvalue));
	  if ((this.destinationX-this.Xvalue) < 0) {
	    this.bearingX = Math.cos(angle)*-this.speed;
	    this.bearingY = Math.sin(angle)*-this.speed;
	  } else {
		this.bearingX = Math.cos(angle)*this.speed;
	    this.bearingY = Math.sin(angle)*this.speed;
	  }
    }
  }
  getX(){
    return this.Xvalue;
  }
  getY(){
	return this.Yvalue;
  }
  generateCentralLines(size, centerX, centerY, blufor, type) {
	var height = size/2;
	var mid = 2
	var cvertices = [];
	for (var i = 2; i < 12; i = i+3) {
	  cvertices[i] = 0.001;
	}
	if((blufor) && (type=="Infantry")){
	  cvertices[0] = centerX + height;
	  cvertices[1] = (centerY + height)/2;
	  cvertices[3] = centerX - height;
	  cvertices[4] = (centerY - height)/2;
	  cvertices[6] = centerX - height;
	  cvertices[7] = (centerY + height)/2;
	  cvertices[9] = centerX + height;
	  cvertices[10] = (centerY - height)/2;
	} else if ((blufor) && (type=="Armored")) {
	  cvertices[0] = centerX;
	  cvertices[1] = (centerY + height)/2;
	  cvertices[3] = centerX - height;
	  cvertices[4] = (centerY - height)/2;
	  cvertices[6] = centerX;
	  cvertices[7] = (centerY + height)/2;
	  cvertices[9] = centerX + height;
	  cvertices[10] = (centerY - height)/2;
	} else if ((!blufor) && (type=="Infantry")) {
	  cvertices[0] = centerX + height/mid;
	  cvertices[1] = centerY + height/mid;
	  cvertices[3] = centerX - height/mid;
	  cvertices[4] = centerY - height/mid;
	  cvertices[6] = centerX + height/mid;
	  cvertices[7] = centerY - height/mid;
	  cvertices[9] = centerX - height/mid;
	  cvertices[10] = centerY + height/mid;
	} else {
	  cvertices[0] = centerX;
	  cvertices[1] = centerY + height;
	  cvertices[3] = centerX - height/mid;
	  cvertices[4] = centerY - height/mid;
	  cvertices[6] = centerX;
	  cvertices[7] = centerY + height;
	  cvertices[9] = centerX + height/mid;
	  cvertices[10] = centerY - height/mid;
	}
	return cvertices;
  }
  generateRegVertices(size, centerX, centerY, blufor) {
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
	GLcolors = new Float32Array(this.generatemonochromearray(0.0, 0.0, 0.0, 16));
	var GLnato = new Float32Array(this.centrallines);
	sendAttributeBufferToGLSL(GLnato, 3, 'a_Position');
	sendAttributeBufferToGLSL(GLcolors, 4, 'a_Color');
	sendUniformMatToGLSL(this.modelMatrix.elements, 'u_transformMatrix');
	gl.drawArrays(gl.LINES, 0, 4);
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
	if(this.destroyed){
	  return;
	} else {
	this.modelMatrix.translate(this.bearingX, this.bearingY, 0);
	this.Xvalue = this.Xvalue + this.bearingX;
	this.Yvalue = this.Yvalue + this.bearingY;
	if((Math.abs(this.destinationX - this.Xvalue) <= 0.01) && (Math.abs(this.destinationY - this.Yvalue) <= 0.01)){
	  this.bearingX = 0;
	  this.bearingY = 0;
	}
  }
  }
}
