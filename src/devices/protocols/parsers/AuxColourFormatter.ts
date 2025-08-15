/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { transform } from './transform';

export default class AuxColourFormatter {
  uuid: string;
  defaultValue: {
    hue: number;
    saturation: number;
    value: number;
  };

  constructor(uuid = 'aux_colour', defaultValue = null) {
    this.defaultValue = {
      hue: 360,
      saturation: 1000,
      value: 1000
    };
    this.uuid = uuid;
    if (defaultValue) {
      this.defaultValue = defaultValue;
    }
  }

  equal(source, target) {
    return source === target;
  }

  parser(val = '') {
    // 自定义解析
    const { length } = val;
    if (!length) {
      console.log('数据有问题，无法解析');
      return this.defaultValue;
    }
    const generator = transform(val);
    generator.next();
    const hue = parseInt(`${generator.next(4).value}`, 16);
    const saturation = parseInt(`${generator.next(4).value}`, 16);
    const value = parseInt(`${generator.next(4).value}`, 16);
    return {
      /**
       * 色度: 0-360
       */
      hue,
      /**
       * 饱和: 0-1000
       */
      saturation,
      /**
       * 明度: 0-1000
       */
      value
    };
  }

  to16(value, length) {
    let result = Number(value).toString(16);
    if (result.length < length) {
      result = result.padStart(length, '0');
    }
    return result;
  }

  formatter(data) {
    // 自定义格式转为16进制
    const { hue = 360, saturation = 1000, value = 1000 } = data;
    const hStr = this.to16(hue, 4);
    const sStr = this.to16(saturation, 4);
    const vStr = this.to16(value, 4);
    return `${hStr}${sStr}${vStr}`;
  }
}
