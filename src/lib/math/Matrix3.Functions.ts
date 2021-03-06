import { Matrix3 } from "./Matrix3";
import { Vector2 } from "./Vector2";

export function makeMatrix3Concatenation(a: Matrix3, b: Matrix3, result = new Matrix3()): Matrix3 {
  const ae = a.elements;
  const be = b.elements;
  const te = result.elements;

  const a11 = ae[0],
    a12 = ae[3],
    a13 = ae[6];
  const a21 = ae[1],
    a22 = ae[4],
    a23 = ae[7];
  const a31 = ae[2],
    a32 = ae[5],
    a33 = ae[8];

  const b11 = be[0],
    b12 = be[3],
    b13 = be[6];
  const b21 = be[1],
    b22 = be[4],
    b23 = be[7];
  const b31 = be[2],
    b32 = be[5],
    b33 = be[8];

  te[0] = a11 * b11 + a12 * b21 + a13 * b31;
  te[3] = a11 * b12 + a12 * b22 + a13 * b32;
  te[6] = a11 * b13 + a12 * b23 + a13 * b33;

  te[1] = a21 * b11 + a22 * b21 + a23 * b31;
  te[4] = a21 * b12 + a22 * b22 + a23 * b32;
  te[7] = a21 * b13 + a22 * b23 + a23 * b33;

  te[2] = a31 * b11 + a32 * b21 + a33 * b31;
  te[5] = a31 * b12 + a32 * b22 + a33 * b32;
  te[8] = a31 * b13 + a32 * b23 + a33 * b33;

  return result;
}

export function matrix3Determinant(m: Matrix3): number {
  const te = m.elements;

  const a = te[0],
    b = te[1],
    c = te[2],
    d = te[3],
    e = te[4],
    f = te[5],
    g = te[6],
    h = te[7],
    i = te[8];

  return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
}

export function makeMatrix3Transpose(m: Matrix3, result = new Matrix3()): Matrix3 {
  let tmp;
  const me = result.copy(m).elements;

  // TODO: replace this with just reading from me and setting re, no need for a temporary
  tmp = me[1];
  me[1] = me[3];
  me[3] = tmp;
  tmp = me[2];
  me[2] = me[6];
  me[6] = tmp;
  tmp = me[5];
  me[5] = me[7];
  me[7] = tmp;

  return result;
}

export function makeMatrix3Inverse(m: Matrix3, result = new Matrix3()): Matrix3 {
  const e = m.elements;

  const n11 = e[0],
    n21 = e[1],
    n31 = e[2],
    n12 = e[3],
    n22 = e[4],
    n32 = e[5],
    n13 = e[6],
    n23 = e[7],
    n33 = e[8],
    t11 = n33 * n22 - n32 * n23,
    t12 = n32 * n13 - n33 * n12,
    t13 = n23 * n12 - n22 * n13,
    det = n11 * t11 + n21 * t12 + n31 * t13;

  if (det === 0) {
    throw new Error("can not invert degenerate matrix");
  }

  const detInv = 1 / det;

  const re = result.elements;

  // TODO: replace with a set
  re[0] = t11 * detInv;
  re[1] = (n31 * n23 - n33 * n21) * detInv;
  re[2] = (n32 * n21 - n31 * n22) * detInv;

  re[3] = t12 * detInv;
  re[4] = (n33 * n11 - n31 * n13) * detInv;
  re[5] = (n31 * n12 - n32 * n11) * detInv;

  re[6] = t13 * detInv;
  re[7] = (n21 * n13 - n23 * n11) * detInv;
  re[8] = (n22 * n11 - n21 * n12) * detInv;

  return result;
}

export function makeMatrix3Translation(t: Vector2, result = new Matrix3()): Matrix3 {
  return result.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1);
}

export function makeMatrix3RotationFromAngle(angle: number, result = new Matrix3()): Matrix3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return result.set(c, -s, 0, s, c, 0, 0, 0, 1);
}

export function makeMatrix3Scale(s: Vector2, result = new Matrix3()): Matrix3 {
  return result.set(s.x, 0, 0, 0, s.y, 0, 0, 0, 1.0);
}
