import React, { useEffect, useState, useMemo } from 'react';
import { View, Image, Text, ScrollView, router } from '@ray-js/ray';
import clsx from 'clsx';
import { useActions, useProps, useSupport } from '@ray-js/panel-sdk';
import { useCreation } from 'ahooks';
import { Container } from '@/components';
import { getCachedSystemInfo } from '@/api/getCachedSystemInfo';

import { useSelector, useDispatch } from 'react-redux';
import {
  selectModeIndex,
  updateModeIndex,
  selectColorMode,
  updateColorMode,
} from '@/redux/modules/uiStateSlice';
import String from '@/i18n';
import styles from './index.module.less';

export function Home() {
  const support = useSupport();
  const dpActions = useActions();
  const power = useProps(props => props.switch_led);
  const main_switch = useProps(props => props.main_switch);
  const aux_switch = useProps(props => props.aux_switch);
  const mode = useProps(props => props.work_mode);

  const dispatch = useDispatch();

  const modeIndex = useSelector(selectModeIndex);
  const colorMode = useSelector(selectColorMode);

  useEffect(() => {
    if (mode == 'colour') {
      dispatch(updateColorMode('colour'));
    }
    if (mode == 'white') {
      dispatch(updateColorMode('white'));
    }
  }, []);

  const tabList = useCreation(() => {
    return [
      {
        title: String.getLang('color'),
        icon: require('@/static/images/tabbar/ic_color.png'),
        onClick: () => {
          dpActions.work_mode.set(colorMode);
          dispatch(updateModeIndex(0));
        },
      },
      {
        title: String.getLang('scene'),
        icon: require('@/static/images/tabbar/ic_scene.png'),
        onClick: () => {
          dispatch(updateModeIndex(1));
          dpActions.work_mode.set('scene');
        },
      },
      {
        title: String.getLang('rhythm'),
        icon: require('@/static/images/tabbar/ic_music.png'),
        onClick: () => {
          dpActions.work_mode.set('music');
          dispatch(updateModeIndex(2));
        },
      },
      {
        title: String.getLang('diy'),
        icon: require('@/static/images/tabbar/ic_DIY.png'),
        onClick: () => {
          dispatch(updateModeIndex(3));
        },
      },
    ];
  }, [support, colorMode, modeIndex]);

  useEffect(() => {
    // TODO 还需要根据幻彩场景和白光场景做判断
    if (mode == 'colour' || mode == 'white') {
      dispatch(updateModeIndex(0));
    }
    if (mode == 'scene') {
      dispatch(updateModeIndex(1));
    }
    if (mode == 'music') {
      dispatch(updateModeIndex(2));
    }
  }, [mode]);

  useEffect(() => {
    if (!main_switch && !aux_switch) {
      dpActions.switch_led.set(false);
    }
  }, [main_switch, aux_switch]);

  // TODO 根据主灯开关以及副灯开关进行判断渲染banner图片
  const BannerRander = useMemo(() => {
    if (power) {
      if (main_switch && aux_switch) {
        return (
          <Image className={styles.banner} src={require('@/static/images/home/all_light.jpg')} />
        );
      }
      if (main_switch) {
        return (
          <Image className={styles.banner} src={require('@/static/images/home/king_light.jpg')} />
        );
      }
      if (aux_switch) {
        return (
          <Image className={styles.banner} src={require('@/static/images/home/aux_light.jpg')} />
        );
      }
      return (
        <Image className={styles.banner} src={require('@/static/images/home/null_light.jpg')} />
      );
    }
    return <Image className={styles.banner} src={require('@/static/images/home/null_light.jpg')} />;
  }, [power, main_switch, aux_switch]);

  return (
    <View className={styles.view}>
      <ScrollView className={styles.scroll_view} scrollY>
        <View className={styles.content}>
          {BannerRander}
          {/* 开关 */}
          <View className={styles.switch}>
            <View
              className={clsx(styles.switch_box)}
              style={{
                marginLeft: '16rpx',
                backgroundColor: power ? 'var(--theme-button-background-color)' : '#FFF',
              }}
              onClick={() => {
                dpActions.switch_led.set(!power);
                dpActions.aux_switch.set(!power);
                dpActions.main_switch.set(!power);
              }}
            >
              {power ? (
                <Image src={require('@/static/images/home/ic_on.png')} />
              ) : (
                <Image src={require('@/static/images/home/ic_off.png')} />
              )}
            </View>
            {/* 更多 */}
            <View
              className={styles.more}
              onClick={() => {
                router.push('/More');
              }}
            >
              <Image
                src={require('@/static/images/home/ic_more.png')}
                className={styles.switch_img}
              />
              <Text>{String.getLang('more')}</Text>
            </View>
          </View>
          {power && (
            <>
              <View className={styles.tabbar}>
                {tabList.map((item, index) => (
                  <View
                    key={item.title}
                    className={clsx(
                      styles.tabbar_item,
                      modeIndex === index && styles.tabbar_item_active
                    )}
                    onClick={() => {
                      if (index === modeIndex) return;
                      item.onClick();
                    }}
                  >
                    <Image src={item.icon} />
                    <Text>{item.title}</Text>
                  </View>
                ))}
              </View>
              <Container />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default Home;
