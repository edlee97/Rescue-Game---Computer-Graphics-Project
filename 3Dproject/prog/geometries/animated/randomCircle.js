/**
 * Specifies a circle which moves randomly.
 *
 * @author Edward Lee
 * @this {RandomCircle}
 */
class RandomCircle extends Circle {
  /**
   * Constructor for RandomCircle.
   *
   * @constructor
   * @param {Number} radius The radius of the random circle being constructed
   * @param {Integer} segements The number of segments composing the circle
   * @param {Number} centerX The x-position of the circle being constructed
   * @param {Number} centerY The y-position of the circle being constructed
   * @returns {RandomCircle} RandomCircle object created
   */
  constructor(radius, segments, centerX, centerY, colors) {
    super(radius, segments, centerX, centerY, colors);
	this.modelMatrix = new Matrix4();
	this.radius = radius/4;
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.currentX = centerX;
	this.currentY = centerY;
	this.Xdirection = (Math.random() * (0.01 - (-0.01))) + (-0.01);
	this.Ydirection = (Math.random() * (0.01 - (-0.01))) + (-0.01);
  }

  /**
   * Updates random circle's animation. Changes modelMatrix into a translation
   * matrix translating into a random direction.
   */
  updateAnimation() {
    this.modelMatrix.translate(this.Xdirection, this.Ydirection, 0);
	this.currentX = this.currentX + this.Xdirection;
	this.currentY = this.currentY + this.Ydirection;
	if(Math.random() < 0.005){
	  this.Xdirection = (Math.random() * (0.01 - (-0.01))) + (-0.01);
	  this.Ydirection = (Math.random() * (0.01 - (-0.01))) + (-0.01);
	}
    if((this.currentX + this.radius) > 1) {
      this.Xdirection = (Math.random()*(-0.01));
	}
	if((this.currentX - this.radius) < -1) {
      this.Xdirection = (Math.random()*(0.01));
	}
	if((this.currentY - this.radius) < -1) {
      this.Ydirection = (Math.random()*(0.01));
	}
	if((this.currentY + this.radius) > 1) {
      this.Ydirection = (Math.random()*(-0.01));
	}
  }

}
