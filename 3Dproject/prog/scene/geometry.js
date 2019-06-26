/**
 * Specifies a geometric object.
 *
 * @author Edward Lee
 * @this {Geometry}
 */

class Geometry {

  constructor() {
    this.vertices = [];
	this.shader = null;
	this.revealed = 0;
	this.modelMatrix = new Matrix4();
  }

  render() {
	var vertexarray = [];
	var colorarray = [];
	var normalarray = [];
    for(var i = 0; i<this.vertices.length; i++){
	  for(var j = 0; j < 3; j++){
		if(this.vertices[i].points.elements){
		  vertexarray.push(this.vertices[i].points.elements[j]);
		} else {
	      vertexarray.push(this.vertices[i].points[j]);
        }
	  }
	  for(var k = 0; k < 4; k++){
		if(this.vertices[i].color.elements){
		  colorarray.push(this.vertices[i].color.elements[k]);
		} else {
		  colorarray.push(this.vertices[i].color[k]);
		}
	  }
	  for(var k = 0; k < 3; k++){
		if(this.vertices[i].normal.elements){
		  normalarray.push(this.vertices[i].normal.elements[k]);
		} else {
		  normalarray.push(this.vertices[i].normal[k]);
		}
	  }
	}
	var GLcolors = new Float32Array(colorarray);
	var GLvertices = new Float32Array(vertexarray);
	var GLnormals = new Float32Array(normalarray);
    sendAttributeBufferToGLSL(GLvertices, 3, "a_Position");
	sendAttributeBufferToGLSL(GLcolors, 4, "a_Color");
	if(usingLight){
	  sendAttributeBufferToGLSL(GLnormals, 3, "a_Normal");
	}
	sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	tellGLSLToDrawCurrentBuffer(GLvertices.length/3);
  }
  
  updateAnimation() {
    return;
  }
}
