/**
 * Specifies a tilted cube which rotates.
 *
 * @author Edward Lee
 * @this {TiltedCube}
 */
class TiltedCube extends Geometry {
  constructor(size, centerX, centerY, centerZ, colors) {
    var k = 0;
    super();
	this.vertices = this.generateCubeVertices(size, centerX, centerY, centerZ);
	if(colors!=null){
      for(var i=0; i<this.vertices.length; i++){
	    for(var j=0; j<4; j++) {
	      this.vertices[i].color[j] = colors[k];
		  k++;
	    }
	  }
	}
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.modelMatrix = new Matrix4();
	this.angleStep = 2;
	this.currentAngle = 0;
  }

  generateCubeVertices(size, centerX, centerY, centerZ) {
    var height = size/2;
	var pheightarray = [1, 2, 3, 4, 5, 6, 13, 14, 18, 19, 21, 24, 25, 28, 29, 31, 34, 35];
	var pxharray = [2, 4, 5, 8, 10, 11, 13, 14, 15, 16, 17, 18, 27, 29, 30, 33, 35, 36];
	var pyharray = [1, 2, 4, 7, 8, 10, 13, 15, 16, 19, 20, 22, 25, 26, 27, 28, 29, 30];
	pheightarray = redarr(pheightarray);
	pxharray = redarr(pxharray);
	pyharray = redarr(pyharray);
	var cubevertices = [];
    for (var i = 0; i < 36; i++) {
	  cubevertices[i] = new Vertex();
	  for (var j = 0; j < 3; j++) {
		if(j==0){
		  if(hasElement(pxharray, i)){
			cubevertices[i].points[j] = centerX+height;
		  } else {
			cubevertices[i].points[j] = centerX-height;
	      }
		}
		if(j==1){
		  if(hasElement(pyharray, i)){
			cubevertices[i].points[j] = centerY+height;
		  } else {
			cubevertices[i].points[j] = centerY-height;
		  }
		}
		if(j==2){
		  if(hasElement(pheightarray, i)){
			cubevertices[i].points[j] = centerZ+height;
		  } else {
			cubevertices[i].points[j] = centerZ-height;
		  }
		}
	  }
	  if(((i+1)%3)==0){
        var Ux = (cubevertices[i-1].points[0]) - (cubevertices[i-2].points[0]);
		var Uy = (cubevertices[i-1].points[1]) - (cubevertices[i-2].points[1]);
		var Uz = (cubevertices[i-1].points[2]) - (cubevertices[i-2].points[2]);
		var Vx = (cubevertices[i].points[0]) - (cubevertices[i-2].points[0]);
		var Vy = (cubevertices[i].points[1]) - (cubevertices[i-2].points[1]);
		var Vz = (cubevertices[i].points[2]) - (cubevertices[i-2].points[2]);
		var Nx = Uy*Vz - Uz*Vy;
		var Ny = Uz*Vx - Ux*Vz;
		var Nz = Ux*Vy - Uy*Vx;
		cubevertices[i-2].normal[0] = Nx;
		cubevertices[i-2].normal[1] = Ny;
		cubevertices[i-2].normal[2] = Nz;
		cubevertices[i-1].normal[0] = Nx;
		cubevertices[i-1].normal[1] = Ny;
		cubevertices[i-1].normal[2] = Nz;
		cubevertices[i].normal[0] = Nx;
		cubevertices[i].normal[1] = Ny;
		cubevertices[i].normal[2] = Nz;
	  }
	}
	return cubevertices;
  }
  updateAnimation() {
    this.modelMatrix.setTranslate(this.Xvalue, this.Yvalue, 0);
    this.modelMatrix.rotate(this.currentAngle, 0.5, 0.5, 0.2);
	this.modelMatrix.translate(-this.Xvalue, -this.Yvalue, 0);
	this.currentAngle = this.currentAngle + this.angleStep;
	return;
  }
}
