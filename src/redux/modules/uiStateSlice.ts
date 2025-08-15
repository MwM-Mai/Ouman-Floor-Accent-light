/* eslint-disable no-param-reassign */
import { ColourData, DimmerMode } from '@/devices/protocols/parsers/PaintColourDataFormatter';
import { SmearMode } from '@/components/Dimmer/type';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxState } from '..';

type UiState = {
  /**
   * 收藏颜色中彩光当前选中的索引
   */
  colorIndex: number;
  /**
   * 收藏颜色中白光当前选中的索引
   */
  whiteIndex: number;
  /**
   * 模式切换的索引
   */
  modeIndex: number;
  /**
   * 颜色模式
   */
  colorMode: "colour" | "white";
  smearData: SmearDataType;
  pagescrollY: boolean;
};

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
  indexs?: number[];
}

/**
 * Slice
 */
const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    colorIndex: -1,
    whiteIndex: -1,
    modeIndex: 3,
    colorMode: "colour", // colour or white
    smearData: {
      version: 1, // 版本号通常从 1 开始
      dimmerMode: DimmerMode.colour, // 默认为彩光模式
      effect: 0, // 默认无渐变效果
      ledNumber: 1, // 灯带段数默认为 20 段
      smearMode: SmearMode.all, // 默认涂抹模式为“油漆桶”
      hue: 0, // 彩光色相默认为 0（红色）
      saturation: 1000, // 饱和度最大值
      value: 1000, // 亮度最大值
      brightness: 1000, // 白光亮度默认中等
      temperature: 1000, // 色温默认中间值
      isColour: true, // 默认是彩光
      singleType: 0, // 默认为连续操作
      quantity: 0, // 初始没有灯带被选中
      combineType: 0, // 组合类型默认为 0
      combination: [], // 初始为空数组
      indexs: [], // 初始为空集合
    },
    pagescrollY: true
  } as UiState,
  reducers: {
    updateColorIndex(state, action: PayloadAction<UiState['colorIndex']>) {
      state.colorIndex = action.payload;
    },
    updateWhiteIndex(state, action: PayloadAction<UiState['whiteIndex']>) {
      state.whiteIndex = action.payload;
    },
    updateModeIndex(state, action: PayloadAction<UiState['modeIndex']>) {
      state.modeIndex = action.payload;
    },
    updateColorMode(state, action: PayloadAction<UiState['colorMode']>) {
      state.colorMode = action.payload;
    },
    updateSmearData(state, action: PayloadAction<UiState['smearData']>) {
      state.smearData = action.payload;
    },
    updatePagesCrollY(state, action: PayloadAction<UiState['pagescrollY']>) {
      state.pagescrollY = action.payload;
    }
  },
});

/**
 * Actions
 */
export const { updateColorIndex, updateWhiteIndex, updateModeIndex, updateColorMode, updateSmearData, updatePagesCrollY } = uiStateSlice.actions;

/**
 * Selectors
 */
export const selectColorIndex = (state: ReduxState) => state.uiState.colorIndex;
export const selectWhiteIndex = (state: ReduxState) => state.uiState.whiteIndex;
export const selectActiveIndex = createSelector(
  [
    (state: ReduxState) => state.uiState.whiteIndex,
    (state: ReduxState) => state.uiState.colorIndex,
    (_, isColor: boolean) => isColor,
  ],
  (whiteIndex, colorIndex, isColor) => {
    return isColor ? colorIndex : whiteIndex;
  }
);
export const selectModeIndex = (state: ReduxState) => state.uiState.modeIndex;
export const selectColorMode = (state: ReduxState) => state.uiState.colorMode;
export const selectSmearData = (state: ReduxState) => state.uiState.smearData;
export const selectPagesCrollY = (state: ReduxState) => state.uiState.pagescrollY;

export default uiStateSlice.reducer;
