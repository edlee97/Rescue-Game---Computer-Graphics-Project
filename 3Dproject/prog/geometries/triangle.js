/**
 * Specifies a Triangle. A subclass of Geometry.
 *
 * @author Edward Lee
 * @this {Triangle}
 */
class Triangle extends Geometry {
  /**
   * Constructor for Triangle.
   *
   * @constructor
   * @param {Number} size The size of the triangle drawn
   * @param {Number} centerX The center x-position of the triangle
   * @param {Number} centerY The center y-position of the triangle
   */
  constructor(size, centerX, centerY, colors) {
	super();
	this.vertices = this.generateTriangleVertices(size, centerX, centerY, colors);
  }

  /**
   * Generates the vertices of the Triangle.
   *
   * @private
   * @param {Number} size The size of the triangle drawn
   * @param {Number} centerX The center x-position of the triangle
   * @param {Number} centerY The center y-position of the triangle
   */
  generateTriangleVertices(size, centerX, centerY, colors) {
	var k = 0;
    var height = size/2;
	var threevertexes = [];
	threevertexes[0] = new Vertex();
	threevertexes[1] = new Vertex();
	threevertexes[2] = new Vertex();
	threevertexes[0].points[0] = centerX-height;
	threevertexes[0].points[1] = centerY-(height/Math.sqrt(3));
	threevertexes[0].points[2] = 0.0;
	threevertexes[1].points[0] = centerX+height;
	threevertexes[1].points[1] = centerY-(height/Math.sqrt(3));
	threevertexes[1].points[2] = 0.0;
	threevertexes[2].points[0] = centerX;
	threevertexes[2].points[1] = centerY+(height*Math.sqrt(3))-(height/Math.sqrt(3));
	threevertexes[2].points[2] = 0.0;
	for(var i=0; i<3; i++){
	  for(var j=0; j<4; j++) {
	    threevertexes[i].color[j] = colors[k];
		k++;
	  }
	}
	return threevertexes;
  }
}
