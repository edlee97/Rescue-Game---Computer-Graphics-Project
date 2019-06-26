class Voxel extends Geometry{
  constructor(height, x, z, colors){
	var k = 0;
    super();
	this.vertices = this.generateVoxelVertices(height, x, z);
	if(colors!=null){
      for(var i=0; i<this.vertices.length; i++){
	    for(var j=0; j<4; j++) {
	      this.vertices[i].color[j] = colors[k];
		  k++;
	    }
	  }
	}
	this.Xpos = x;
	this.Zpos = z;
	this.modelMatrix = new Matrix4();
  }
  generateVoxelVertices(height, x, z){
    var heightarray = [8, 9, 11, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 29, 33, 35, 36];
	var xarray = [1, 4, 5, 7, 9, 10, 13, 14, 15, 16, 17, 18, 19, 22, 23, 25, 27, 28];
	var zarray = [1, 2, 4, 7, 8, 9, 10, 11, 12, 13, 16, 17, 19, 20, 22, 31, 34, 35];
	heightarray = redarr(heightarray);
	xarray = redarr(xarray);
	zarray = redarr(zarray);
	var voxelvertices = [];
	for(var i = 0; i<36; i++){
      voxelvertices[i] = new Vertex();
	  for(var j=0; j<3; j++){
        if(j==0){
          if(hasElement(xarray, i)){
			voxelvertices[i].points[j] = x;
		  } else {
			voxelvertices[i].points[j] = x+0.5;
		  }
		}
		if(j==1){
		  if(hasElement(heightarray, i)){
			voxelvertices[i].points[j] = height;
		  } else {
			voxelvertices[i].points[j] = 0;
	      }
		}
		if(j==2){
		  if(hasElement(zarray, i)){
		    voxelvertices[i].points[j] = z;
		  } else {
			voxelvertices[i].points[j] = z+0.5;
		  }
		}
	  }
	  if((i%3)==2){
        var Ux = (voxelvertices[i-1].points[0]) - (voxelvertices[i-2].points[0]);
		var Uy = (voxelvertices[i-1].points[1]) - (voxelvertices[i-2].points[1]);
		var Uz = (voxelvertices[i-1].points[2]) - (voxelvertices[i-2].points[2]);
		var Vx = (voxelvertices[i].points[0]) - (voxelvertices[i-2].points[0]);
		var Vy = (voxelvertices[i].points[1]) - (voxelvertices[i-2].points[1]);
		var Vz = (voxelvertices[i].points[2]) - (voxelvertices[i-2].points[2]);
		var Nx = Uy*Vz - Uz*Vy;
		var Ny = Uz*Vx - Ux*Vz;
		var Nz = Ux*Vy - Uy*Vx;
		voxelvertices[i-2].normal[0] = Nx;
		voxelvertices[i-2].normal[1] = Ny;
		voxelvertices[i-2].normal[2] = Nz;
		voxelvertices[i-1].normal[0] = Nx;
		voxelvertices[i-1].normal[1] = Ny;
		voxelvertices[i-1].normal[2] = Nz;
		voxelvertices[i].normal[0] = Nx;
		voxelvertices[i].normal[1] = Ny;
		voxelvertices[i].normal[2] = Nz;
	  }
	}
	return voxelvertices;
  }
  updateAnimation(){
    return;
  }
}