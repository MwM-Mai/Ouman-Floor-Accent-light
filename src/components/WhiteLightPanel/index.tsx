import React, { useState, useEffect } from 'react';
import { View, Image, Text } from '@ray-js/ray';
import TYSlider from '@ray-js/components-ty-slider';
import { LampRectWhitePicker } from '@ray-js/components-ty-lamp';
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
      {/* 色温 */}
      {
        isSupportTemp && <View className={styles.module_list} style={{ marginTop: '40rpx' }}>
          <View className={styles.label}>
            <Image src={require('@/static/images/home/ic_disk.png')} />
          </View>
          <View style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <LampRectWhitePicker
              temp={Math.ceil(temperature)}
              borderRadius={16} // 设置圆角 优先级低于 borderRadiusStyle
              borderRadiusStyle="16rpx"
              rectWidth={300}
              rectHeight={117}
              thumbRadius={12}
              isShowTip
              onTouchEnd={handleTouchEndByWhite}
              canvasId="white_picker_1"
            />
          </View>
        </View>
      }

      {/* 亮度 */}
      <View className={styles.module_list} style={{ marginTop: '40rpx' }}>
        <View className={styles.label}>
          <Image src={require('@/static/images/home/ic_brightness.png')}></Image>
          <Text>{String.getLang('brightness_choose')}</Text>
          <Text style={{ marginLeft: '16rpx' }}>{Math.ceil(brightness / 10)}%</Text>
        </View>
        <TYSlider
          style={{ margin: "0 auto", marginTop: "24rpx", width: "300px" }}
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
          step={1}
          value={Math.ceil(brightness / 10)}
          onAfterChange={onChangeBrightness}
        />
      </View>
    </View>
  );
};

export default React.memo(WhiteLightPanel);
