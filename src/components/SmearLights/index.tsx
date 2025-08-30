import React, { memo, useCallback, useState, useMemo, useEffect } from 'react';
import { View, Image, Text, Input, showToast, usePageEvent, router } from '@ray-js/ray';
import { Popup, Slider, Switch } from '@ray-js/smart-ui';
import {
  useActions,
  useProps,
  useDevice,
  utils,
  useStructuredProps,
  useStructuredActions,
} from '@ray-js/panel-sdk';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import _ from 'lodash';

import DimmerStrip, { hsv2rgbString } from '@/components/strip-light-smear';
import String from '@/i18n';
import { updateSmearData, selectSmearData, SmearDataType } from '@/redux/modules/uiStateSlice';
import { DimmerMode } from '@/devices/protocols/parsers/PaintColourDataFormatter';
import { SmearMode } from '@/components/Dimmer/type';
import {
  selectCollectSmearMap,
  updateCollectSmearMap,
  selectSmearLightColorMaps,
  updateSmearLightColorMaps,
} from '@/redux/modules/cloudStateSlice';
import { CLOUD_DATA_KEYS_MAP } from '@/constant';
import { devices } from '@/devices';
import styles from './index.module.less';

const smearModeList = [String.getLang('smearMode_1'), String.getLang('smearMode_2')];

const { hsv2rgb, brightKelvin2rgb, rgb2hsv } = utils;

const COLLCET_SMEAR_KEYS = [221, 222, 223, 224, 225, 226, 227, 228, 229, 230];

const SmearLights = () => {
  const actions = useActions();
  const structuredActions = useStructuredActions();
  const dispatch = useDispatch();

  const lightNum = useProps(props => props.lightpixel_number_set);
  const paint_colour_data = useStructuredProps(props => props.paint_colour_data);

  const smearData = useSelector(selectSmearData);
  const smearLightColorMaps = useSelector(selectSmearLightColorMaps);
  const collectSmears = useSelector(selectCollectSmearMap);

  const [isShowSave, setIsShowSave] = useState(false);
  const [name, setName] = useState(''); // 保存的名称
  const [layout, setLayout] = useState(false);

  usePageEvent('onUnload', () => {
    updateCloudSmearLightColorMapsAsync(smearLightColorMaps);
  });

  useEffect(() => {
    const data = {
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
    };
    Object.keys(paint_colour_data).forEach(key => {
      if (key === 'indexs') {
        data[key] = Array.from(data.indexs, item => item) || [];
      }
      data[key] = paint_colour_data[key];
    });
    dispatch(updateSmearData(data));
    setTimeout(() => {
      setLayout(true);
    });
  }, []);

  useEffect(() => {
    const data = _.cloneDeep(smearData);
    Object.keys(paint_colour_data).forEach(key => {
      data[key] = paint_colour_data[key];
    });
    dispatch(updateSmearData(data));
  }, [paint_colour_data]);

  useEffect(() => {
    if (!isShowSave) {
      setName('');
    }
  }, [isShowSave]);

  const paintList = useMemo(() => {
    return [
      {
        hide: false,
        icon: require('@/static/images/paint/ic_all.png'),
        iconActive: require('@/static/images/paint/ic_all_active.png'),
        key: SmearMode.all,
      },
      {
        hide: smearData.dimmerMode === DimmerMode.combination,
        icon: require('@/static/images/paint/ic_paint.png'),
        iconActive: require('@/static/images/paint/ic_paint_active.png'),
        key: SmearMode.single,
      },
      {
        hide: smearData.dimmerMode === DimmerMode.combination,
        icon: require('@/static/images/paint/ic_clean.png'),
        iconActive: require('@/static/images/paint/ic_clean_active.png'),
        key: SmearMode.clear,
      },
    ];
  }, [smearData.smearMode, smearData.dimmerMode]);

  const smearedColor = useMemo(() => {
    if (smearData.dimmerMode === DimmerMode.colour)
      return { h: smearData.hue, s: smearData.saturation, v: smearData.value === 0 ? 0 : 1000 };
    const rgbString = brightKelvin2rgb(
      smearData.brightness === 0 ? 0 : 1000,
      smearData.temperature
    );
    const rgbArray = rgbString
      .match(/\d+/g) // 使用正则表达式提取所有数字
      ?.map(Number);
    const hsv: number[] = rgb2hsv(rgbArray[0], rgbArray[1], rgbArray[2]).map(item =>
      Math.round(item)
    );
    return { h: hsv[0], s: hsv[1] * 10, v: hsv[2] * 10 };
  }, [smearData]);

  const animation = useMemo(() => {
    if (!layout) return '';
    if (smearData.smearMode === SmearMode.all) {
      return styles.collapse;
    }
    return styles.expanded;
  }, [smearData.smearMode]);

  /**
   * 监听选择器的变化
   */
  const handleMearModeChange = (index: number) => {
    dispatch(updateSmearData({ ...smearData, smearMode: index }));
    if (index === 0) {
      structuredActions.paint_colour_data.set({
        ...smearData,
        indexs: new Set(),
        smearMode: index,
        singleType: smearData.smearMode === 0 ? 0 : 1,
      });
      const _lightColorMaps = {};
      Object.keys(smearLightColorMaps).forEach(key => {
        if (smearData.dimmerMode === DimmerMode.colour) {
          _lightColorMaps[key] = hsv2rgbString(
            smearData.hue,
            smearData.saturation / 10,
            smearData.value / 10 === 0 ? 0 : 100,
            1
          );
        } else {
          _lightColorMaps[key] = brightKelvin2rgb(
            smearData.brightness === 0 ? 0 : 1000,
            smearData.temperature
          );
        }
      });
      dispatch(updateSmearLightColorMaps(_lightColorMaps));
    }
  };

  /**
   * 监听灯带涂抹事件转变
   * @param data
   */
  const onLightChange = (data: Set<number>) => {
    const newCheckedMapColor = {};
    [...data].forEach(item => {
      if (smearData.smearMode === SmearMode.clear) {
        newCheckedMapColor[item] = 'rgba(0 ,0 ,0, 1)';
      } else if (smearData.dimmerMode === DimmerMode.colour) {
        newCheckedMapColor[item] = hsv2rgbString(
          smearData.hue,
          smearData.saturation / 10,
          smearData.value / 10 === 0 ? 0 : 100,
          1
        );
      } else {
        newCheckedMapColor[item] = brightKelvin2rgb(
          smearData.brightness === 0 ? 0 : 1000,
          smearData.temperature
        );
      }
    });
    const _lightColorMaps = {
      ...smearLightColorMaps,
      ...newCheckedMapColor,
    };
    structuredActions.paint_colour_data.set({
      ...smearData,
      indexs: new Set([...data].map(idx => 23 - idx)),
      quantity: data.size,
      singleType: smearData.smearMode === 0 ? 0 : 1,
    });
    dispatch(updateSmearLightColorMaps(_lightColorMaps));
  };

  /**
   * 监听灯带涂抹事件结束
   * @param data
   */
  const onLightEnd = (data: Set<number>) => {
    const newCheckedMapColor = {};
    [...data].forEach(item => {
      if (smearData.smearMode === SmearMode.clear) {
        newCheckedMapColor[item] = 'rgba(0 ,0 ,0, 1)';
      } else if (smearData.dimmerMode === DimmerMode.colour) {
        newCheckedMapColor[item] = hsv2rgbString(
          smearData.hue,
          smearData.saturation / 10,
          smearData.value / 10 === 0 ? 0 : 100,
          1
        );
      } else {
        newCheckedMapColor[item] = brightKelvin2rgb(
          smearData.brightness === 0 ? 0 : 1000,
          smearData.temperature
        );
      }
    });
    const _lightColorMaps = {
      ...smearLightColorMaps,
      ...newCheckedMapColor,
    };
    dispatch(updateSmearLightColorMaps(_lightColorMaps));
    structuredActions.paint_colour_data.set({
      ...smearData,
      indexs: new Set([...data].map(idx => 23 - idx)),
      quantity: data.size,
      singleType: smearData.smearMode === 0 ? 0 : 1,
    });
  };

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
      chunks.map((chunk, index) => {
        return devices.lamp.model.abilities.storage.set(
          `${CLOUD_DATA_KEYS_MAP.smearLightColorMaps}_${index}`,
          chunk
        );
      })
    )
      .then(() => {
        console.log('=== updateCloudSmearLightColorMapsAsync success');
      })
      .catch(err => {
        console.error('=== storage.set smearLightColorMaps failed', err);
      });
  };

  /**
   * 处理切换灯带是否渐变
   */
  const hanadleChangeGradient = () => {
    console.log('=== handleChangeGradient', smearData.effect === 0 ? 1 : 0);
    structuredActions.paint_colour_data.set({
      ...smearData,
      effect: smearData.effect === 0 ? 1 : 0,
      indexs: new Set(smearData.indexs),
    });
  };

  return (
    <View className={styles.smear_lights}>
      <View className={styles.strip_box}>
        <View className={styles.strip_top}>
          <View className={styles.paint_box}>
            {paintList
              .filter(item => !item.hide)
              .map((item, index) => (
                <View
                  key={index}
                  className={styles.paint_box_item}
                  onClick={() => {
                    handleMearModeChange(item.key);
                  }}
                >
                  <Image src={smearData.smearMode === item.key ? item.iconActive : item.icon} />
                </View>
              ))}
          </View>
          {smearData.smearMode !== SmearMode.all && (
            <View className={styles.paint_box} style={{ marginLeft: '20rpx' }}>
              <View className={styles.paint_box_item}>
                <Image
                  src={require(smearData.effect
                    ? `@/static/images/home/ic_gradient_active.png`
                    : `@/static/images/home/ic_gradient.png`)}
                  onClick={() => {
                    hanadleChangeGradient();
                  }}
                />
              </View>
            </View>
          )}
        </View>
        <View
          className={clsx(
            styles.dimmer_strip,
            smearData.smearMode === SmearMode.all && styles.dimmer_strip_all,
            animation
          )}
        >
          <DimmerStrip
            width={340}
            height={150}
            style={{ margin: '0 auto' }}
            disabled={false}
            gradient={Boolean(smearData.effect)}
            type={smearData.smearMode}
            smearedColor={smearedColor}
            lightColorMaps={smearLightColorMaps}
            onLightChange={onLightChange}
            onLightEnd={onLightEnd}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(SmearLights);
