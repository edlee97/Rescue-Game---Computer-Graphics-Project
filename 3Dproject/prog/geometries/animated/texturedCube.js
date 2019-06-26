/**
 * A cube with a single textured applied in multiple different ways. A subclass
 * of TiltedCube.
 *
 * @author "Your Name Here"
 * @this {MultiTextureCube}
 */
class MultiTextureCube extends TiltedCube {
  constructor(size, centerX, centerY, centerZ, colors, texturePath) {
    super();
	this.path = texturePath;
	this.vertices = this.generateCubeVertices(size, centerX, centerY, centerZ);
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.Zvalue = centerZ;
	this.modelMatrix = new Matrix4();
	this.angleStep = 2;
	this.currentAngle = 0;
    this.textureCoordinates = this.generateUVCoordinates();
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
    // Recomendations: Remember uv coordinates are defined from 0.0 to 1.0.
  }

  /**
   * Renders MultiTextureCube.
   */
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
	//send2DTextureToGLSL(create2DTexture(this.path, gl.LINEAR, gl.LINEAR, gl.REPEAT, gl.REPEAT, send2DTextureToGLSL), 0, 'a_TexCoord');
	create2DTexture(this.path, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, function(texture) {
        send2DTextureToGLSL(texture, 0, 'u_Sampler');
    });
	sendUniformMatToGLSL(this.modelMatrix.elements, "u_transformMatrix");
	tellGLSLToDrawCurrentBuffer(GLvertices.length/3);
    // Recomendations: This will be the first time render will need to be
    // overloaded. Why? Because this is a textured geometry, not a geometry
    // which relies on a color value. Might want to use
  }
  updateAnimation() {
    this.modelMatrix.setTranslate(this.Xvalue, this.Yvalue, this.Zvalue);
    this.modelMatrix.rotate(this.currentAngle, 0.5, 0.5, 0.2);
	this.modelMatrix.translate(-this.Xvalue, -this.Yvalue, -this.Zvalue);
	this.currentAngle = this.currentAngle + this.angleStep;
  }
}
