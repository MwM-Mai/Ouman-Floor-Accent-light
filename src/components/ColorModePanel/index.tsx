import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image } from '@ray-js/ray';
import clsx from 'clsx';
import TYSlider from '@ray-js/components-ty-slider';
import { LampRectPickerColor, LampColorCard } from '@ray-js/components-ty-lamp';
import { IColorData, IHS } from '@/components/Dimmer/type';
import { groupColorsList } from '@/config/default';
import String from '@/i18n';
import styles from './index.module.less';

interface Props {
  hs: { h: number; s: number };
  value: number;
  fixColor: IColorData[];
  showCombination?: boolean;
  type?: number;
  onDimmerModeChange?: (type: number) => void;
  onChoosePrimaryColor: (hsv: IColorData) => void;
  onChangeBrightness: (value: number) => void;
  onTouchStart?: (e: IHS) => void;
  onTouchMove?: (e: IHS) => void;
  onTouchEnd: (e: IHS) => void;
  onChangeCombinationColor?: (hsv: IColorData[]) => void;
  hsvToRgb: (hsv: IColorData) => string;
}

export const ColorModePanel: React.FC<Props> = ({
  hs,
  value,
  fixColor,
  showCombination,
  type = 0,
  onDimmerModeChange,
  onChoosePrimaryColor,
  onChangeBrightness,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onChangeCombinationColor,
  hsvToRgb,
}) => {
  const [CPType, setCPType] = useState(0); // 0: 色盘, 1: 色块 2: 组合
  const [primaryIndex, setPrimaryIndex] = useState(-1);
  const [combinationIndex, setCombinationIndex] = useState(0);

  useEffect(() => {
    const { h, s } = hs;
    const index = fixColor.findIndex(item => {
      if (h === item.hue && s === item.saturation) {
        return true;
      }
    });
    setPrimaryIndex(index);
  }, [hs]);

  useEffect(() => {
    if (type === 2) {
      setCPType(2);
    }
  }, [type]);

  // 圆形组件
  const ColorCircle = ({ colors, size = 70, idx }) => {
    const anglePerSlice = 360 / colors.length;
    const gradientParts = [];

    colors.forEach((color, i) => {
      const start = i * anglePerSlice;
      const end = (i + 1) * anglePerSlice;
      gradientParts.push(
        `${hsvToRgb({
          hue: color.hue,
          saturation: color.saturation / 10,
          value: color.value / 10,
        })} ${start}deg ${end}deg`
      );
    });

    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `conic-gradient(${gradientParts.join(', ')})`,
          border: idx === combinationIndex ? '1px solid var(--nav-bar-text-color)' : 'none',
          cursor: 'pointer',
        }}
        onClick={() => {
          setCombinationIndex(idx);
          onChangeCombinationColor && onChangeCombinationColor(colors);
        }}
      />
    );
  };

  const colourBoxRender = useMemo(() => {
    if (CPType === 0) {
      return (
        <LampRectPickerColor
          hs={hs}
          borderRadius={16} // 设置圆角 优先级低于 borderRadiusStyle
          borderRadiusStyle="16rpx"
          rectWidth={300}
          rectHeight={117}
          thumbRadius={12}
          isShowColorTip
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      );
    }
    if (CPType === 1) {
      return (
        <LampColorCard
          hs={hs}
          rectWidth={300}
          thumbBorderWidth={2}
          thumbBorderColor="#fff"
          thumbBorderRadius={4}
          onTouchEnd={onTouchEnd}
        />
      );
    }
    return (
      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(6, auto)', gap: '10px' }}>
        {groupColorsList.map((colors, idx) => (
          <ColorCircle idx={idx} key={idx} colors={colors} />
        ))}
      </View>
    );
  }, [CPType, hs, showCombination, combinationIndex]);

  return (
    <View>
      {/* 色盘/色轮 */}
      <View className={styles.module_list} style={{ marginTop: '40rpx' }}>
        <View className={clsx(styles.label)}>
          <View
            className={clsx(styles.label_item, CPType === 0 && styles.label_item_active)}
            onClick={() => {
              setCPType(0);
              onDimmerModeChange && onDimmerModeChange(0);
            }}
          >
            {String.getLang('colour')}
          </View>
          <View
            className={clsx(styles.label_item, CPType === 1 && styles.label_item_active)}
            onClick={() => {
              setCPType(1);
              onDimmerModeChange && onDimmerModeChange(1);
            }}
          >
            {String.getLang('colour_card')}
          </View>
          {showCombination && (
            <View
              className={clsx(styles.label_item, CPType === 2 && styles.label_item_active)}
              onClick={() => {
                setCPType(2);
                onDimmerModeChange && onDimmerModeChange(2);
              }}
            >
              {String.getLang('combination')}
            </View>
          )}
        </View>
        <View style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {colourBoxRender}
        </View>
      </View>

      {/* 亮度调节 */}
      {CPType !== 2 && (
        <View className={styles.module_list} style={{ marginTop: '40rpx' }}>
          <View className={styles.label}>
            <Image src={require('@/static/images/home/ic_brightness.png')} />
            <Text>{String.getLang('brightness')}</Text>
            <Text style={{ marginLeft: '16rpx' }}>{Math.ceil(value / 10)} %</Text>
          </View>
          <TYSlider
            style={{ margin: '0 auto', marginTop: '24rpx', width: '300px' }}
            min={1}
            max={100}
            value={value / 10}
            maxTrackHeight="40rpx"
            minTrackHeight="40rpx"
            minTrackRadius="40rpx"
            maxTrackRadius="40rpx"
            parcel
            maxTrackColor="#45424A"
            thumbWidth="40rpx"
            thumbHeight="40rpx"
            thumbRadius="40rpx"
            onAfterChange={onChangeBrightness}
          />
        </View>
      )}
    </View>
  );
};
