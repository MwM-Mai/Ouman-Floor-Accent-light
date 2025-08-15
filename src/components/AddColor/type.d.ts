export interface IProps {
  showPopup: boolean;
  closePopup: () => void;
  type: number; // 类型 1: 添加 2: 编辑 
  mode: string; // 模式 "colour" "white" "all"
  id?: number; // 编辑的id
  colours?: ColourCustom[]
  savaCallBack: (data: ISavceData) => void;
}

export interface ColourCustom {
  hue: number;
  saturation: number;
  value: number;
}

export interface ISavceData {
  hs: {
    h: number;
    s: number;
  };
  temp: number;
  pickerType?: "colour" | "white";
}