import React, { useState, useEffect } from 'react';
import { View, Image, Text } from '@ray-js/ray';
import TYSlider from '@ray-js/components-ty-slider';
import { LampCirclePickerWhite } from '@ray-js/components-ty-lamp';
import { useDispatch } from 'react-redux';
import { useSupport, utils } from '@ray-js/panel-sdk';

import styles from './index.module.less';
import String from '@/i18n';
import { updateSmearData } from '@/redux/modules/uiStateSlice';
import { DimmerMode } from '@/devices/protocols/parsers/PaintColourDataFormatter';
import { SmearDataType } from '@/redux/modules/uiStateSlice';

const { brightKelvin2rgb } = utils;


interface Props {
  /**
   * 亮度 0 - 1000
   */
  brightness: number;
  /**
   * 色温 0 - 1000
   */
  temperature: number;
  fixWhite: { brightness: number; temperature: number }[];
  onChoosePrimaryWhite: (index: number) => void;
  handleTouchEndByWhite: (val: number) => void;
  onChangeBrightness: (val: number) => void;
  isSupportTemp?: boolean;
}

const WhiteLightPanel: React.FC<Props> = (props) => {

  const { brightness, temperature, fixWhite, onChoosePrimaryWhite, handleTouchEndByWhite, onChangeBrightness, isSupportTemp = true } = props;

  const [primaryWhiteIndex, setPrimaryWhiteIndex] = useState(-1);


  useEffect(() => {
    const index = fixWhite.findIndex(item => {
      if (brightness === item.brightness && temperature === item.temperature) {
        return true;
      }
    })
    setPrimaryWhiteIndex(index);
  }, [brightness, temperature])

  return (
    <View>
      {/* 固定白光色块 */}
      <View className={styles.module_list} style={{ marginTop: '40rpx' }}>
        <View className={styles.label}>
          <Image src={require('@/static/images/home/ic_primary.png')}></Image>
          {String.getLang('color_choose')}
        </View>
        <View className={styles.color_list}>
          {fixWhite.map((item, index) => (
            <View
              key={index}
              className={`${styles.color_item} ${styles.clear} ${primaryWhiteIndex === index ? styles.color_item_active : ''
                }`}
              onClick={() => {
                setPrimaryWhiteIndex(index);
                onChoosePrimaryWhite(index)
              }}
            >
              <View
                className={styles.color_box}
                style={{ backgroundColor: brightKelvin2rgb(item.brightness, item.temperature) }}
              />
            </View>
          ))}
        </View>
      </View>

      {/* 亮度 */}
      <View className={styles.module_list} style={{ marginTop: '40rpx' }}>
        <View className={styles.label}>
          <Image src={require('@/static/images/home/ic_brightness.png')}></Image>
          <Text>{String.getLang('brightness_choose')}</Text>
          <Text style={{ marginLeft: '16rpx' }}>{Math.ceil(brightness / 10)}%</Text>
        </View>
        <TYSlider
          maxTrackWidth="656rpx"
          maxTrackHeight="30rpx"
          maxTrackRadius="30rpx"
          minTrackWidth="656rpx"
          minTrackHeight="30rpx"
          thumbWidth="40rpx"
          thumbHeight="40rpx"
          maxTrackColor="#45424A"
          style={{ marginTop: '24rpx' }}
          min={1}
          max={100}
          step={1}
          value={Math.ceil(brightness / 10)}
          onAfterChange={onChangeBrightness}
        />
      </View>

      {/* 色温 */}
      <View className={styles.module_list} style={{ marginTop: '40rpx' }}>
        <View className={styles.label}>
          <Image src={require('@/static/images/home/ic_disk.png')} />
        </View>
        <View style={{ margin: '0 auto' }}>
          {isSupportTemp ? (
            <LampCirclePickerWhite
              thumbRadius={15}
              temperature={Math.ceil(temperature)}
              radius={130}
              onTouchEnd={handleTouchEndByWhite}
              canvasId="white_picker_1"
            />
          ) : (
            <View
              style={{
                margin: '60rpx',
                width: '520rpx',
                height: '520rpx',
                borderRadius: '50%',
                background: '#FFCC62',
                boxSizing: 'border-box',
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(WhiteLightPanel);
