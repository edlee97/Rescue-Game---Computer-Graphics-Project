/**
 * Specifies a Circle. A subclass of Geometry.
 *
 * @author "Your Name Here"
 * @this {Circle}
 */
class Circle extends Geometry {
  /**
   * Constructor for Circle.
   *
   * @constructor
   * @param {Number} radius The radius of the circle being constructed
   * @param {Integer} segments The number of segments composing the circle
   * @param {Number} centerX The central x-position of the circle
   * @param {Number} centerY The central y-position of the circle
   */
  constructor(radius, segments, centerX, centerY, colors) {
    super();
	this.vertices = this.generateCircleVertices(radius, segments, centerX, centerY, colors);
    // Recommendations: Remember that Circle is a subclass of Geometry.
    // "super" keyword can come in handy when minimizing code reuse.
  }

  /**
   * Generates the vertices of the Circle.
   *
   * @private
   * @param {Number} radius The radius of the circle being constructed
   * @param {Integer} segments The number of segments composing the circle
   * @param {Number} centerX The central x-position of the circle
   * @param {Number} centerY The central y-position of the circle
   */
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
    // Recommendations: Might want to call this within your Circle constructor.
    // Keeps your code clean :)
  }
}
