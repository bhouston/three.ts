//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { generateUUID } from "../core/generateUuid";
import { IDisposable, IIdentifiable, IVersionable } from "../core/types";
import { Vector2 } from "../math/Vector2";
import { IPoolUser } from "../renderers/Pool";
import { DataType } from "../renderers/webgl2/textures/DataType";
import { PixelFormat } from "../renderers/webgl2/textures/PixelFormat";
import { TextureFilter } from "../renderers/webgl2/textures/TextureFilter";
import { TextureWrap } from "../renderers/webgl2/textures/TextureWrap";

export class ArrayBufferImage {
  constructor(public data: ArrayBuffer, public width: number, public height: number) {}
}

export class Texture implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
  disposed = false;
  uuid: string = generateUUID();
  version = 0;
  name = "";
  size: Vector2 = new Vector2();

  constructor(
    public image: ArrayBufferImage | HTMLImageElement,
    public wrapS: TextureWrap = TextureWrap.ClampToEdge,
    public wrapT: TextureWrap = TextureWrap.ClampToEdge,
    public magFilter: TextureFilter = TextureFilter.Linear,
    public minFilter: TextureFilter = TextureFilter.Linear,
    public pixelFormat: PixelFormat = PixelFormat.RGBA,
    public dataType: DataType = DataType.UnsignedByte,
    public generateMipmaps = true,
    public anisotropyLevels = 1,
  ) {
    this.size = new Vector2(image.width, image.height);
  }

  copy(source: Texture): void {
    this.name = source.name;
    this.image = source.image;
    this.wrapS = source.wrapS;
    this.wrapT = source.wrapT;
    this.magFilter = source.magFilter;
    this.minFilter = source.minFilter;
    this.pixelFormat = source.pixelFormat;
    this.dataType = source.dataType;
    this.anisotropyLevels = source.anisotropyLevels;
  }

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.dirty();
    }
  }
}
