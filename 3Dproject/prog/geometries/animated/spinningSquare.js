/**
 * Specifies a square which spins realtive to its center.
 *
 * @author Edward Lee
 * @this {SpinningSquare}
 */
class SpinningSquare extends Square {

  constructor(size, centerX, centerY, colors) {
    super(size, centerX, centerY, colors);
	this.modelMatrix = new Matrix4();
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.color = colors;
	this.angleStep = 0.05;
	this.currentAngle = 0;
  }

  updateAnimation() {
	this.modelMatrix.setTranslate(this.Xvalue, this.Yvalue, 0);
    this.modelMatrix.rotate(this.currentAngle, 0, 0, 1);
	this.modelMatrix.translate(-this.Xvalue, -this.Yvalue, 0);
	this.currentAngle = this.currentAngle + this.angleStep;
  }
}
