import { utils } from "@ray-js/panel-sdk";
import { transform } from "./transform";

const { generateDpStrStep } = utils;

type TMusic = {
  mode: number,
  hue: number,
  saturation: number,
  value: number,
  brightness: number,
  temperature: number,
};

export const DefaultLocalMusicData: TMusic = {
  mode: 0,
  hue: 360,
  saturation: 1000,
  value: 1000,
  brightness: 1000,
  temperature: 1000
};

export default class MicMusicFormatter {
  uuid: string;

  defaultValue: TMusic = DefaultLocalMusicData;

  constructor(
    uuid = "music_data",
    defaultValue = {} as TMusic
  ) {
    this.uuid = uuid;
    this.defaultValue = this.defaultValue || defaultValue;
  }

  /**
   * 解析场景各个单元
   * @param generator generator 函数
   */
  parseUnits(step) {
    const result = [];
    // eslint-disable-next-line prefer-const
    for (; true;) {
      const hue = step(4).value;
      // eslint-disable-next-line prefer-const
      let { value: saturation, done } = step(2);
      result.push({
        hue,
        saturation,
      });
      if (done) {
        break;
      }
    }
    return result;
  }

  parser(value: string) {
    const generator = transform(value);
    generator.next();
    const mode = parseInt(`${generator.next(2).value}`, 16);
    const hue = parseInt(`${generator.next(4).value}`, 16);
    const saturation = parseInt(`${generator.next(4).value}`, 16);
    const val = parseInt(`${generator.next(4).value}`, 16);
    const bright = parseInt(`${generator.next(4).value}`, 16);
    const temp = parseInt(`${generator.next(4).value}`, 16);
  }

  to16(value: number, length: number): string {
    let result = Number(value).toString(16);
    result = result.padStart(length, "0");
    return result;
  }

  formatter(data: TMusic): string {
    const { mode = 1, hue = 360, saturation = 1000, value = 1000, brightness = 1000, temperature = 1000 } = data;
    return `${this.to16(mode, 2)}${this.to16(hue, 4)}${this.to16(saturation, 4)}${this.to16(value, 4)}${this.to16(brightness, 4)}${this.to16(temperature, 4)}`;
  }
}
