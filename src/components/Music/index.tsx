import React, { memo, useState, useMemo, useEffect } from 'react'
import { View, Image, Text } from "@ray-js/ray"
import { useActions, useProps, useSupport, utils, useStructuredProps, useStructuredActions, kit } from '@ray-js/panel-sdk';
import clsx from 'clsx';
import TYSlider from '@ray-js/components-ty-slider';
import { Switch } from '@ray-js/smart-ui';
import _ from 'lodash';

import styles from "./index.module.less"
import { lampSchemaMap } from '@/devices/schema';
import config from '@/config/default';
import { defaultMusiColors } from '@/config/music'
import String from '@/i18n'

const { music_data, dreamlightmic_music_data } = lampSchemaMap;
const { defaultLocalMusicList, defaultAppMusicList } = config

const localMusicNames = [
  { name: String.getLang("local_music_0"), image: require("@/static/images/music/ic_rock.png") },
  { name: String.getLang("local_music_1"), image: require("@/static/images/music/ic_jazz.png") },
  { name: String.getLang("local_music_2"), image: require("@/static/images/music/ic_classics.png") },
  { name: String.getLang("local_music_3"), image: require("@/static/images/music/ic_roll.png") },
  { name: String.getLang("local_music_4"), image: require("@/static/images/music/ic_energy.png") },
  { name: String.getLang("local_music_5"), image: require("@/static/images/music/ic_step.png") }
];

const appMusicNames = [
  { name: String.getLang("app_music_0"), image: require("@/static/images/music/ic_bright.png") },
  { name: String.getLang("app_music_1"), image: require("@/static/images/music/ic_gentle.png") },
  { name: String.getLang("app_music_2"), image: require("@/static/images/music/ic_innervation.png") }
];

const { music2rgb } = kit;
const { onMusic2RgbChange, offMusic2RgbChange } = music2rgb;

const musicOption: {
  mode?: 0 | 1;
  colorList?: {
    hue: number;
    saturation: number;
    value: number;
  }[];
  dBRange?: [number, number];
  customProps?: Record<string, any>;
} = {
  mode: 1, // 0 跳变；1 渐变 默认1
  colorList: [
    { hue: 0, saturation: 1000, value: 1000 },
    { hue: 60, saturation: 1000, value: 1000 },
    { hue: 120, saturation: 1000, value: 1000 }
  ], // 可选入参， 随机在其中进行颜色选择 { hue: number; saturation: number; value: number }[]
  dBRange: [40, 80], // 可选入参， 分贝范围，会影响颜色亮度；版本 v1.13.2 开始支持
  customProps: {
    customKey: 'customValue',
  } // 可选入参，允许传入自定义参数，如：{ customKey: 'customValue' } 会在回调中返回；版本 v1.13.2 开始支持
};

const { hsv2rgb } = utils;

const Music = () => {
  const action = useActions();
  const structuredAction = useStructuredActions()
  const support = useSupport();
  const micMusicData = useStructuredProps(props => props.dreamlightmic_music_data);
  const musicData = useStructuredProps(props => props.music_data);

  const [tabList, setTabList] = useState([
    {
      name: String.getLang("local_music"),
      hide: !support.isSupportDp(dreamlightmic_music_data.code)
    },
    {
      name: String.getLang("app_music"),
      hide: !support.isSupportDp(music_data.code),
    }
  ])

  const [tabIndex, setTabIndex] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);
  const [isSwitch, setIsSwitch] = useState(true)
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    if (tabIndex === 0) {
      const id = micMusicData.id
      const index = defaultLocalMusicList.findIndex(item => item.id === id)
      setMusicIndex(index)
    }
  }, [micMusicData, tabIndex, musicData])

  useEffect(() => {
    return () => {
      console.log("Music Destroy");
      // offMusic2RgbChange();
    }
  }, [])
  /**
   * 切换tab
   * @param code tab类型
   */
  const handleChangeTab = (index: number) => {
    if (tabIndex === index) return;
    setTabIndex(index);
    if (index === 1) {
      // handleChooseAppMusic(0)
    }
  }

  /**
   * 处理点击本地音乐
   * @param index 音乐索引
   */1
  const handleChooseLocalMusic = (index: number) => {
    // if (index === musicIndex) return;
    setMusicIndex(index)
    const data = _.cloneDeep(defaultLocalMusicList[index])
    data.colors = isSwitch === false ? defaultMusiColors[colorIndex] : data.colors
    structuredAction.dreamlightmic_music_data.set(data)
  }

  /**
   * 处理选择颜色
   * @param index 颜色索引
   */
  const handleChooseColor = (index: number) => {
    setColorIndex(index)
    const data = _.cloneDeep(defaultLocalMusicList[musicIndex])
    data.colors = isSwitch === false ? defaultMusiColors[index] : data.colors
    structuredAction.dreamlightmic_music_data.set(data)
  }

  /**
   * 处理调整灵敏度
   */
  const handleChangeSensitivity = (value: number) => {
    structuredAction.dreamlightmic_music_data.set({ ...micMusicData, sensitivity: value })
  }

  /**
   * 将hsv转换成rgb字符串
   * @param hue 
   * @param saturation 
   * @param value 
   * @returns 
   */
  const hsvToRGB = (hue: number, saturation: number, value: number) => {
    const [r, g, b] = hsv2rgb(hue, saturation, value);

    return `rgb(${r},${g},${b})`;
  };

  /**
   * 处理点击app音乐
   */
  // const handleChooseAppMusic = async (index: number) => {
  //   try {
  //     console.log("点击了app音乐");
  //     // offMusic2RgbChange()
  //     setMusicIndex(index)
  //     const mode = defaultAppMusicList[index].mode;
  //     const colors = isSwitch === false ? defaultMusiColors[colorIndex].map(item => ({ ...item, value: 1000 })) : defaultMusiColors[Math.floor(Math.random() * 10)].map(item => ({ ...item, value: 1000 }))
  //     const option = { ...musicOption, mode, colorList: colors }
  //     onMusic2RgbChange((data) => {
  //       console.log("===== music_data", data);
  //       // @ts-ignore
  //       structuredAction.music_data.set({
  //         mode,
  //         hue: data.hue,
  //         saturation: data.saturation,
  //         value: data.value,
  //         brightness: data.bright,
  //         temperature: data.temperature,
  //       })
  //     }, option).catch(err => {
  //       // 注意：catch 使用方式从 panel-sdk v1.13.2 版本开始支持
  //       console.error("err", err);
  //     });
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  // const handleChooseAppColor = (index: number) => {
  //   setColorIndex(index)
  //   console.log("点击了app音乐");
  //   offMusic2RgbChange()
  //   const mode = defaultAppMusicList[musicIndex].mode;
  //   const colors = isSwitch === false ? defaultMusiColors[index].map(item => ({ ...item, value: 1000 })) : defaultMusiColors[Math.floor(Math.random() * 10)].map(item => ({ ...item, value: 1000 }))
  //   const option = { ...musicOption, mode, colorList: colors }
  //   onMusic2RgbChange((data) => {
  //     console.log("===== music_data", data);
  //     // @ts-ignore
  //     structuredAction.music_data.set({
  //       mode,
  //       hue: data.hue,
  //       saturation: data.saturation,
  //       value: data.value,
  //       brightness: data.bright,
  //       temperature: data.temperature,
  //     })
  //   }, option).catch(err => {
  //     // 注意：catch 使用方式从 panel-sdk v1.13.2 版本开始支持
  //     console.error("err", err);
  //   });
  // }

  const onSwitchChange = (value: boolean) => {
    setIsSwitch(value)
    if (tabIndex === 0) {
      // 本地音乐
      handleChooseLocalMusic(musicIndex)
    } else if (tabIndex === 1) {
      // handleChooseAppMusic(musicIndex)
    }
  }

  return (
    <View className={styles.music}>
      {/* 音乐模式组件区域 */}
      <View className={styles.music_mode}>
        {/* tab */}
        <View className={styles.tab}>
          {tabList.filter(item => !item.hide).map((item, index) => (
            <View key={index} className={clsx(styles.tab_item, tabIndex === index && styles.tab_active)}
              onClick={() => {
                handleChangeTab(index);
              }}>
              {item.name}
            </View>
          ))
          }
        </View>
        {tabIndex === 0 ?
          <View style={{ marginBottom: "40rpx" }}>
            <View className={styles.music_list}>
              {localMusicNames.map((item, index) => (
                <View key={item.name} className={styles.music_list_item}
                  onClick={() => {
                    handleChooseLocalMusic(index)
                  }}>
                  <View className={clsx(styles.music_list_item_box, musicIndex === index && styles.music_list_item_active)}>
                    <Image src={item.image} />
                  </View>
                  {item.name}
                </View>
              ))}
            </View>
            <View className={styles.label}>
              <Image src={require('@/static/images/home/ic_brightness.png')}></Image>
              <Text>{String.getLang("sensitivity")}</Text>
              <Text style={{ marginLeft: "16rpx" }}>{micMusicData.sensitivity}</Text>
            </View>
            <TYSlider
              style={{ marginTop: '24rpx' }}
              maxTrackHeight={"40rpx"}
              minTrackHeight={"40rpx"}
              minTrackRadius={"40rpx"}
              maxTrackRadius={"40rpx"}
              parcel
              maxTrackColor="#45424A"
              thumbWidth={"40rpx"}
              thumbHeight={"40rpx"}
              thumbRadius={"40rpx"}
              min={1}
              max={100}
              value={micMusicData.sensitivity}
              onAfterChange={(value: number) => {
                handleChangeSensitivity(value);
              }}
            />
          </View> : <View>
            <View className={styles.music_list}>
              {appMusicNames.map((item, index) => (
                <View key={index} className={styles.music_list_item}
                  onClick={() => {
                    // handleChooseAppMusic(index)
                  }}>
                  <View className={clsx(styles.music_list_item_box, musicIndex === index && styles.music_list_item_active)}>
                    <Image src={item.image} />
                  </View>
                  {item.name}
                </View>
              ))}
            </View>
          </View>}
      </View>

      {/* 随机颜色组件 */}
      <View className={styles.random_color}>
        <View className={styles.random_color_top}>
          <Text>{String.getLang("random_color")}</Text>
          <Switch size="40rpx" checked={isSwitch} inactiveColor='#17151A' activeColor="#17151A"
            className={isSwitch ? styles.random_color_switch_active : styles.random_color_switch}
            onChange={event => {
              onSwitchChange(event.detail);
            }} />
        </View>
        {
          !isSwitch && <View className={styles.random_color_box}>
            {defaultMusiColors.map((list, index) => (
              <View key={index} className={clsx(styles.random_color_list, index === colorIndex && styles.random_color_list_active)}
                onClick={() => {
                  if (tabIndex === 0) {
                    // 本地音乐
                    handleChooseColor(index)
                  } else if (tabIndex === 1) {
                    // handleChooseAppColor(index)
                  }
                }} >
                <View className={styles.random_color_list_box}>
                  {
                    list.map((item, indey) => (
                      <View key={indey} style={{ backgroundColor: hsvToRGB(item.hue, item.saturation, 100) }} className={styles.random_color_item}>
                      </View>))
                  }
                </View>
              </View>
            ))}
          </View>
        }
      </View>
    </View>
  )
}

export default memo(Music)