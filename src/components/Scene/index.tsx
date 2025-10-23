import React, { memo, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { View, Image, Text, router, showToast } from '@ray-js/ray';
import { useSupport, useStructuredActions, useStructuredProps, useProps } from '@ray-js/panel-sdk';
import clsx from 'clsx';

import { IqueryData } from '@/pages/CustomScene/type';
import { selectCustomScenes } from '@/redux/modules/cloudStateSlice';
import String from '@/i18n';
import { IAuxScene } from '@/devices/protocols/parsers/AuxSceneFormatter';
import styles from './index.module.less';

const tabList = [
  {
    name: String.getLang('scene_tab_name_0'),
  },
  {
    name: String.getLang('scene_tab_name_1'),
  },
  {
    name: String.getLang('scene_tab_name_2'),
  },
  {
    name: String.getLang('scene_tab_name_3'),
  },
  {
    name: String.getLang('scene_tab_name_4'),
  },
];

const auxScenes: IAuxScene[] = [
  {
    sceneId: 1,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 0,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 120,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 240,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 61,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 174,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 275,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/aux_light/aux_scene_0.png'),
    name: String.getLang(`scene_mode_2`),
  },
  {
    sceneId: 2,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 0,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 120,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 240,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 61,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 174,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 275,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/aux_light/aux_scene_1.png'),
    name: String.getLang(`scene_mode_1`),
  },
  {
    sceneId: 3,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 0,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 120,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 240,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 61,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 174,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 275,
        S: 1000,
        V: 1000,
        B: 0,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/aux_light/aux_scene_2.png'),
    name: String.getLang(`scene_mode_3`),
  },
  {
    sceneId: 4,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 0,
        H: 0,
        S: 0,
        V: 0,
        B: 300,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/aux_light/aux_scene_3.png'),
    name: String.getLang(`aux_scene_name_01`),
  },
  {
    sceneId: 5,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 85,
        S: 600,
        V: 950,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 120,
        S: 850,
        V: 650,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 140,
        S: 400,
        V: 450,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 3,
        H: 60,
        S: 500,
        V: 800,
        B: 0,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/life/scene_pic_0217.png'),
    name: String.getLang('scene_name_0217'),
  },
  {
    sceneId: 6,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 60,
        S: 1000,
        V: 500,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 60,
        S: 1000,
        V: 350,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 30,
        S: 550,
        V: 650,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 45,
        S: 850,
        V: 600,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 45,
        S: 900,
        V: 550,
        B: 0,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/colour/scene_pic_0303.png'),
    name: String.getLang('scene_name_0303'),
  },
  {
    sceneId: 7,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 210,
        S: 1000,
        V: 820,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 210,
        S: 700,
        V: 950,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 210,
        S: 850,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 210,
        S: 1000,
        V: 550,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 1,
        H: 210,
        S: 350,
        V: 750,
        B: 0,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/colour/scene_pic_0306.png'),
    name: String.getLang('scene_name_0306'),
  },
  {
    sceneId: 8,
    value: [
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 355,
        S: 850,
        V: 960,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 8,
        S: 900,
        V: 1000,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 5,
        S: 450,
        V: 980,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 355,
        S: 800,
        V: 650,
        B: 0,
        T: 0,
      },
      {
        transitionInterval: 70,
        duration: 70,
        changeMode: 2,
        H: 18,
        S: 750,
        V: 950,
        B: 0,
        T: 0,
      },
    ],
    icon: require('@/static/images/scene/colour/scene_pic_0301.png'),
    name: String.getLang('scene_name_0301'),
  },
];

const Scene = () => {
  const support = useSupport();
  const structuredActions = useStructuredActions();
  const scene_mode = useStructuredProps(props => props.dreamlight_scene_mode);
  const aux_scene = useStructuredProps(props => props.aux_scene);
  const main_switch = useProps(props => props.main_switch);
  const aux_switch = useProps(props => props.aux_switch);

  const [tabIndex, setTabIndex] = useState(0);
  const [sceneId, setSceneId] = useState(0);
  const [edit, setEdit] = useState(false);
  const [powerIndex, setPowerIndex] = useState(0);
  const [powerList, setPowerList] = useState([
    {
      name: String.getLang('king_light'),
      hide: false,
    },
    {
      name: String.getLang('aux_light'),
      hide: false,
    },
  ]);
  const [auxSceneId, setAuxSceneId] = useState(1);

  const customScenes = useSelector(selectCustomScenes);

  useEffect(() => {
    let type: 'three' | 'four' | 'five' = 'three';
    if (support.isSupportBright() && support.isSupportTemp()) type = 'five';
    if (support.isSupportBright() && !support.isSupportTemp()) type = 'four';
    if (!support.isSupportBright() && !support.isSupportTemp()) type = 'three';
  }, []);

  useEffect(() => {
    if (sceneId >= 21 && sceneId <= 32) {
      // 心情
      setTabIndex(3);
    } else if (sceneId >= 33 && sceneId <= 53) {
      // 节日
      setTabIndex(2);
    } else if (sceneId >= 54 && sceneId <= 74) {
      // 生活
      setTabIndex(1);
    } else if (sceneId >= 75 && sceneId <= 96) {
      // 风景
      setTabIndex(0);
    } else if (sceneId >= 97 && sceneId <= 131) {
      // 颜色
      setTabIndex(4);
    }
  }, [sceneId]);

  useEffect(() => {
    setSceneId(scene_mode.id);
  }, [scene_mode]);

  useEffect(() => {
    setPowerList(prev => {
      return prev.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            hide: !main_switch,
          };
        }
        return {
          ...item,
          hide: !aux_switch,
        };
      });
    });
    if (!main_switch) {
      setPowerIndex(1);
    } else if (!aux_switch) {
      setPowerIndex(0);
    }
  }, [main_switch, aux_switch]);

  const list = useMemo(() => {
    return customScenes.filter(item => item.category === tabIndex);
  }, [tabIndex, customScenes]);

  useEffect(() => {
    if (!aux_scene) return;
    setAuxSceneId(aux_scene.sceneId);
  }, [aux_scene]);

  /**
   * 切换tab
   * @param code tab类型
   */
  const handleChangeTab = (index: number) => {
    if (tabIndex === index) return;
    setTabIndex(index);
  };

  /**
   * 处理点击编辑
   */
  const handleChangeEdit = () => {
    setEdit(!edit);
  };

  /**
   * 处理点击场景
   */
  const handleClickScene = (item: IDIYScene) => {
    if (edit) {
      const data: IqueryData = {
        type: 'custom',
        mode: 'edit',
        id: item.id,
      };
      router.push(`/CustomScene?data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      structuredActions.dreamlight_scene_mode.set(item.value);
    }
  };

  /**
   * 处理点击灯带类型的转变
   */
  const handleClickPowerChange = (index: number) => {
    if (index === powerIndex) return;
    if (powerList[index].hide) {
      return showToast({
        title: String.getLang('power_change_warnning'),
        icon: 'none',
      });
    }
    setPowerIndex(index);
  };

  return (
    <View className={styles.scene}>
      <View className={styles.scene_box}>
        {/* 灯光控制组件 */}
        <View className={styles.power}>
          {powerList.map((item, index) => (
            <View
              key={index}
              className={styles.power_item}
              onClick={() => {
                handleClickPowerChange(index);
              }}
              style={{
                borderRadius: '24rpx',
                background: powerIndex === index ? "linear-gradient(45deg, #0b2967, #184e68)" : "none",
                fontWeight: powerIndex === index ? 'bold' : 'normal'
              }}
            >
              {item.name}
              {powerIndex === index && (
                <Image src={require('@/static/images/home/ic_power_active.png')} />
              )}
            </View>
          ))}
        </View>
        {/* 主灯组件区域 */}
        {powerIndex === 0 && (
          <View>
            {/* tab */}
            <View className={styles.tab}>
              {tabList.map((item, index) => (
                <View
                  key={index}
                  className={clsx(styles.tab_item, tabIndex === index && styles.tab_active)}
                  onClick={() => {
                    handleChangeTab(index);
                  }}
                >
                  {item.name}
                </View>
              ))}
            </View>
            {/* <View className={styles.label}>
              <Text></Text>
              <View className={styles.edit}
                onClick={() => {
                  handleChangeEdit();
                }}>
                <Image src={edit ? require('@/static/images/common/ic_return.png') : require('@/static/images/common/ic_edit.png')}></Image>
                <Text>{edit ? String.getLang("cancel") : String.getLang("edit")}</Text>
              </View>
            </View> */}
            <View className={styles.scene_list}>
              {list.map((item, index) => (
                <View
                  key={item.name}
                  className={styles.scene_list_item}
                  onClick={() => {
                    handleClickScene(item);
                  }}
                >
                  <View
                    className={clsx(
                      styles.scene_list_item_box,
                      sceneId === item.id && styles.scene_list_item_active
                    )}
                  >
                    <Image src={item.pic} />
                  </View>
                  <Text
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                    }}
                  >
                    {/* @ts-ignore */}
                    {String.getLang(item.key)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {/* 星光灯组件区域 */}
        {powerIndex === 1 && (
          <View className={styles.scene_list}>
            {auxScenes.map((item, index) => (
              <View
                className={styles.scene_list_item}
                onClick={() => {
                  structuredActions.aux_scene.set(item);
                }}
                key={index}
              >
                <View
                  className={clsx(
                    styles.scene_list_item_box,
                    auxSceneId === item.sceneId && styles.scene_list_item_active
                  )}
                >
                  <Image src={item.icon} />
                </View>
                <Text
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                >
                  {/* @ts-ignore */}
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(Scene);
