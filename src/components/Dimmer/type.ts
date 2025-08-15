export interface IColorData {
  hue: number;
  saturation: number;
  value: number;
}

export interface IHS {
  h: number;
  s: number;
}

export interface IAddColor {
  type: number; // 类型 1: 添加 2: 编辑 
  mode: string; // 模式 "colour" "white"
  id?: number; // 编辑的id
}

// all：全部涂抹，single：单个涂抹，clear：清除
export enum SmearMode {
  all = 0,
  single = 1,
  clear = 2
}