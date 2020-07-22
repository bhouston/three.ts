import { transformGeometry } from "../../../lib/geometry/Geometry.Functions";
import { fetchOBJ } from "../../../lib/geometry/loaders/OBJ";
import { FragmentOutput } from "../../../lib/materials/MaterialOutputs";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler, EulerOrder } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4Concatenation,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Scale,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { CullingState } from "../../../lib/renderers/webgl/CullingState";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { BufferBit } from "../../../lib/renderers/webgl/framebuffers/BufferBit";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = (await fetchOBJ("/assets/models/ninjaHead/ninjaHead.obj"))[0];
  transformGeometry(
    geometry,
    makeMatrix4Concatenation(
      makeMatrix4Scale(new Vector3(0.06, 0.06, 0.06)),
      makeMatrix4Translation(new Vector3(0, -172, -4)),
    ),
  );
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const displacementTexture = new Texture(await fetchImage("/assets/models/ninjaHead/displacement.jpg"));
  const normalTexture = new Texture(await fetchImage("/assets/models/ninjaHead/normal.png"));

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const displacementMap = makeTexImage2DFromTexture(context, displacementTexture);
  const normalMap = makeTexImage2DFromTexture(context, normalTexture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightColor: new Vector3(1, 1, 1).multiplyByScalar(40.0),
    pointLightRange: 12.0,

    // materials
    normalMap: normalMap,
    normalScale: new Vector2(1, 1),
    displacementMap: displacementMap,
    displacementScale: 1.0,

    // shader output
    fragmentOutputs: FragmentOutput.Normal,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 1.0);
  canvasFramebuffer.cullingState = new CullingState(true);

  const fragmentOutputs = [
    FragmentOutput.Depth,
    FragmentOutput.DepthPacked,
    FragmentOutput.Beauty,
    FragmentOutput.Normal,
    FragmentOutput.Albedo,
    FragmentOutput.Diffuse,
    FragmentOutput.Specular,
  ];

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(0.15 * Math.PI, now * 0.0002, 0, EulerOrder.XZY),
      uniforms.localToWorld,
    );
    uniforms.fragmentOutputs = fragmentOutputs[Math.floor(now / 5000) % fragmentOutputs.length];

    const effectScale = Math.cos(now * 0.0008) * 0.5 + 0.5;
    uniforms.normalScale = new Vector2(-1.0, 1.0).multiplyByScalar(effectScale);
    uniforms.displacementScale = effectScale * 0.1;
    uniforms.pointLightViewPosition = new Vector3(Math.cos(now * 0.001) * 3.0, 2.0, 0.5);

    canvasFramebuffer.clear(BufferBit.All);
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
