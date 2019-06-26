/**
 * Specifies a triangle which fluctuates in size (grows and shrinks).
 *
 * @author: Edward Lee
 * @this {FluctuatingTriangle}
 */
class FluctuatingTriangle extends Triangle {
  constructor(size, centerX, centerY, colors) {
    super(size, centerX, centerY, colors);
	this.modelMatrix = new Matrix4();
	this.Xvalue = centerX;
	this.Yvalue = centerY;
	this.wane = 0;
	this.baseScale = 1;
	this.translateScale = 1;
	this.scalingSpeed = 0.01;
	this.maxSize = 1.5;
	this.minSize = 0.5;
  }
  updateAnimation() {
	if(!this.wane){
	  this.baseScale = this.baseScale + this.scalingSpeed;
	  this.modelMatrix.setScale(this.baseScale, this.baseScale, 0);
	  this.translateScale = (1-this.baseScale)/(this.baseScale);
	  this.modelMatrix.translate(this.Xvalue*this.translateScale, this.Yvalue*this.translateScale, 0);
	  if(this.baseScale > this.maxSize) {
		this.wane = 1;
      }
	} else {
	  this.baseScale = this.baseScale - this.scalingSpeed;
	  this.modelMatrix.setScale(this.baseScale, this.baseScale, 0);
	  this.translateScale = (1-this.baseScale)/(this.baseScale);
	  this.modelMatrix.translate(this.Xvalue*this.translateScale, this.Yvalue*this.translateScale, 0);
	  if(this.baseScale < this.minSize) {
		this.wane = 0;
      }
	}
  }
}
