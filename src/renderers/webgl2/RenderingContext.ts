//
// basic context
//
// Authors:
// * @bhouston
//

import { Box2 } from '../../math/Box2.js';
import { BlendState } from './BlendState.js';
import { BufferPool } from './Buffer.js';
import { ClearState } from './ClearState.js';
import { DepthTestState } from './DepthTestState.js';
import { Framebuffer } from './Framebuffer.js';
import { MaskState } from './MaskState.js';
import { Program, ProgramPool } from './Program.js';
import { TexImage2DPool } from './TexImage2D.js';

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

export class RenderingContext {
	canvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	TexImage2DPool: TexImage2DPool = new TexImage2DPool(this);
	programPool: ProgramPool = new ProgramPool(this);
	bufferPool: BufferPool = new BufferPool(this);

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		{
			let gl = canvas.getContext('webgl2');
			if (!gl) throw new Error('webgl2 not supported');

			this.gl = gl;
		}
	}

	private cachedActiveProgram: Program | null = null;
	set program(program: Program | null) {
		if (this.cachedActiveProgram !== program) {
			if (program) {
				this.gl.useProgram(program.glProgram);
			} else {
				this.gl.useProgram(null);
			}
			this.cachedActiveProgram = program;
		}
	}
	get program(): Program | null {
		return this.cachedActiveProgram;
	}

	private cachedFramebuffer: Framebuffer | null = null;
	set framebuffer(framebuffer: Framebuffer | null) {
		if (this.cachedFramebuffer !== framebuffer) {
			this.gl.bindFramebuffer(
				this.gl.FRAMEBUFFER,
				framebuffer ? framebuffer.glFramebuffer : null,
			);
			this.cachedFramebuffer = framebuffer;
		}
	}
	get framebuffer(): Framebuffer | null {
		return this.cachedFramebuffer;
	}

	//
	private _scissor: Box2 = new Box2();
	get scissor(): Box2 {
		return this._scissor.clone();
	}
	set scissor(s: Box2) {
		if (!this._scissor.equals(s)) {
			this.gl.scissor(s.x, s.y, s.width, s.height);
			this._scissor.copy(s);
		}
	}

	// specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
	private _viewport: Box2 = new Box2();
	get viewport(): Box2 {
		return this._viewport.clone();
	}
	set viewport(v: Box2) {
		if (!this._viewport.equals(v)) {
			this.gl.scissor(v.x, v.y, v.width, v.height);
			this._viewport.copy(v);
		}
	}

	private _blendState: BlendState = new BlendState();
	get blendState(): BlendState {
		return this._blendState.clone();
	}
	set blendState(bs: BlendState) {
		if (!this._blendState.equals(bs)) {
			if (bs.enabled) {
				this.gl.enable(GL.BLEND);
			} else {
				this.gl.disable(GL.BLEND);
			}
			this.gl.blendEquation(bs.equation);
			this.gl.blendFuncSeparate(
				bs.sourceRGBFactor,
				bs.destRGBFactor,
				bs.sourceAlphaFactor,
				bs.destAlphaFactor,
			);
			this._blendState.copy(bs);
		}
	}

	private _depthTestState: DepthTestState = new DepthTestState();
	get depthTestState(): DepthTestState {
		return this._depthTestState.clone();
	}
	set depthTestState(dts: DepthTestState) {
		if (!this._depthTestState.equals(dts)) {
			if (dts.enabled) {
				this.gl.enable(GL.DEPTH_TEST);
			} else {
				this.gl.disable(GL.DEPTH_TEST);
			}
			this.gl.depthFunc(dts.func);
			this._depthTestState.copy(dts);
		}
	}

	private _clearState: ClearState = new ClearState();
	get clearState(): ClearState {
		return this._clearState.clone();
	}
	set clearState(cs: ClearState) {
		if (!this._clearState.equals(cs)) {
			this.gl.clearColor(cs.color.r, cs.color.g, cs.color.b, cs.alpha);
			this.gl.clearDepth(cs.depth);
			this.gl.clearStencil(cs.stencil);
			this._clearState.copy(cs);
		}
	}

	private _maskState: MaskState = new MaskState();
	get maskState(): MaskState {
		return this._maskState.clone();
	}
	set maskState(ms: MaskState) {
		if (!this._maskState.equals(ms)) {
			this.gl.colorMask(ms.red, ms.green, ms.blue, ms.alpha);
			this.gl.depthMask(ms.depth);
			this.gl.stencilMask(ms.stencil);
			this._maskState.copy(ms);
		}
	}
}