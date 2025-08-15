import React, { useEffect, useState, useMemo, memo } from 'react';
import { View, Image, Text, ScrollView, router, navigateTo } from '@ray-js/ray';
import {
  useDevice,
  useActions,
  useProps,
  useSupport
} from '@ray-js/panel-sdk';
import clsx from 'clsx';
import TYSlider from '@ray-js/components-ty-slider';

import { Navbar } from '@/components'
import { getCachedSystemInfo } from "@/api/getCachedSystemInfo"
import styles from './index.module.less'
import { openScheduleFunctional } from '@/utils/openScheduleFunctional';
import { lampSchemaMap } from '@/devices/schema';
import String from '@/i18n'

const { statusBarHeight } = getCachedSystemInfo();

const {
  countdown,
  do_not_disturb,
} = lampSchemaMap;
const More = () => {
  const support = useSupport();
  const deviceId = useDevice(d => d.devInfo.devId);
  const groupId = useDevice(d => d.devInfo.groupId);
  const isGroupDevice = support.isGroupDevice();

  /**
   * 处理点击定时设置
   */
  const handleClickClock = () => {
    openScheduleFunctional()
  }

  /**
   * 处理点击停电勿扰
   */
  const handleClickDoNotDisturb = () => {
    const jumpUrl = `functional://LampNoDisturbFunctional/home?deviceId=${deviceId ||
      ''}&groupId=${groupId || ''}&activeColor=rgb(16, 130, 254)`;
    navigateTo({
      url: jumpUrl,
    });
  }

  return (
    <View className={styles.more}>
      <Navbar leftRender={() => (
        <View className={styles.back_icon}>
          <Image src={require('@/static/images/common/ic_back.png')} className="" />
        </View>
      )}
        title="更多" />
      <ScrollView scrollY={true} style={{
        width: '100%',
        height: `calc(100vh - ${statusBarHeight || 0}px - 44px)`,
        padding: "20rpx 36rpx",
        boxSizing: "border-box"
      }}>
        {!isGroupDevice && <View className={styles.item} onClick={() => {
          handleClickClock()
        }}>
          {String.getLang("timing")}
          <Image src={require('@/static/images/common/ic_enter.png')} className="" />
        </View>}
        {/* {support.isSupportDp(do_not_disturb.code) && !isGroupDevice && <View className={styles.item} onClick={() => {
          handleClickDoNotDisturb();
        }}>
          {String.getLang("do_not_disturb")}
          <Image src={require('@/static/images/common/ic_enter.png')} className="" />
        </View>}
        <View className={styles.item}
          onClick={() => {
            router.push('/Line')
          }}>
          {String.getLang("line_adjust")}
          <Image src={require('@/static/images/common/ic_enter.png')} className="" />
        </View>
        <View className={clsx(styles.item, styles.motor)}>
          {String.getLang("motor_speed")} 10%
          <TYSlider
            maxTrackWidth="600rpx"
            maxTrackHeight="16rpx"
            maxTrackRadius="7rpx"
            minTrackWidth="600rpx"
            minTrackHeight="16rpx"
            thumbWidth="18px"
            thumbHeight="18px"
            maxTrackColor="#45424A"
            style={{ marginTop: '20rpx' }}
            min={0}
            max={100}
            step={1}
            value={10}
            onAfterChange={(value: number) => {

            }}
          />
        </View> */}
      </ScrollView>
    </View>
  );
}

export default memo(More);