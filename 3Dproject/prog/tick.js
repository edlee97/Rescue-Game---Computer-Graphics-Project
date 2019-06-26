/**
 * Responsible for animating the Scene.
 */
function tick() {
  var t0 = performance.now();
  driverScene.updateAnimation();
  driverScene.render(false);
  var t1 = performance.now();
  updateFPS(t1, t0);
  drawHUD(ctx);
  requestAnimationFrame(tick);
}
