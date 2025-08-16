import _ from 'lodash';
import { transform, generateStep } from './transform'

export interface IAuxScene {
  sceneId: number,
  transitionInterval: number,
  duration: number,
  changeMode: number,
  H: number,
  S: number,
  V: number,
  B: number,
  T: number,
  icon?: string,
  name?: string
}

export default class AuxSceneFormatter {
  uuid: string;

  defaultValue: any;

  constructor(uuid = "aux_scene", defaultValue = {
    sceneId: 1,
    transitionInterval: 100,
    duration: 100,
    changeMode: 1,
    H: 1000,
    S: 1000,
    V: 1000,
    B: 1000,
    T: 1000
  }) {
    this.uuid = uuid;
    this.defaultValue = defaultValue;
  }

  parser(val = ''): IAuxScene {
    console.log('SmearFormater-parse', val);

    if (!val || typeof val !== 'string' || val.length === 0) {
      console.warn("aux_scene", 'dp数据有问题，无法解析', val);
      return this.defaultValue;
    }

    const generator = transform(val);
    generator.next()
    const step = (n?: number) => {
      return generateStep(generator, n)()
    };

    const sceneId = step(2);
    const transitionInterval = step(2);
    const duration = step(2);
    const changeMode = step(2);
    const H = step(4);
    const S = step(4);
    const V = step(4);
    const B = step(4);
    const T = step(4);

    const result = {
      sceneId,
      transitionInterval,
      duration,
      changeMode,
      H,
      S,
      V,
      B,
      T
    } as IAuxScene;

    console.log('auxScene parser', result);
    return result;
  }

  formatter(data: IAuxScene): string {
    console.log('auxScene-format', data);
    const {
      sceneId,
      transitionInterval = 0,
      duration = 50,
      changeMode = 1,
      H = 0,
      S = 0,
      V = 0,
      B = 0,
      T = 0
    } = data;

    let result = `${this.toHex(sceneId)}${this.toHex(transitionInterval)}${this.toHex(duration)}
                  ${this.toHex(changeMode)}${this.toHex(H, 4)}${this.toHex(S, 4)}${this.toHex(V, 4)}
                  ${this.toHex(B, 4)}${this.toHex(T, 4)}`;

    return result;
  }

  /**
   * 将十进制转成十六进制字符串
   */
  toHex(value: number, length = 2) {
    let result = Number(value).toString(16);
    if (result.length < length) {
      result = result.padStart(length, '0');
    }
    return result;
  }
}