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

export default {
  defaultColors,
  defaultWhite,
  defaultWhiteC,
  defaultAppMusicList,
  defaultLocalMusicList,
  sceneModes,
  defaultSceneValue
};
