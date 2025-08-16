import Strings from '@/i18n';

const defaultColors = [
  { hue: 0, saturation: 1000, value: 1000 },
  { hue: 120, saturation: 1000, value: 1000 },
  { hue: 240, saturation: 1000, value: 1000 },
];
const defaultWhite = [
  { temperature: 0, brightness: 1000 },
  { temperature: 500, brightness: 1000 },
  { temperature: 1000, brightness: 1000 },
];
const defaultWhiteC = [{ brightness: 10 }, { brightness: 500 }, { brightness: 1000 }];


const defaultAppMusicList: MusicConfig[] = [
  {
    mode: 1,
    hue: 0,
    saturation: 1000,
    value: 1000,
    brightness: 1000,
    temperature: 1000,
  },
  {
    mode: 0,
    hue: 0,
    saturation: 1000,
    value: 1000,
    brightness: 1000,
    temperature: 1000,
  },
  {
    mode: 1,
    hue: 0,
    saturation: 1000,
    value: 1000,
    brightness: 1000,
    temperature: 1000,
  },
];

const defaultLocalMusicList: MicMusicData[] = [
  // 摇滚
  {
    v: 1, // 版本
    power: true,
    id: 0,
    isLight: 0,
    mode: 3,
    speed: 100,
    sensitivity: 50, // 灵敏度
    a: 0,
    b: 0,
    c: 0,
    brightness: 100,
    colors: [
      { hue: 0, saturation: 100 },
      { hue: 120, saturation: 100 },
      { hue: 240, saturation: 100 },
      { hue: 60, saturation: 100 },
      { hue: 180, saturation: 100 },
      { hue: 300, saturation: 100 },
      { hue: 0, saturation: 0 },
    ],
  },
  // 爵士
  {
    v: 1, // 版本
    power: true,
    id: 1,
    isLight: 0,
    mode: 2,
    speed: 100,
    sensitivity: 50, // 灵敏度
    a: 0,
    b: 0,
    c: 0,
    brightness: 100,
    colors: [
      { hue: 0, saturation: 80 },
      { hue: 120, saturation: 80 },
      { hue: 240, saturation: 80 },
      { hue: 60, saturation: 80 },
      { hue: 180, saturation: 80 },
      { hue: 300, saturation: 80 },
      { hue: 0, saturation: 0 },
    ],
  },
  // 经典
  {
    v: 1, // 版本
    power: true,
    id: 2,
    isLight: 1,
    mode: 2,
    speed: 100,
    sensitivity: 50, // 灵敏度
    a: 0,
    b: 0,
    c: 0,
    brightness: 100,
    colors: [
      { hue: 0, saturation: 100 },
      { hue: 120, saturation: 100 },
      { hue: 240, saturation: 100 },
      { hue: 60, saturation: 100 },
      { hue: 180, saturation: 100 },
      { hue: 300, saturation: 100 },
      { hue: 0, saturation: 0 },
    ],
  },
  // 滚动
  {
    v: 1,
    power: true,
    id: 3,
    isLight: 0,
    mode: 2,
    speed: 100,
    sensitivity: 50,
    a: 1,
    b: 0,
    c: 0,
    brightness: 100,
    colors: [
      { hue: 0, saturation: 100 },
      { hue: 120, saturation: 100 },
      { hue: 240, saturation: 100 },
      { hue: 60, saturation: 100 },
      { hue: 180, saturation: 100 },
      { hue: 300, saturation: 100 },
      { hue: 0, saturation: 0 },
    ],
  },
  // 能量
  {
    v: 1,
    power: true,
    id: 4,
    isLight: 0,
    mode: 0,
    speed: 100,
    sensitivity: 50,
    a: 1,
    b: 0,
    c: 0,
    brightness: 100,
    colors: [
      { hue: 0, saturation: 100 },
      { hue: 120, saturation: 100 },
      { hue: 240, saturation: 100 },
      { hue: 60, saturation: 100 },
      { hue: 180, saturation: 100 },
      { hue: 300, saturation: 100 },
    ],
  },
  // 频谱
  {
    v: 1,
    power: false,
    id: 5,
    isLight: 1,
    mode: 0,
    speed: 100,
    sensitivity: 50,
    a: 1,
    b: 0,
    c: 0,
    brightness: 100,
    colors: [
      { hue: 0, saturation: 100 },
      { hue: 120, saturation: 100 },
      { hue: 240, saturation: 100 },
      { hue: 60, saturation: 100 },
      { hue: 180, saturation: 100 },
      { hue: 300, saturation: 100 },
      { hue: 0, saturation: 0 },
    ],
  },
];

// 定义默认的 SceneValueType
const defaultSceneValue: SceneValueType = {
  version: 1,
  id: 200, // 自定义场景号从200开始
  mode: 0, // 变化方式
  speed: 50, // 单元变化速度
  segmented: 0, // 0-全段
  loop: 0, // 0-不循环
  excessive: 0, // 0-不过渡
  direction: 0, // 0-顺时针方向
  expand: 0, // 默认模式
  reserved1: 0,
  reserved2: 0,
  brightness: 100, // 亮度
  colors: [
    { hue: 0, saturation: 100 },
    { hue: 120, saturation: 100 }
  ], // 颜色单元数组
};

// 一期6个 0静态 1渐变 2跳变 3呼吸 4闪烁 10流水 11彩虹
// 二期10个 5流星 6堆积 7飘落 8追光 9飘动 12闪现 13反弹 14穿梭 15乱闪 16开合
const sceneModesKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const sceneModes: IDIYScene[] = sceneModesKeys.map(key => ({
  key: String(key),
  id: 1, // 场景ID
  // @ts-ignore
  name: Strings.getLang(`scene_mode_${key}`), // 模式名称
  title: "", // 自定义场景名称
  pic: "", // 场景图片路径
  value: {
    ...defaultSceneValue,
    mode: key,
  },
}));

// 组合色卡
export const groupColorsList = [
  [
    { hue: 339, saturation: 33, value: 96 },
    { hue: 338, saturation: 65, value: 100 },
    { hue: 339, saturation: 98, value: 98 },
    { hue: 338, saturation: 87, value: 100 }
  ],
  [
    { hue: 284, saturation: 43, value: 100 },
    { hue: 284, saturation: 43, value: 85 },
    { hue: 219, saturation: 42, value: 99 },
    { hue: 219, saturation: 35, value: 100 },
  ],
  [
    { hue: 217, saturation: 100, value: 99 },
    { hue: 258, saturation: 81, value: 70 },
    { hue: 59, saturation: 74, value: 100 },
    { hue: 339, saturation: 98, value: 98 },
  ],
  [
    { hue: 6, saturation: 69, value: 100 },
    { hue: 37, saturation: 75, value: 100 },
    { hue: 193, saturation: 100, value: 99 },
    { hue: 65, saturation: 58, value: 94 },
  ],
  [
    { hue: 197, saturation: 20, value: 100 },
    { hue: 194, saturation: 42, value: 99 },
    { hue: 193, saturation: 100, value: 99 },
    { hue: 193, saturation: 67, value: 99 },
  ],
  [
    { hue: 94, saturation: 66, value: 73 },
    { hue: 92, saturation: 55, value: 83 },
    { hue: 66, saturation: 26, value: 97 },
    { hue: 92, saturation: 37, value: 87 },
  ],
  [
    { hue: 94, saturation: 66, value: 73 },
    { hue: 66, saturation: 77, value: 93 },
    { hue: 25, saturation: 100, value: 100 },
    { hue: 40, saturation: 100, value: 100 },
  ],
  [
    { hue: 11, saturation: 92, value: 100 },
    { hue: 25, saturation: 100, value: 100 },
    { hue: 94, saturation: 66, value: 73 },
    { hue: 40, saturation: 100, value: 100 },
  ],
  [
    { hue: 258, saturation: 81, value: 70 },
    { hue: 217, saturation: 100, value: 99 },
    { hue: 57, saturation: 58, value: 100 },
    { hue: 283, saturation: 77, value: 95 },
  ],
  [
    { hue: 259, saturation: 45, value: 100 },
    { hue: 259, saturation: 69, value: 99 },
    { hue: 258, saturation: 81, value: 70 },
    { hue: 255, saturation: 62, value: 49 },
  ],
  [
    { hue: 40, saturation: 100, value: 100 },
    { hue: 37, saturation: 75, value: 100 },
    { hue: 34, saturation: 34, value: 100 },
    { hue: 36, saturation: 53, value: 100 },
  ],
  [
    { hue: 40, saturation: 100, value: 100 },
    { hue: 193, saturation: 100, value: 99 },
    { hue: 11, saturation: 92, value: 100 },
    { hue: 255, saturation: 80, value: 92 },
  ],
  [
    { hue: 92, saturation: 37, value: 87 },
    { hue: 193, saturation: 67, value: 99 },
    { hue: 11, saturation: 92, value: 100 },
    { hue: 259, saturation: 69, value: 99 },
  ],
  [
    { hue: 285, saturation: 78, value: 74 },
    { hue: 338, saturation: 65, value: 100 },
    { hue: 339, saturation: 98, value: 98 },
    { hue: 25, saturation: 100, value: 100 },
    { hue: 59, saturation: 74, value: 100 },
  ],
  [
    { hue: 285, saturation: 81, value: 70 },
    { hue: 255, saturation: 80, value: 92 },
    { hue: 259, saturation: 69, value: 99 },
    { hue: 259, saturation: 45, value: 100 },
    { hue: 257, saturation: 21, value: 100 },
  ],
  [
    { hue: 0, saturation: 56, value: 100 },
    { hue: 0, saturation: 69, value: 100 },
    { hue: 0, saturation: 77, value: 100 },
    { hue: 0, saturation: 84, value: 100 },
    { hue: 0, saturation: 100, value: 100 },
  ],
  [
    { hue: 217, saturation: 100, value: 99 },
    { hue: 218, saturation: 55, value: 100 },
    { hue: 36, saturation: 53, value: 100 },
    { hue: 40, saturation: 100, value: 50 },
    { hue: 25, saturation: 100, value: 100 },
  ],
  [
    { hue: 284, saturation: 43, value: 100 },
    { hue: 57, saturation: 58, value: 100 },
    { hue: 92, saturation: 55, value: 83 },
    { hue: 193, saturation: 67, value: 99 },
    { hue: 259, saturation: 45, value: 100 },
  ],
  [
    { hue: 216, saturation: 77, value: 99 },
    { hue: 255, saturation: 80, value: 92 },
    { hue: 354, saturation: 98, value: 98 },
    { hue: 25, saturation: 100, value: 100 },
    { hue: 40, saturation: 99, value: 56 },
  ],
  [
    { hue: 94, saturation: 66, value: 73 },
    { hue: 92, saturation: 55, value: 83 },
    { hue: 92, saturation: 37, value: 87 },
    { hue: 66, saturation: 77, value: 93 },
    { hue: 65, saturation: 31, value: 81 },
  ],
  [
    { hue: 193, saturation: 67, value: 99 },
    { hue: 37, saturation: 75, value: 100 },
    { hue: 25, saturation: 100, value: 100 },
    { hue: 285, saturation: 99, value: 67 },
    { hue: 285, saturation: 78, value: 81 },
  ],
  [
    { hue: 342, saturation: 30, value: 98 },
    { hue: 335, saturation: 45, value: 98 },
    { hue: 338, saturation: 67, value: 98 },
    { hue: 360, saturation: 71, value: 98 },
    { hue: 1, saturation: 100, value: 97 },
  ],
];

export default {
  defaultColors,
  defaultWhite,
  defaultWhiteC,
  defaultAppMusicList,
  defaultLocalMusicList,
  sceneModes,
  defaultSceneValue
};
