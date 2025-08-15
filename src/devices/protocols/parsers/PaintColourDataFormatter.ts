/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmearMode } from '@/components/Dimmer/type';
import { transform } from './transform';
import { utils } from '@ray-js/panel-sdk';

/** 涂抹dp数据 */
export interface SmearDataType {
  /** 版本号 */
  version: number;
  /** 模式 (0: 白光, 1: 彩光, 2: 色卡, 3: 组合) */
  dimmerMode: DimmerMode;
  /** 涂抹效果 (0: 无, 1: 渐变) */
  effect?: number;
  /** 灯带UI段数 */
  ledNumber?: number;
  /** 涂抹动作 (0: 油漆桶, 1: 涂抹, 2: 橡皮擦, 3: 记忆) */
  smearMode?: SmearMode;
  /** 彩光色相 */
  hue?: number;
  /** 彩光饱和度 */
  saturation?: number;
  /** 彩光亮度 */
  value?: number;
  /** 白光亮度 */
  brightness?: number;
  /** 白光色温 */
  temperature?: number;
  /** 当前涂抹色是否是彩光 */
  isColour?: boolean;
  /** 点选类型(0: 连续，1: 单点) */
  singleType?: number;
  /** 当次操作的灯带数 */
  quantity?: number;
  /** 组合类型 */
  combineType?: number;
  /** 颜色组合 */
  combination?: ColourData[];
  /** 编号 */
  indexs?: Set<number>;
}

export interface ColourData {
  hue: number;
  saturation: number;
  value: number;
}


/** 调光器模式 */
export enum DimmerMode {
  white = 0,
  colour = 1,
  colourCard = 2,
  combination = 3,
}

const {
  toFixed
} = utils;

export default class SmearDataFormatter {
  uuid: string;
  defaultValue: SmearDataType;

  constructor(uuid = 'control_data', defaultValue = null) {
    this.uuid = uuid;
    this.defaultValue = defaultValue ?? {
      version: 0,
      dimmerMode: DimmerMode.colour,
      effect: 0,
      smearMode: SmearMode.all,
      hue: 0,
      saturation: 1000,
      value: 1000,
    };
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
    // 版本
    const version = parseInt(`${generator.next(2).value}`, 16);
    const dimmerMode = parseInt(`${generator.next(2).value}`, 16);
    const effect = parseInt(`${generator.next(2).value}`, 16);
    const ledNumber = parseInt(`${generator.next(2).value}`, 16);
    const smearMode = parseInt(`${generator.next(2).value}`, 16);
    const result: SmearDataType = {
      version,
      dimmerMode,
      effect,
      ledNumber,
      smearMode
    };

    if (dimmerMode == DimmerMode.white) {
      result.brightness = parseInt(`${generator.next(4).value}`, 16);
      result.temperature = parseInt(`${generator.next(4).value}`, 16);
      result.isColour = false;
    } else if (dimmerMode == DimmerMode.colour) {
      result.hue = parseInt(`${generator.next(4).value}`, 16);
      result.saturation = parseInt(`${generator.next(4).value}`, 16);
      result.value = parseInt(`${generator.next(4).value}`, 16);
      result.isColour = true;
      const singleDataStr = parseInt(`${generator.next(2).value}`, 16).toString(2).padStart(8, '0');
      const singleType = parseInt(`${singleDataStr.slice(0, 1)}`, 2);
      result.singleType = singleType; // 是否连续
      result.quantity = parseInt(`${singleDataStr.slice(1, 8)}`, 2);
      if (singleType === 1) {
        const indexs = new Set();
        for (let i = 0; i < result.quantity; i++) {
          const index = parseInt(`${generator.next(2).value}`, 16);
          indexs.add(index);
        }
      }
    }
    console.log("解析完成", result);


    return result;
  }

  to16(value, length = 2) {
    let result = Number(value).toString(16);
    if (result.length < length) {
      result = result.padStart(length, '0');
    }
    return result;
  }

  formatter(data: SmearDataType) {
    const {
      version = 0,
      dimmerMode = DimmerMode.colour,
      effect = 0,
      ledNumber = 20,
      smearMode = SmearMode.all,
      hue = 0,
      saturation = 0,
      value = 0,
      brightness = 0,
      temperature = 0,
      combineType = 0,
      combination = [],
    } = data;

    console.log(data, 'formatdata=>>>>>>');
    // 白光不支持渐变
    let result = `${this.to16(version)}${this.to16(dimmerMode)}${this.to16(effect)}${this.to16(ledNumber)}`;

    if (dimmerMode === DimmerMode.white) {
      // 白光
      result += `${this.to16(smearMode)}${this.to16(brightness, 4)}${this.to16(temperature, 4)}`;
      if ([SmearMode.single, SmearMode.clear].includes(smearMode)) {
        const { singleType = 1, indexs = new Set(), quantity = indexs.size } = data;
        const singleDataStr = `${this.to16(
          parseInt(`${singleType}${toFixed(quantity.toString(2), 7)}`, 2)
        )}`;
        const indexsStr = `${[...indexs].reduce((acc, cur) => acc + this.to16(cur + 1), '')}`;
        result += `${singleDataStr}${indexsStr}`;
      }
    } else if ([DimmerMode.colour, DimmerMode.colourCard].includes(dimmerMode)) {
      // 彩光/色卡
      result += `${this.to16(smearMode)}${this.to16(hue, 4)}${this.to16(saturation, 4)}${this.to16(value, 4)}`;
      if ([SmearMode.single, SmearMode.clear].includes(smearMode)) {
        const { singleType = 1, indexs = new Set(), quantity = indexs.size } = data;
        const singleDataStr = `${this.to16(
          parseInt(`${singleType}${toFixed(quantity.toString(2), 7)}`, 2)
        )}`;
        const indexsStr = `${[...indexs].reduce((acc, cur) => acc + this.to16(cur + 1), '')}`;
        console.log("indexsStr", indexsStr);

        result += `${singleDataStr}${indexsStr}`;
      }
    } else if (dimmerMode === DimmerMode.combination) {
      // 组合
      const colors = combination.map(
        item => `${this.to16(item.hue, 4)}${this.to16(item.saturation, 4)}${this.to16(item.value, 4)}`
      );
      result += `${this.to16(combineType)}${colors.join('')}`;
    }

    return result;
  }
}
