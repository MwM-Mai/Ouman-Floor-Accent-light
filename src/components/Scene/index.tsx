import React, { memo, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { View, Image, Text, router, showToast } from '@ray-js/ray'
import { useSupport, useStructuredActions, useStructuredProps, useProps } from '@ray-js/panel-sdk'
import clsx from 'clsx';

import styles from './index.module.less';
import { IqueryData } from '@/pages/CustomScene/type'
import { selectCustomScenes } from '@/redux/modules/cloudStateSlice';
import String from '@/i18n'
import { IAuxScene } from '@/devices/protocols/parsers/AuxSceneFormatter';


const tabList = [
  {
    name: String.getLang("scene_tab_name_0"),
  },
  {
    name: String.getLang("scene_tab_name_1"),
  },
  {
    name: String.getLang("scene_tab_name_2"),
  },
  {
    name: String.getLang("scene_tab_name_3"),
  }
]

const auxScenes: IAuxScene[] = [
  {
    sceneId: 1,
    transitionInterval: 100,
    duration: 100,
    changeMode: 1,
    H: 1000,
    S: 1000,
    V: 1000,
    B: 1000,
    T: 1000,
    icon: require('@/static/images/scene/aux_light/aux_scene_0.png'),
    name: String.getLang(`scene_mode_0`)
  },
  {
    sceneId: 2,
    transitionInterval: 100,
    duration: 100,
    changeMode: 2,
    H: 1000,
    S: 1000,
    V: 1000,
    B: 1000,
    T: 1000,
    icon: require('@/static/images/scene/aux_light/aux_scene_1.png'),
    name: String.getLang(`scene_mode_1`)
  },
  {
    sceneId: 3,
    transitionInterval: 100,
    duration: 100,
    changeMode: 3,
    H: 1000,
    S: 1000,
    V: 1000,
    B: 1000,
    T: 1000,
    icon: require('@/static/images/scene/aux_light/aux_scene_2.png'),
    name: String.getLang(`scene_mode_2`)
  },
  {
    sceneId: 3,
    transitionInterval: 100,
    duration: 100,
    changeMode: 3,
    H: 1000,
    S: 1000,
    V: 1000,
    B: 1000,
    T: 1000,
    icon: require('@/static/images/scene/aux_light/aux_scene_3.png'),
    name: String.getLang(`aux_scene_name_01`)
  },
]


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
      name: String.getLang("king_light"),
      hide: false,
    },
    {
      name: String.getLang("aux_light"),
      hide: false,
    }
  ]);
  const [auxSceneId, setAuxSceneId] = useState(1);

  const customScenes = useSelector(selectCustomScenes);

  useEffect(() => {
    let type: 'three' | 'four' | 'five' = 'three';
    if (support.isSupportBright() && support.isSupportTemp()) type = 'five';
    if (support.isSupportBright() && !support.isSupportTemp()) type = 'four';
    if (!support.isSupportBright() && !support.isSupportTemp()) type = 'three';
  }, [])

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
    setSceneId(scene_mode.id)
  }, [scene_mode])

  useEffect(() => {
    setPowerList(prev => {
      return prev.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            hide: !main_switch
          }
        }
        return {
          ...item,
          hide: !aux_switch
        }
      })
    })
    if (!main_switch) {
      setPowerIndex(1);
    } else if (!aux_switch) {
      setPowerIndex(0);
    }
  }, [main_switch, aux_switch])

  const list = useMemo(() => {
    return customScenes.filter(item => item.category === tabIndex)
  }, [tabIndex, customScenes]);

  useEffect(() => {
    if (!aux_scene) return
    setAuxSceneId(aux_scene.sceneId)
  }, [aux_scene])

  /**
 * 切换tab
 * @param code tab类型
 */
  const handleChangeTab = (index: number) => {
    if (tabIndex === index) return;
    setTabIndex(index);
  }

  /**
 * 处理点击编辑
 */
  const handleChangeEdit = () => {
    setEdit(!edit);
  }

  /**
   * 处理点击场景
   */
  const handleClickScene = (item: IDIYScene) => {
    if (edit) {
      const data: IqueryData = {
        type: "custom",
        mode: "edit",
        id: item.id,
      }
      router.push(`/CustomScene?data=${encodeURIComponent(JSON.stringify(data))}`)
      return;
    } else {
      structuredActions.dreamlight_scene_mode.set(item.value);
    }
  }

  /**
   * 处理点击灯带类型的转变
   */
  const handleClickPowerChange = (index: number) => {
    if (index === powerIndex) return;
    if (powerList[index].hide) {
      return showToast({
        title: String.getLang("power_change_warnning"),
        icon: 'none',
      })
    }
    setPowerIndex(index);
  }

  return (
    <View className={styles.scene}>
      <View className={styles.scene_box}>
        {/* 灯光控制组件 */}
        <View className={styles.power}>
          {powerList.map((item, index) => (
            <View key={index} className={styles.power_item} onClick={() => {
              handleClickPowerChange(index)
            }}>
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
                <View key={index} className={clsx(styles.tab_item, tabIndex === index && styles.tab_active)}
                  onClick={() => {
                    handleChangeTab(index);
                  }}>
                  {item.name}
                </View>
              ))
              }
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
                <View key={item.name} className={styles.scene_list_item}
                  onClick={() => {
                    handleClickScene(item);
                  }}>
                  <View className={clsx(styles.scene_list_item_box, sceneId === item.id && styles.scene_list_item_active)}>
                    <Image src={item.pic} />
                  </View>
                  <Text style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
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
              <View className={styles.scene_list_item}
                onClick={() => {
                  structuredActions.aux_scene.set(item)
                }} key={index}>
                <View className={clsx(styles.scene_list_item_box, auxSceneId === item.sceneId && styles.scene_list_item_active)}>
                  <Image src={item.icon} />
                </View>
                <Text style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
                  {/* @ts-ignore */}
                  {String.getLang(`scene_mode_${item.sceneId}`)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View >
  )
}

export default memo(Scene);

