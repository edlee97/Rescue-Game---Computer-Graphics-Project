class Table extends Geometry {
  constructor() {
    super();
	this.path = 'external\/textures\/wood.jpg'
	this.vertices = this.generateTableVertices();
	this.modelMatrix = new Matrix4();
	this.textureCoordinates = this.generateUVCoordinates();
  }
  generateTableVertices() {
    var width = 2;
	var height = 0.25;
	var pheightarray = [1, 2, 3, 4, 5, 6, 13, 14, 18, 19, 21, 24, 25, 28, 29, 31, 34, 35];
	var pxharray = [2, 4, 5, 8, 10, 11, 13, 14, 15, 16, 17, 18, 27, 29, 30, 33, 35, 36];
	var pyharray = [1, 2, 4, 7, 8, 10, 13, 15, 16, 19, 20, 22, 25, 26, 27, 28, 29, 30];
	pheightarray = redarr(pheightarray);
	pxharray = redarr(pxharray);
	pyharray = redarr(pyharray);
	var tablevertices = [];
    for (var i = 0; i < 36; i++) {
	  tablevertices[i] = new Vertex();
	  for (var j = 0; j < 3; j++) {
		if(j==0){
		  if(hasElement(pxharray, i)){
			tablevertices[i].points[j] = width;
		  } else {
			tablevertices[i].points[j] = -width;
	      }
		}
		if(j==1){
		  if(hasElement(pyharray, i)){
			tablevertices[i].points[j] = width;
		  } else {
			tablevertices[i].points[j] = -width;
		  }
		}
		if(j==2){
		  if(hasElement(pheightarray, i)){
			tablevertices[i].points[j] = -0.02;
		  } else {
			tablevertices[i].points[j] = -height;
		  }
		}
	  }
	}
	return tablevertices;
  }
  generateUVCoordinates() {
    var texCoordinates = [
    1.0, 1.0,
	0.0, 1.0,
	1.0, 0.0,
	0.0, 1.0,
	0.0, 0.0,
	1.0, 0.0,
	//
	0.0, 1.0,
	1.0, 1.0,
	0.0, 0.0,
	1.0, 1.0,
	1.0, 0.0,
	0.0, 0.0,
	//
	1.0, 1.0,
	1.0, 0.0,
	0.0, 1.0,
	0.0, 1.0,
	0.0, 0.0,
	1.0, 0.0,
	//
	0.0, 1.0,
	1.0, 1.0,
	0.0, 0.0,
	1.0, 1.0,
	1.0, 0.0,
	0.0, 0.0,
	//
	0.0, 1.0,
	0.0, 0.0,
	1.0, 0.0,
	0.0, 1.0,
	1.0, 1.0,
	1.0, 0.0,
	//
	0.0, 0.0,
	0.0, 1.0,
	1.0, 1.0,
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	];
    return texCoordinates;
  }
  render() {
	useShader(gl, textureShader);
    var vertexarray = [];
    for(var i = 0; i<this.vertices.length; i++){
	  for(var j = 0; j < 3; j++){
		if(this.vertices[i].points.elements){
		  vertexarray.push(this.vertices[i].points.elements[j]);
		} else {
	      vertexarray.push(this.vertices[i].points[j]);
        }
	  }
	}
	var GLtextures = new Float32Array(this.textureCoordinates);
	var GLvertices = new Float32Array(vertexarray);
	sendAttributeBufferToGLSL(GLtextures, 2, 'a_TexCoord');
	sendAttributeBufferToGLSL(GLvertices, 3, 'a_Position');
	create2DTexture(this.path, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, function(texture) {
        send2DTextureToGLSL(texture, 0, 'u_Sampler');
    });
	sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	tellGLSLToDrawCurrentBuffer(GLvertices.length/3);
  }
  updateAnimation() {
	return;
  }
}