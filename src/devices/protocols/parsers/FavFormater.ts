import { utils } from "@ray-js/panel-sdk";
import { transform } from "./transform";

export default class SmearFormater {
  uuid: string;

  defaultValue: {
    favs: number[];
  };

  constructor(uuid = "favorite",) {
    this.uuid = uuid;
    this.defaultValue = {
      favs: [],
    };
  }

  parser(val = ''): {
    favs: number[];
  } {
    // console.log('SmearFormater-parse', val);
    if (!val || typeof val !== 'string') {
      console.warn("favorite", 'dp数据有问题，无法解析', val);
      return this.defaultValue;
    }

    const generator = transform(val);
    generator.next()
    const favs: number[] = []
    const size = val.length / 2
    for (let index = 0; index < size; index++) {
      const favId = parseInt(`${generator.next(2).value}`, 16);
      favs.push(favId)
    }

    return {
      favs
    }
  }

  formatter(data: {
    favs: number[];
  }): string {
    const favs = data.favs
    let newArr = [...new Set(favs)].filter(item => item >= 21 && item < 200);

    if (!newArr.length) {
      newArr = [0];
    }

    return newArr.map(item => item.toString(16).padStart(2, '0')).join('');
  }
}
// # sourceMappingURL=ColourFormater.js.map
