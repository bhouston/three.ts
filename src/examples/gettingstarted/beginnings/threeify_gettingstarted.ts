import { box } from "@threeify/geometry/primitives/Box";
import { MaterialOutputs } from "@threeify/materials/MaterialOutputs";
import { PhysicalMaterial } from "@threeify/materials/PhysicalMaterial";
import { PerspectiveCamera } from "@threeify/nodes/cameras/PerspectiveCamera";
import { Mesh } from "@threeify/nodes/Mesh";
import { Node } from "@threeify/nodes/Node";
import { RenderingContext } from "@threeify/renderers/webgl2";

const camera = new PerspectiveCamera(70, 0.01, 10);
camera.position.x = 1;

const geometry = box(0.2, 0.2, 0.2);
const material = new PhysicalMaterial();
material.outputs = MaterialOutputs.Normal;

const mesh = new Mesh(geometry, material);

const scene = new Node();
scene.children.add(mesh);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

function animate(): void {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  mesh.dirty();

  canvasFramebuffer.render(scene, camera, true);
}

animate();
