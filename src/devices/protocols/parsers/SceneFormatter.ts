import _ from 'lodash';
import { transform, generateStep } from './transform'

export default class SmearFormater {
  uuid: string;

  defaultValue: any;

  constructor(uuid = "dreamlight_scene_mode", defaultValue = {}) {
    this.uuid = uuid;
    this.defaultValue = defaultValue;
  }

  parser(val = ''): SceneValueType {
    // console.log('SmearFormater-parse', val);
    if (!val || typeof val !== 'string' || val.length === 0) {
      console.warn("dreamlight_scene_mode", 'dp数据有问题，无法解析', val);
      return this.defaultValue;
    }

    const generator = transform(val);
    generator.next()
    const step = (n?: number) => {
      return generateStep(generator, n)()
    };

    const version = step(2);
    const id = step(2);
    const mode = step(2);
    const intervalTime = step(2);
    const changeTime = step(2);
    const speed = intervalTime;

    const result = {
      version,
      id,
      mode,
      speed,
    } as SceneValueType;

    if (mode === 20) {
      // 混合模式
      // FIXME: 用数组优化
      const optionA = step(2);
      const optionB = step(2);
      const optionC = step(2);
      result.mixedIds = [optionA, optionB, optionC];
    } else {
      // 非混合模式
      const optionA = step(2);

      const optionAStr = this.toFixed(optionA.toString(2), 8);
      result.segmented = parseInt(optionAStr.slice(0, 1), 2);
      result.loop = parseInt(optionAStr.slice(1, 2), 2);
      result.excessive = parseInt(optionAStr.slice(2, 3), 2);
      result.direction = parseInt(optionAStr.slice(3, 4), 2);
      result.expand = parseInt(optionAStr.slice(4, 6), 2);
      result.reserved1 = parseInt(optionAStr.slice(6, 7), 2);
      result.reserved2 = parseInt(optionAStr.slice(7, 8), 2);

      const optionB = step(2);
      const optionC = step(2);
    }

    result.brightness = step(2);
    result.colors = this.hsSplit(generator.next().value).map(v => ({
      hue: parseInt(v.slice(0, 4), 16),
      saturation: parseInt(v.slice(4), 16),
    }));
    console.log('SmearFormater-parse', result);
    return result;
  }

  formatter(data: SceneValueType): string {
    console.log('SceneFormater-format', data);
    const {
      version = 1,
      id,
      mode = 0,
      speed = 50,
      mixedIds = [],
      segmented = 0,
      loop = 0,
      excessive = 0,
      direction = 0,
      expand = 0,
      reserved1 = 0,
      reserved2 = 0,
      brightness = 0,
      colors = [{ hue: 0, saturation: 0 }],
    } = data;
    const intervalTime = speed,
      changeTime = speed;

    let result = `${this.toHex(version)}${this.toHex(id)}${this.toHex(mode)}${this.toHex(intervalTime)}${this.toHex(
      changeTime
    )}`;

    if (mode === 20) {
      // 混合模式
      result += mixedIds.map(v => `${this.toHex(v)}`).join('');
    } else {
      // 非混合模式
      const optionA = this.toHex(
        parseInt(
          `${segmented}${loop}${excessive}${direction}${this.toFixed(
            expand,
            2
          )}${reserved1}${reserved2}`,
          2
        )
      );
      const optionB = this.toHex(0);
      const optionC = this.toHex(0);
      result += `${optionA}${optionB}${optionC}`;
    }

    const colorsString = colors
      .map(d => `${this.toHex(d.hue, 4)}${this.toHex(Math.round(d.saturation))}`)
      .join('');
    result += `${this.toHex(Math.round(brightness))}${colorsString}`;

    return result;
  }

  /**
   * 将十进制转成二进制字符串
   */
  toFixed(num: number, length = 8): string {
    return num.toString(2).padStart(length, '0');
  }

  /**
   * 将hs的colors切割成数组
   */
  hsSplit(colors: string, length = 6): string[] {
    const result = [];
    if (!colors) {
      return [];
    }
    for (let i = 0; i < colors.length; i += length) {
      result.push(colors.slice(i, i + length));
    }
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