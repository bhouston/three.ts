//
// basic shader
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../core/types";
import { RenderingContext } from "./RenderingContext";
import { ShaderType } from "./ShaderType";

export class Shader implements IDisposable {
  disposed = false;
  glShader: WebGLShader;

  constructor(public context: RenderingContext, public sourceCode: string, public shaderType: ShaderType) {
    const gl = this.context.gl;

    // Create the shader object
    {
      const glShader = gl.createShader(shaderType);
      if (glShader === null) {
        throw new Error("createShader failed");
      }

      this.glShader = glShader;
    }

    // Set the shader source code.
    gl.shaderSource(this.glShader, sourceCode);

    // Compile the shader
    gl.compileShader(this.glShader);

    // Check if it compiled
    const success = gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!success) {
      // Something went wrong during compilation; get the error
      const infoLog = gl.getShaderInfoLog(this.glShader);
      throw new Error(`could not compile shader: ${infoLog}`);
    }
  }

  dispose(): void {
    if (!this.disposed) {
      this.context.gl.deleteShader(this.glShader);
      this.disposed = true;
    }
  }
}
