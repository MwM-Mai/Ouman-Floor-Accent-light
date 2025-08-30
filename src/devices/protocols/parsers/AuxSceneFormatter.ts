import _ from 'lodash';
import { transform, generateStep } from './transform';

export interface IAuxScene {
  sceneId: number;
  value: Array<{
    transitionInterval: number;
    duration: number;
    changeMode: number;
    H: number;
    S: number;
    V: number;
    B: number;
    T: number;
  }>;
  icon?: string;
  name?: string;
}

export default class AuxSceneFormatter {
  uuid: string;

  defaultValue: any;

  constructor(
    uuid = 'aux_scene',
    defaultValue = {
      sceneId: 1,
      transitionInterval: 100,
      duration: 100,
      changeMode: 1,
      H: 1000,
      S: 1000,
      V: 1000,
      B: 1000,
      T: 1000,
    }
  ) {
    this.uuid = uuid;
    this.defaultValue = defaultValue;
  }

  parser(val = ''): IAuxScene {
    console.log('SmearFormater-parse', val);

    if (!val || typeof val !== 'string' || val.length === 0) {
      console.warn('aux_scene', 'dp数据有问题，无法解析', val);
      return this.defaultValue;
    }

    const generator = transform(val);
    generator.next();
    const step = (n?: number) => {
      return generateStep(generator, n)();
    };

    const sceneId = step(2);
    const value = this.hsSplit(generator.next().value).map(v => ({
      transitionInterval: parseInt(v.slice(0, 2), 16),
      duration: parseInt(v.slice(2, 4), 16),
      changeMode: parseInt(v.slice(4, 6), 16),
      H: parseInt(v.slice(6, 10), 16),
      S: parseInt(v.slice(10, 14), 16),
      V: parseInt(v.slice(14, 18), 16),
      B: parseInt(v.slice(18, 22), 16),
      T: parseInt(v.slice(22, 26), 16),
    }));

    const result = {
      sceneId,
      value,
    } as IAuxScene;

    console.log('auxScene parser', result);
    return result;
  }

  formatter(data: IAuxScene): string {
    console.log('auxScene-format', data);
    const { sceneId, value = [] } = data;

    let result = `${this.toHex(sceneId)}`;
    value.forEach(item => {
      result +=
        this.toHex(item.transitionInterval) +
        this.toHex(item.duration) +
        this.toHex(item.changeMode) +
        this.toHex(item.H, 4) +
        this.toHex(item.S, 4) +
        this.toHex(item.V, 4) +
        this.toHex(item.B, 4) +
        this.toHex(item.T, 4);
    });

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

  /**
   * colors切割成数组
   */
  hsSplit(colors: string, length = 26): string[] {
    const result = [];
    if (!colors) {
      return [];
    }
    for (let i = 0; i < colors.length; i += length) {
      result.push(colors.slice(i, i + length));
    }
    return result;
  }
}
