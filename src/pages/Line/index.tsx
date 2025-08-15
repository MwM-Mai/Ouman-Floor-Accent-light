import React, { useEffect, useState, useMemo, memo } from 'react';
import { View, Image, Text, ScrollView, router, navigateTo } from '@ray-js/ray';
import {
  useDevice,
  useActions,
  useProps,
  useSupport
} from '@ray-js/panel-sdk';
import clsx from 'clsx';

import { Navbar } from '@/components'
import { getCachedSystemInfo } from "@/api/getCachedSystemInfo"
import styles from './index.module.less'

const { statusBarHeight } = getCachedSystemInfo();
const More = () => {
  const action = useActions();
  const lineList = ["RGB", "RBG", "GRB", "GBR", "BRG", "BGR"]

  const line = useProps(props => props.light_bead_sequence);


  return (
    <View className={styles.more}>
      <Navbar leftRender={() => (
        <View className={styles.back_icon}>
          <Image src={require('@/static/images/common/ic_back.png')} className="" />
        </View>
      )}
        title="线序调节" />
      <ScrollView scrollY={true} style={{
        width: '100%',
        height: `calc(100vh - ${statusBarHeight || 0}px - 44px)`,
        padding: "20rpx 36rpx",
        boxSizing: "border-box"
      }}>
        {lineList.map((item, index) => (
          <View key={item} className={clsx(styles.item, line.toLowerCase() === item.toLowerCase() && styles.item_active)}
            onClick={() => {
              action.light_bead_sequence.set(item.toLowerCase())
            }}
          >
            {item}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(More);