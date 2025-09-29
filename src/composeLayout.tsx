/* eslint-disable no-console */
import React, { Component, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import _ from 'lodash';
import store from '@/redux';
import { devices, dpKit } from '@/devices';
import { utils, SmartSupportAbility, useDevice } from '@ray-js/panel-sdk';
import { lampSchemaMap } from '@/devices/schema';
import './styles/index.less';
import getScenes from '@/config/scene';
import Storage from '@/api/storage';
import SmearDataFormatter, {
  DimmerMode,
} from '@/devices/protocols/parsers/PaintColourDataFormatter';
import { CLOUD_DATA_KEYS_MAP } from './constant';
import { initCloud } from './redux/modules/cloudStateSlice';

interface Props {
  devInfo: DevInfo;
  extraInfo?: Record<string, any>;
  preload?: boolean;
}

interface State {
  devInfo: DevInfo;
}

const { hsv2rgbString, brightKelvin2rgb } = utils;

let lightNum = 1; // 灯带点数

const { light_pixel, paint_colour_data } = lampSchemaMap;

const composeLayout = (Comp: React.ComponentType<any>) => {
  let smearData = null;

  // 创建一个 Support 实例
  const support = new SmartSupportAbility();
  support.init(); // 注意必须这样调用init

  return class PanelComponent extends Component<Props, State> {
    async onLaunch() {
      devices.lamp.init();
      devices.lamp.onInitialized(device => {
        device = device;
        dpKit.init(device);
        lightNum = device.getDevInfo().dps[light_pixel.id]
          ? device.getDevInfo().dps[light_pixel.id]
          : 1;
        const smearDataformatter = new SmearDataFormatter();
        smearData = smearDataformatter.parser(device.getDevInfo().dps[paint_colour_data.id]);
        this.initCloudData();
      });
    }

    /**
     * 初始化设备维度缓存的云端数据，并同步到 redux
     */
    async initCloudData() {
      // @ts-ignore
      ty.showLoading({ title: '' });
      return devices.lamp.model.abilities.storage
        .getAll()
        .then((data: Object) => {
          // 在云端没有数据的情况下，使用默认值
          const cloudData = {
            [CLOUD_DATA_KEYS_MAP.collectColors]: [],
            [CLOUD_DATA_KEYS_MAP.collectWhites]: [],
            [CLOUD_DATA_KEYS_MAP.diyScenes]: [],
            [CLOUD_DATA_KEYS_MAP.customScenes]: [],
            [CLOUD_DATA_KEYS_MAP.smearLightColorMaps]: {},
            [CLOUD_DATA_KEYS_MAP.collectSmearMap]: {},
          } as Parameters<typeof initCloud>['0'];
          Object.keys(data).forEach(key => {
            if (data[key]?.data?.value === undefined || data[key]?.data?.value === null) return;
            if (key.startsWith(CLOUD_DATA_KEYS_MAP.diyScenes)) {
              // 判断是否存在diy自定义
              cloudData[CLOUD_DATA_KEYS_MAP.diyScenes].push(data[key]?.data?.value);
            }
            if (key.startsWith(CLOUD_DATA_KEYS_MAP.customScenes)) {
              // 判断是否存在自定义
              cloudData[CLOUD_DATA_KEYS_MAP.customScenes].push(data[key]?.data?.value);
            }
            if (key.startsWith(CLOUD_DATA_KEYS_MAP.collectColors)) {
              // 判断是否存在收藏彩光
              cloudData[CLOUD_DATA_KEYS_MAP.collectColors] = data[key]?.data?.value;
            }
            if (key.startsWith(CLOUD_DATA_KEYS_MAP.collectWhites)) {
              // 判断是否存在收藏白光
              cloudData[CLOUD_DATA_KEYS_MAP.collectWhites] = data[key]?.data?.value;
            }
            if (key.startsWith(CLOUD_DATA_KEYS_MAP.smearLightColorMaps)) {
              // 判断是否存在涂抹调色
              cloudData[CLOUD_DATA_KEYS_MAP.smearLightColorMaps] = {
                ...cloudData[CLOUD_DATA_KEYS_MAP.smearLightColorMaps],
                ...data[key]?.data?.value,
              };
            }
            if (key.startsWith(CLOUD_DATA_KEYS_MAP.collectSmearMap)) {
              cloudData[CLOUD_DATA_KEYS_MAP.collectSmearMap] = data[key]?.data?.value;
            }
          });

          let type: 'three' | 'four' | 'five' = 'three';
          if (support.isSupportBright() && support.isSupportTemp()) type = 'five';
          if (support.isSupportBright() && !support.isSupportTemp()) type = 'four';
          if (!support.isSupportBright() && !support.isSupportTemp()) type = 'three';
          const customScenes = _.cloneDeep(getScenes(type));
          if (cloudData[CLOUD_DATA_KEYS_MAP.customScenes].length !== customScenes.length) {
            cloudData[CLOUD_DATA_KEYS_MAP.customScenes] = customScenes;
            for (let index = 0; index < customScenes.length; index++) {
              const element = customScenes[index];
              const key = `${CLOUD_DATA_KEYS_MAP.customScenes}_${element.id}`;
              setTimeout(() => {
                Storage.set(key, element);
              }, 50 * index);
            }
          }

          let rgb = 'rgb(255, 0, 0)';
          if (smearData !== null) {
            if (smearData.dimmerMode === DimmerMode.white) {
              rgb = brightKelvin2rgb(smearData.brightness, smearData.temperature);
            } else if (smearData.dimmerMode === DimmerMode.colour) {
              rgb = hsv2rgbString(
                smearData.hue,
                smearData.saturation / 10,
                smearData.value / 10,
                1
              );
            }
          }

          if (Object.keys(cloudData[CLOUD_DATA_KEYS_MAP.smearLightColorMaps]).length !== 24) {
            const _lightColorMaps = {};
            new Array(24).fill(0).forEach((_, index) => {
              _lightColorMaps[index] = rgb;
            });
            cloudData[CLOUD_DATA_KEYS_MAP.smearLightColorMaps] = _lightColorMaps;
          }

          console.log('=== storage.get', cloudData);

          // TODO: move to async action
          store.dispatch(initCloud(cloudData));
          // @ts-ignore
          ty.hideLoading();
        })
        .catch(err => {
          console.log('=== storage.get failed', err);
          // @ts-ignore
          ty.hideLoading();
        });
    }

    render() {
      const { extraInfo } = this.props;

      return (
        <Provider store={store}>
          <Comp extraInfo={extraInfo} {...this.props} />
        </Provider>
      );
    }
  };
};

export default composeLayout;
