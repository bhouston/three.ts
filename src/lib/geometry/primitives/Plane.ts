//
// based on PlaneGeometry from Three.js
//
// Authors:
// * @bhouston
//

import { Float32Attribute, Int32Attribute } from "../Attribute";
import { Geometry } from "../Geometry";

export function plane(width = 1, height = 1, widthSegments = 1, heightSegments = 1): Geometry {
  const widthHalf = width / 2;
  const heightHalf = height / 2;

  const gridX = Math.floor(widthSegments);
  const gridY = Math.floor(heightSegments);

  const gridX1 = gridX + 1;
  const gridY1 = gridY + 1;

  const segmentWidth = width / gridX;
  const segmentHeight = height / gridY;

  // buffers

  const indices: number[] = [];
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  // generate vertices, normals and uvs

  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight - heightHalf;

    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth - widthHalf;

      vertices.push(x, -y, 0);

      normals.push(0, 0, 1);

      uvs.push(ix / gridX);
      uvs.push(1 - iy / gridY);
    }
  }

  // indices

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * (iy + 1);
      const c = ix + 1 + gridX1 * (iy + 1);
      const d = ix + 1 + gridX1 * iy;

      // faces

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // build geometry

  const geometry = new Geometry();
  geometry.setIndices(new Int32Attribute(new Int32Array(indices), 1));
  geometry.attributes.set("position", new Float32Attribute(new Float32Array(vertices), 3));
  geometry.attributes.set("normal", new Float32Attribute(new Float32Array(normals), 3));
  geometry.attributes.set("uv", new Float32Attribute(new Float32Array(uvs), 2));

  return geometry;
}