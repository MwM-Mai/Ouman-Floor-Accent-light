import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@ray-js/ray';
import clsx from 'clsx';
import TYSlider from '@ray-js/components-ty-slider';
import { LampCirclePickerColor, LampColorWheel } from '@ray-js/components-ty-lamp';
import styles from './index.module.less';
import { IColorData, IHS } from '@/components/Dimmer/type';

interface Props {
  hs: { h: number; s: number };
  value: number;
  fixColor: IColorData[];
  onChoosePrimaryColor: (hsv: IColorData) => void;
  onChangeBrightness: (value: number) => void;
  onTouchStart?: (e: IHS) => void;
  onTouchMove?: (e: IHS) => void;
  onTouchEnd: (e: IHS) => void;
  hsvToRgb: (hsv: IColorData) => string;
}

export const ColorModePanel: React.FC<Props> = ({
  hs,
  value,
  fixColor,
  onChoosePrimaryColor,
  onChangeBrightness,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  hsvToRgb,
}) => {

  const [CPType, setCPType] = useState(true); // true: 色盘, false: 色块
  const [primaryIndex, setPrimaryIndex] = useState(-1);

  useEffect(() => {
    const { h, s } = hs;
    const index = fixColor.findIndex(item => {
      if (h === item.hue && s === item.saturation) {
        return true;
      }
    })
    setPrimaryIndex(index);
  }, [hs])

  return (
    <View>
      {/* 预设颜色选择 */}
      <View className={styles.module_list} style={{ marginTop: "40rpx" }}>
        <View className={styles.label}>
          <Image src={require('@/static/images/home/ic_primary.png')} />
          颜色选择
        </View>
        <View className={styles.color_list}>
          {fixColor.map((hsv, index) => (
            <View key={index} className={clsx(styles.color_item, styles.clear, primaryIndex === index && styles.color_item_active)}
              onClick={() => onChoosePrimaryColor(hsv)}>
              <View className={styles.color_box} style={{ backgroundColor: hsvToRgb(hsv) }} />
            </View>
          ))}
        </View>
      </View>

      {/* 亮度调节 */}
      <View className={styles.module_list} style={{ marginTop: "40rpx" }}>
        <View className={styles.label}>
          <Image src={require('@/static/images/home/ic_brightness.png')} />
          <Text>亮度调节</Text>
          <Text style={{ marginLeft: "16rpx" }}>{Math.ceil(value / 10)} %</Text>
        </View>
        <TYSlider
          min={1}
          max={100}
          value={value / 10}
          onAfterChange={onChangeBrightness}
        />
      </View>

      {/* 色盘/色轮 */}
      <View className={styles.module_list} style={{ marginTop: "40rpx" }}>
        <View className={clsx(styles.label, styles.colour_label)} style={{ justifyContent: "space-between" }}>
          <Image src={require('@/static/images/home/ic_disk.png')} />
          <Image className={styles.image} src={require('@/static/images/home/ic_convert.png')} onClick={() => setCPType(!CPType)} />
        </View>
        <View style={{ margin: "0 auto" }}>
          {CPType ? (
            <LampCirclePickerColor
              hs={hs}
              thumbRadius={15}
              radius={130}
              whiteRange={0.15}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
          ) : (
            <LampColorWheel
              hsColor={hs}
              hollowRadius={21}
              centerRingRadius={17}
              ringRadius={130}
              paddingWidth={20}
              onTouchEnd={onTouchEnd}
            />
          )}
        </View>
      </View>
    </View>
  );
};