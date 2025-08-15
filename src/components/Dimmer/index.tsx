import React, { useState, memo, useMemo, useEffect, useCallback } from 'react'
import { View, Image, Text, router, showToast } from '@ray-js/ray';
import { useActions, useProps, useSupport, utils, useStructuredProps, useStructuredActions } from '@ray-js/panel-sdk';
import clsx from 'clsx';
import TYSlider from '@ray-js/components-ty-slider';
import { useSelector, useDispatch } from 'react-redux';
import DimmerStrip, { hsv2rgbString } from '../strip-light-smear';
import _ from 'lodash';
import { Switch } from '@ray-js/smart-ui';

import styles from './index.module.less';
import { IColorData, IHS, SmearMode } from './type'
import { selectCollectColours, selectCollectWhites, updateCollectColors, updateCollectWhites, selectSmearLightColorMaps, updateSmearLightColorMaps } from '@/redux/modules/cloudStateSlice'
import { updateSmearData, selectSmearData, SmearDataType } from '@/redux/modules/uiStateSlice'
import { updateColorMode } from '@/redux/modules/uiStateSlice'
import { CLOUD_DATA_KEYS_MAP } from '@/constant';
import AddColor from '../AddColor'
import { ISavceData } from '../AddColor/type';
import String from '@/i18n'
import { DimmerMode } from '@/devices/protocols/parsers/PaintColourDataFormatter';
import SmearLights from '@/components/SmearLights'
import { devices } from '@/devices';
import { ColorModePanel } from '../ColorModePanel';
import WhiteLightPanel from '../WhiteLightPanel';


const fixColor = [
  {
    hue: 0,
    saturation: 0,
    value: 0,
  },
  {
    hue: 0,
    saturation: 1000,
    value: 1000,
  },
  {
    hue: 60,
    saturation: 1000,
    value: 1000,
  },
  {
    hue: 120,
    saturation: 1000,
    value: 1000,
  },
  {
    hue: 240,
    saturation: 1000,
    value: 1000,
  }
];

const fixWhite = [
  {
    brightness: 0,
    temperature: 0,
  },
  {
    brightness: 1000,
    temperature: 0,
  },
  {
    brightness: 1000,
    temperature: 500,
  },
  {
    brightness: 1000,
    temperature: 1000,
  },
]

const { hsv2rgb, brightKelvin2rgb } = utils;

const Dimmer = () => {
  const action = useActions();
  const dispatch = useDispatch();
  const structuredActions = useStructuredActions();
  const support = useSupport();

  const collectColours = useSelector(selectCollectColours);
  const collectWhites = useSelector(selectCollectWhites);
  const smearData = useSelector(selectSmearData);
  const smearLightColorMaps = useSelector(selectSmearLightColorMaps);

  const aux_switch = useProps(props => props.aux_switch)
  const main_switch = useProps(props => props.main_switch)
  const aux_bright = useProps(props => props.aux_bright)
  const aux_temp = useProps(props => props.aux_temp)
  const aux_mode = useProps(props => props.aux_mode)
  const aux_colour = useStructuredProps(props => props.aux_colour)


  const [powerIndex, setPowerIndex] = useState(0);
  const [colectIndex, setColectIndex] = useState(-1);
  const [edit, setEdit] = useState(false);
  const [showAddcolor, setShowAddcolor] = useState(false);
  const [type, setType] = useState(1); // 1: 添加 2: 编辑
  const [id, setId] = useState(-1); // 编辑的颜色id
  const [tabList, setTabList] = useState<{ name: string, hide: boolean, code: "colour" | "white" }[]>([
    {
      name: String.getLang("colour"),
      hide: false,
      code: 'colour'
    },
    {
      name: String.getLang("white"),
      hide: false,
      code: 'white'
    }
  ])

  const powerList = useMemo(() => [
    {
      name: String.getLang("king_light"),
      code: 'main_switch',
      hide: !main_switch,
    },
    {
      name: String.getLang("aux_light"),
      code: 'aux_switch',
      hide: !aux_switch,
    }
  ], [main_switch, aux_switch]);

  /**
   * rgb转hsv
   * @param hsv hsv
   * @returns 
   */
  const hsvToRgb = (hsv: { hue: number, saturation: number, value: number }): string => {
    const { hue, saturation, value } = hsv;
    const [r, g, b] = hsv2rgb(hue, saturation, value);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const tabIndex = useMemo(() => {
    switch (smearData.dimmerMode) {
      case DimmerMode.colour:
        return 0;
      case DimmerMode.white:
        return 1;
      default:
        return 0;
    }
  }, [smearData.dimmerMode])

  const auxTabIndex = useMemo(() => {
    if (aux_mode === "white") {
      return 1;
    }
    return 0;
  }, [aux_mode])

  const collectList = useMemo(() => {
    if (smearData.dimmerMode === DimmerMode.colour) {
      return collectColours.map((item, index) => {
        const { hue, saturation, value } = item;
        return {
          id: index,
          color: hsvToRgb({ hue, saturation, value }),
          onClick: () => {
            const data = {
              ...smearData,
              dimmerMode: DimmerMode.colour,
              hue: item.hue,
              saturation: item.saturation,
              value: item.value
            }
            dispatch(updateSmearData(data))
            handleUpdateSmearColor(data)
          }
        }
      });
    } else if (smearData.dimmerMode === DimmerMode.white) {
      return collectWhites.map((item, index) => {
        const { brightness, temperature } = item;
        return {
          id: index,
          color: brightKelvin2rgb(brightness, temperature),
          onClick: () => {
            const data = {
              ...smearData,
              dimmerMode: DimmerMode.white,
              brightness: brightness,
              temperature: temperature
            }
            dispatch(updateSmearData(data))
            handleUpdateSmearColor(data)
          }
        }
      })
    }
    return [];
  }, [smearData.dimmerMode, collectColours, collectWhites])

  const hs = useMemo(() => {
    const { hue, saturation } = smearData;
    return { h: hue, s: saturation };
  }, [smearData])


  /**
   * 处理点击灯带类型的转变
   */
  const handleClickPowerChange = (index: number) => {
    if (index === powerIndex) return;
    if (powerList[index].hide) {
      return showToast({
        title: String.getLang("power_change_warnning"),
        icon: 'none',
      })
    }
    setPowerIndex(index);
  }

  /**
   * 切换tab
   * @param code tab类型
   */
  const handleChangeTab = (code: "colour" | "white") => {
    dispatch(updateColorMode(code));
    const data = {
      ...smearData,
      dimmerMode: code === "colour" ? DimmerMode.colour : DimmerMode.white
    }
    dispatch(updateSmearData(data))
    handleUpdateSmearColor(data)
  }

  /**
   *  处理选择预选颜色
   * @param hsv hsv
   */
  const handleChoosePrimaryColor = (hsv: IColorData) => {
    const data = {
      ...smearData,
      dimmerMode: DimmerMode.colour,
      hue: hsv.hue,
      saturation: hsv.saturation,
      value: hsv.value
    }
    dispatch(updateSmearData(data))
    handleUpdateSmearColor(data)
  }

  const handleChoosePrimaryWhite = (index: number) => {
    const _white = fixWhite[index];
    const data = {
      ...smearData,
      dimmerMode: DimmerMode.white,
      temperature: _white.temperature,
      brightness: _white.brightness
    }
    dispatch(updateSmearData(data))
    handleUpdateSmearColor(data)
  }

  /**
   * 监听颜色亮度选择
   */
  const onChangeValueByColour = (value: number) => {
    setColectIndex(-1);
    const data = {
      ...smearData,
      dimmerMode: DimmerMode.colour,
      value: value * 10
    }
    dispatch(updateSmearData(data))
    handleUpdateSmearColor(data)
  }

  /**
   * 色盘移动开始
   */
  const handleTouchStart = (e: IHS) => {
    setColectIndex(-1);
  }

  /**
   * 色盘移动时间结束
   */
  const handleTouchEnd = (e: IHS) => {
    setColectIndex(-1);
    const data = {
      ...smearData,
      dimmerMode: DimmerMode.colour,
      hue: e.h,
      saturation: e.s,
    }
    dispatch(updateSmearData(data))
    handleUpdateSmearColor(data)
  }

  /**
   * 滑动白光色温
   * @param val 色温值
   */
  const handleTouchEndByWhite = (val: number) => {
    setColectIndex(-1);
    const data = {
      ...smearData,
      dimmerMode: DimmerMode.white,
      temperature: val,
    }
    dispatch(updateSmearData(data))
    handleUpdateSmearColor(data)
  }

  /**
   * 处理白光亮度的跳转
   */
  const onChangeBrightnessByWhite = (val: number) => {
    setColectIndex(-1);
    const data = {
      ...smearData,
      dimmerMode: DimmerMode.white,
      brightness: val * 10,
    };
    dispatch(updateSmearData(data));
    handleUpdateSmearColor(data);
  }

  /**
   * 处理选择收藏颜色 
   */
  const handleChooseColectColor = (index: number) => {
    if (edit) {
      setType(2);
      setId(index);
      setShowAddcolor(true);
    } else {
      setColectIndex(index);
      if (smearData.dimmerMode === DimmerMode.white) {
        const { brightness, temperature } = collectWhites[index];
        const data = {
          ...smearData,
          dimmerMode: DimmerMode.white,
          brightness,
          temperature,
        }
        dispatch(updateSmearData(data))
        handleUpdateSmearColor(data)
      } else if (smearData.dimmerMode === DimmerMode.colour) {
        const { hue, saturation, value } = collectColours[index];
        const data = {
          ...smearData,
          dimmerMode: DimmerMode.colour,
          hue,
          saturation,
          value,
        }
        dispatch(updateSmearData(data))
        handleUpdateSmearColor(data)
      }
    }
  }

  /**
   * 处理点击编辑
   */
  const handleChangeEdit = () => {
    setEdit(!edit);
  }

  /**
   * 处理点击删除我的颜色
   */
  const handelRemoveColor = (index: number) => {
    if (smearData.dimmerMode === DimmerMode.colour) {
      const data = collectColours.filter((item, indey) => indey !== index);
      devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.collectColors, data).then(() => {
        dispatch(updateCollectColors(data))
      })
    } else if (smearData.dimmerMode === DimmerMode.white) {
      const data = collectWhites.filter((item, indey) => indey !== index);
      devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.collectWhites, data).then(() => {
        dispatch(updateCollectWhites(data))
      })
    }
  }


  /**
   * 处理点击色盘组件保存
   */
  const handleSave = ({ hs, temp }: ISavceData) => {
    if (type === 1) {
      if (smearData.dimmerMode === DimmerMode.colour) {
        const hsv: IColorData = { hue: hs.h, saturation: hs.s, value: 1000 };
        const data = [...collectColours, hsv]
        devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.collectColors, data)
          .then(() => {
            dispatch(updateCollectColors(data))
          })
      } else {
        const tempOrbrigh = { temperature: temp, brightness: 1000 };
        const data = [...collectWhites, tempOrbrigh]
        devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.collectWhites, data)
          .then(() => {
            dispatch(updateCollectWhites(data))
          })
      }
    } else {
      // 修改
      if (smearData.dimmerMode === DimmerMode.colour) {
        const hsv: IColorData = { hue: hs.h, saturation: hs.s, value: 1000 };
        const data = [...collectColours];
        data[id] = hsv;
        devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.collectColors, data)
          .then(() => {
            dispatch(updateCollectColors(data))
          })
      } else {
        const tempOrbrigh = { temperature: temp, brightness: 1000 };
        const data = [...collectWhites];
        console.log("id", id);

        data[id] = tempOrbrigh;
        devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.collectWhites, data)
          .then(() => {
            dispatch(updateCollectWhites(data))
          })
      }
    }
  }

  /**
   * 处理更新涂抹调色
   */
  const handleUpdateSmearColor = (data: SmearDataType, colorMpas?: { [key: string]: string }) => {
    colorMpas = colorMpas === undefined ? _.cloneDeep(smearLightColorMaps) : colorMpas;
    if (data.smearMode !== SmearMode.all) return;
    Object.keys(colorMpas).map(key => {
      if (data.dimmerMode === DimmerMode.colour) {
        colorMpas[key] = hsv2rgbString(
          data.hue,
          data.saturation / 10,
          data.value / 10 === 0 ? 0 : 100,
          1
        );
      } else {
        colorMpas[key] = brightKelvin2rgb(data.brightness === 0 ? 0 : 1000, data.temperature);
      }
    });
    dispatch(updateSmearLightColorMaps(colorMpas))
    structuredActions.paint_colour_data.set({
      ...data,
      smearMode: data.smearMode,
      hue: data.hue,
      value: data.value,
      saturation: data.saturation,
      indexs: new Set(),
      singleType: data.smearMode === 0 ? 0 : 1
    })
    updateCloudSmearLightColorMapsAsync(colorMpas)
  }

  /**
 *  颜色数据保存到云端
 */
  const updateCloudSmearLightColorMapsAsync = (data: Record<string, string>) => {
    const keys = Object.keys(data);
    const chunkSize = 20;

    // 拆分对象为多个 chunk
    const chunks: Array<Record<string, string>> = [];
    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunkKeys = keys.slice(i, i + chunkSize);
      const chunkData = chunkKeys.reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {} as Record<string, string>);
      chunks.push(chunkData);
    }

    return Promise.all(
      chunks.map((chunk, index) =>
        devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.smearLightColorMaps + "_" + index, chunk)
      )
    ).then(() => {
      console.log('=== updateCloudSmearLightColorMapsAsync success');
    }).catch(err => {
      console.error('=== storage.set smearLightColorMaps failed', err);
    });
  }

  /**
   * 渲染添加颜色弹窗
   */
  const render = useCallback(() => {
    return (
      <AddColor
        showPopup={showAddcolor}
        type={type}
        mode={smearData.dimmerMode === DimmerMode.white ? 'white' : 'colour'}
        id={id}
        colours={collectColours}
        closePopup={() => {
          setShowAddcolor(false);
          setId(-1);
        }}
        savaCallBack={async (data) => {
          await handleSave(data);
          setShowAddcolor(false);
        }}
      />
    )
  }, [showAddcolor, type, smearData.dimmerMode, id])


  const mainLightRander = useMemo(() => {
    if (powerIndex !== 0) return null
    return (
      <View className={clsx(!main_switch && styles.offLight)}>
        <View className={styles.tab}>
          {tabList.filter(item => !item.hide).map((item, index) => (
            <View key={index} className={clsx(styles.tab_item, tabIndex === index && styles.tab_active)}
              onClick={() => {
                handleChangeTab(item.code);
              }}>
              {item.name}
            </View>
          ))
          }
        </View>
        {/* 涂抹调色 */}
        <SmearLights />
        {/* 彩光组件区域 */}
        {smearData.dimmerMode === DimmerMode.colour && <ColorModePanel
          hs={hs}
          value={smearData.value}
          fixColor={fixColor}
          onChoosePrimaryColor={handleChoosePrimaryColor}
          onChangeBrightness={onChangeValueByColour}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          hsvToRgb={hsvToRgb}
        />}
        {/* 白光组件区域 */}
        {smearData.dimmerMode === DimmerMode.white && (
          <WhiteLightPanel
            brightness={smearData.brightness}
            temperature={smearData.temperature}
            fixWhite={fixWhite}
            onChoosePrimaryWhite={handleChoosePrimaryWhite}
            handleTouchEndByWhite={handleTouchEndByWhite}
            onChangeBrightness={onChangeBrightnessByWhite}
            isSupportTemp={support.isSupportTemp()}
          />
        )}
      </View>
    )
  }, [powerIndex, smearData, fixWhite, tabList, tabIndex, main_switch])

  const auxLightRander = useMemo(() => {
    if (powerIndex !== 1) return null;
    return (
      <View className={clsx(!aux_switch && styles.offLight)}>
        <View className={styles.tab}>
          {tabList.filter(item => !item.hide).map((item, index) => (
            <View key={index} className={clsx(styles.tab_item, auxTabIndex === index && styles.tab_active)}
              onClick={() => {
                action.aux_mode.set(item.code);
              }}>
              {item.name}
            </View>
          ))
          }
        </View>
        {/* 底座彩光组件区域 */}
        {aux_mode === "colour" && (
          <ColorModePanel
            hs={{ h: aux_colour.hue, s: aux_colour.saturation }}
            value={aux_colour.value}
            fixColor={fixColor}
            onChoosePrimaryColor={(hsv) => {
              structuredActions.aux_colour.set(hsv)
            }}
            onChangeBrightness={(value) => {
              structuredActions.aux_colour.set({
                ...aux_colour,
                value: value
              })
            }}
            onTouchEnd={(hs) => {
              structuredActions.aux_colour.set({
                ...aux_colour,
                hue: hs.h,
                saturation: hs.s
              })
            }}
            hsvToRgb={hsvToRgb}
          />
        )}
        {/* 底座白光组件 */}
        {aux_mode === "white" && (
          <WhiteLightPanel
            brightness={aux_bright}
            temperature={aux_temp}
            fixWhite={fixWhite}
            onChoosePrimaryWhite={(index) => {
              const _white = fixWhite[index];
              action.aux_bright.set(_white.brightness);
              action.temp_value.set(Math.round(_white.temperature));
            }}
            handleTouchEndByWhite={(value) => {
              action.temp_value.set(value);
            }}
            onChangeBrightness={(value) => {
              action.aux_bright.set(value * 10);
            }}
            isSupportTemp={support.isSupportTemp()}
          />
        )}
      </View>
    )
  }, [powerIndex, aux_colour, aux_bright, aux_temp, aux_mode, auxTabIndex, tabList, aux_switch])

  return (
    <View className={styles.dimmer}>
      <View className={styles.controller_color} >
        {/* 灯光控制组件 */}
        <View className={styles.power}>
          {powerList.map((item, index) => (
            <View key={index} className={styles.power_item} >
              <View className={styles.title} onClick={() => {
                handleClickPowerChange(index)
              }}>
                {item.name}
                {powerIndex === index && (
                  <Image src={require('@/static/images/home/ic_power_active.png')} />
                )}
              </View>
              <View className={styles.power_switch}>
                <Switch
                  checked={item.code === "main_switch" ? main_switch : aux_switch}
                  size="48rpx"
                  onChange={(event) => {
                    action[item.code].toggle()
                  }}
                />
              </View>
            </View>
          ))}
        </View>
        {mainLightRander}
        {auxLightRander}
      </View>


      {/* 我的颜色 */}
      {
        (!support.isSupportTemp() && smearData.dimmerMode === DimmerMode.white) || powerIndex === 1 ? (
          <></>
        ) : <View className={styles.my_color}>
          <View className={styles.label}>
            <Text>{String.getLang("my_color")}</Text>
            {collectList.length > 0 && (
              <View className={styles.edit}
                onClick={() => {
                  handleChangeEdit();
                }}>
                <Image src={edit ? require('@/static/images/common/ic_return.png') : require('@/static/images/common/ic_edit.png')}></Image>
                <Text>{edit ? String.getLang("cancel") : String.getLang("edit")}</Text>
              </View>
            )}
          </View>
          <View className={styles.collect_list}>
            {collectList.map((item, index) => (
              <View key={index} className={clsx(styles.color_item, colectIndex === index && styles.color_item_active)} onClick={() => {
                handleChooseColectColor(index);
              }}>
                <View className={clsx(styles.color_box)}
                  style={{
                    backgroundColor: item.color
                  }}
                  hoverClassName={styles.color_box_hover}
                >
                </View>
                {edit && <View className={styles.delete_btn} onClick={(e) => {
                  e.origin.stopPropagation();
                  handelRemoveColor(index);
                }} >
                  <Image src={require('@/static/images/common/ic_remove.png')}></Image>
                </View>}
              </View>))}
          </View>
          <View className={styles.add_color} onClick={() => {
            if (collectColours.length >= 10) return;
            setType(1);
            setShowAddcolor(true);
          }}>
            + {String.getLang("add_color")}
          </View>
        </View>
      }

      {render()}
    </View >
  );
}

export default memo(Dimmer);