/**
 * Sends a WebGL 2D texture object (created by load2DTexture) and sends it to
 * the shaders.
 *
 * @param val The WebGL 2D texture object being passed
 * @param {Number} textureUnit The texture unit (0 - 7) where the texture will reside
 * @param {String} uniformName The name of the uniform variable where the texture's
 * textureUnit location (0 - 7) will reside
 */
function send2DTextureToGLSL(val, textureUnit, uniformName) {
  var textureBuffer = gl.createBuffer();
  var uniformVariable = gl.getUniformLocation(gl.program, uniformName);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, val);
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.uniform1i(uniformVariable, textureUnit);
  // Recomendations: Within this funciton, you should:
  //    1. Gather your uniform location
  //    2. Determine the exture unit you will be using (gl.TEXTURE"N")
  //    3. Activate your texture unit using gl.activeTexture
  //    4. Bind your texture using gl.bindTexture
  //    5. Send the texture unit (textureUnit not the one you found) to your
  //       uniform location.
}

/**
 * Creates a WebGl 2D texture object.
 *
 * @param imgPath A file path/data url containing the location of the texture image
 * @param magParam texParameteri for gl.TEXTURE_MAG_FILTER. Can be gl.NEAREST,
 * gl.LINEAR, etc.
 * @param minParam texParameteri for gl.TEXTURE_MIN_FILTER. Can be gl.NEAREST,
 * gl.LINEAR, etc.
 * @param wrapSParam texParameteri for gl.TEXTURE_WRAP_S. Can be gl.REPEAT,
 * gl. MIRRORED_REPEAT, or gl.CLAMP_TO_EDGE.
 * @param wrapTParam texParameteri for gl.TEXTURE_WRAP_S. Can be gl.REPEAT,
 * gl. MIRRORED_REPEAT, or gl.CLAMP_TO_EDGE.
 * @param callback A callback function which executes with the completed texture
 * object passed as a parameter.
 */
function create2DTexture(imgPath, magParam, minParam, wrapSParam, wrapTParam, callback) {
  var texture = gl.createTexture();
  var image = new Image();
  image.onload = function() { 
    loadTexture(texture, magParam, minParam, wrapSParam, wrapTParam, image);
	callback(texture);
  };
  image.src = imgPath;
  // Recomendations: This function should see you creating an Image object,
  // setting that image object's ".onload" to an anonymous function containing
  // the rest of your code, and setting that image object's ".src" to imgPath.
  //
  // Within the anonymous function:
  //  1. create a texture object by saving the result of gl.createTexture()
  //  2. Flip your image's y-axis and bind your texture object to gl.TEXTURE_2D
  //  3. Using multiple calls to gl.texParameteri, pass magParam, minParam,
  //     wrapSParam, and wrapTParam.
  //  4. Set the texture's image to the loaded image using gl.texImage2D
  //  5. Pass your completed texture object to your callback function
  //
  // NOTE: This function should not return anything.
}

function loadTexture(texture, magParam, minParam, wrapSParam, wrapTParam, image) {
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magParam);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minParam);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapSParam);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapTParam);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, 0);
}

/**
 * Sends data to a uniform variable expecting a matrix value.
 *
 * @private
 * @param {Array} val Value being sent to uniform variable
 * @param {String} uniformName Name of the uniform variable recieving data
 */
function sendUniformMatToGLSL(val, uniformName) {
  var send_matrix = gl.getUniformLocation(gl.program, uniformName);
  gl.uniformMatrix4fv(send_matrix, false, val);
}

/**
 * Sends data to an attribute variable using a buffer.
 *
 * @private
 * @param {Float32Array} data Data being sent to attribute variable
 * @param {Number} dataCount The amount of data to pass per vertex
 * @param {String} attribName The name of the attribute variable
 */
function sendAttributeBufferToGLSL(data, dataCount, attribName) {
  var attributeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  var send_value = gl.getAttribLocation(gl.program, attribName);
  gl.vertexAttribPointer(send_value, dataCount, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(send_value);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

/**
 * Draws the current buffer loaded. Buffer was loaded by sendAttributeBufferToGLSL.
 *
 * @param {Integer} pointCount The amount of vertices being drawn from the buffer.
 */
function tellGLSLToDrawCurrentBuffer(pointCount) {
  gl.drawArrays(gl.TRIANGLES, 0, pointCount);
}

/**
 * Sends a float value to the specified uniform variable within GLSL shaders.
 * Prints an error message if unsuccessful.
 *
 * @param {float} val The float value being passed to uniform variable
 * @param {String} uniformName The name of the uniform variable
 */
function sendUniformFloatToGLSL(val, uniformName) {
  var send_value = gl.getUniformLocation(gl.program, uniformName);
  gl.uniform1f(send_value, val);
}

/**
 * Sends an JavaSript array (vector) to the specified uniform variable within
 * GLSL shaders. Array can be of length 2-4.
 *
 * @param {Array} val Array (vector) being passed to uniform variable
 * @param {String} uniformName The name of the uniform variable
 */
function sendUniformVec4ToGLSL(val, uniformName) {
  var send_value = gl.getUniformLocation(gl.program, uniformName);
  var len = val.length;
  switch (len) {
    case 2:
	  gl.uniform2f(send_value, val[0], val[1]);
	  break;
	case 3:
	  gl.uniform3f(send_value, val[0], val[1], val[2]);
	  break;
	case 4:
	  gl.uniform4f(send_value, val[0], val[1], val[2], val[3]);
	  break;
  }
}
