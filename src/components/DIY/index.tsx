import React, { memo, useEffect, useState } from 'react'
import { View, Image, Text, showToast, authorize, router } from '@ray-js/ray';
import clsx from 'clsx';
import {
  imageColorPicking,
  ImageColorPicker,
  chooseCropImageSync,
} from '@ray-js/image-color-picking';
import { useDispatch, useSelector } from 'react-redux';
import { useActions, useProps, useSupport, utils, useStructuredProps, useStructuredActions } from '@ray-js/panel-sdk';


import styles from './index.module.less'
import { IqueryData } from "@/pages/CustomScene/type"
import { selectDiyScenes, updateDiyScenes } from '@/redux/modules/cloudStateSlice';
import { CLOUD_DATA_KEYS_MAP } from '@/constant';
import { extractRGB } from "@/utils/extractRGB"
import String from '@/i18n'
import { devices } from '@/devices';

const { hsv2rgb, rgb2hsv } = utils;

const DIY_IDS = [201, 202, 203, 204, 205, 206, 207, 208, 209, 210]

const DIY = () => {
  const dispatch = useDispatch();
  const structuredActions = useStructuredActions();
  const sceneMode = useStructuredProps(props => props.dreamlight_scene_mode);

  const diyScenes = useSelector(selectDiyScenes);

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    authorize({
      scope: 'scope.camera',
      success: () => {
        console.log('authorizeStatus success');
      },
      fail: (err) => {
        console.log('authorizeStatus fail', err);
      }
    });
    authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        console.log('authorizeStatus success');
      },
      fail: (err) => {
        console.log('authorizeStatus fail', err);
      }
    });
  }, [])

  /**
   * 处理点击编辑
   */
  const handleChangeEdit = () => {
    setEdit(!edit);
  }

  /**
   * rgb转hsv
   */
  const hsvToRGB = (hue, saturation, brightness) => {
    const [r, g, b] = hsv2rgb(hue, saturation, brightness);
    return `rgb(${r}, ${g}, ${b})`
  }


  /**
   * 处理点击AI视图
   */
  const handleAIRecognition = async () => {
    try {
      if (diyScenes.length >= 10) {
        return showToast({
          title: String.getLang('diy_scene_max_tips'),
          icon: 'none'
        })
      }
      // 调用app能力选择本地手机图片路径
      const path: string = await chooseCropImageSync();
      // 获取主要颜色
      const rgbList = await imageColorPicking({
        path,
        pickNum: 4,
      });
      const colors = rgbList.map((color) => {
        const { r, g, b } = extractRGB(color);
        const [h, s, v] = utils.rgb2hsv(r, g, b);
        return {
          hue: Math.round(h),
          saturation: Math.round(s),
        }
      });
      const idsSet = new Set(diyScenes.map(scene => scene.id));
      const id = DIY_IDS.find(id => {
        return !idsSet.has(id);
      });
      const encode = encodeURIComponent(JSON.stringify({
        mode: 'add',
        type: 'ai',
        id,
        colors
      }))
      router.push(`/CustomScene?data=${encode}`)
    } catch (error) {
      showToast({
        title: error.errorMsg,
      })
    }
  }

  /**
   * 处理点击修改diy情景
   * @param item 
   */
  const handleEditScene = (item) => {
    const data: IqueryData = {
      mode: 'edit',
      type: 'diy',
      id: item.id
    }
    const encode = encodeURIComponent(JSON.stringify(data))
    router.push(`/CustomScene?data=${encode}`)
  }

  /**
   * 处理点击删除diy场景
   * @param item 
   */
  const handleDelScene = async (item) => {
    const newDiyScenes = diyScenes.filter(scene => scene.id !== item.id);
    devices.lamp.model.abilities.storage.remove(CLOUD_DATA_KEYS_MAP.diyScenes + "_" + item.id).then(() => {
      dispatch(updateDiyScenes(newDiyScenes));
      showToast({
        title: String.getLang('remove_success'),
        icon: 'success',
      })
    }).catch(error => {
      showToast({
        title: String.getLang('remove_fail'),
        icon: 'error',
      })
    })
  }

  /**
   * 处理点击添加diy情景
   */
  const handleAddScene = () => {
    if (diyScenes.length >= 10) {
      return showToast({
        title: String.getLang('diy_scene_max_tips'),
        icon: 'none'

      })
    }
    const idsSet = new Set(diyScenes.map(scene => scene.id));
    const id = DIY_IDS.find(id => {
      return !idsSet.has(id);
    });
    const data: IqueryData = {
      mode: 'add',
      type: 'diy',
      id
    }
    const encode = encodeURIComponent(JSON.stringify(data))
    router.push(`/CustomScene?data=${encode}`)
  }


  return (
    <View className={styles.diy}>
      <ImageColorPicker id="image-color-picking" /> {/* 识别图片canvas 组件 */}
      <View className={styles.diy_box}>
        {/* AI识图 */}
        <View className={styles.ai_box}
          onClick={() => { handleAIRecognition() }}>
          <Image src={require('@/static/images/diy/ic_recognition.png')} />
          {String.getLang('identify')}
        </View>
        <View className={styles.label}>
          <Image src={require('@/static/images/diy/ic_brightness.png')}></Image>
          <Text>{String.getLang('diy_scene')}</Text>
          <View className={styles.edit}
            onClick={() => {
              handleChangeEdit();
            }}>
            <Image src={edit ? require('@/static/images/common/ic_return.png') : require('@/static/images/common/ic_edit.png')}></Image>
            <Text>{edit ? String.getLang("cancel") : String.getLang("edit")}</Text>
          </View>
        </View>
        {/* diy场景组件 */}
        <View className={styles.scene_box}>
          {diyScenes.length > 0 && diyScenes.map(item =>
            <View key={item.id} className={styles.scene_list_item}
              onClick={() => {
                structuredActions.dreamlight_scene_mode.set(item.value)
              }}>
              <View className={clsx(styles.scene_item, sceneMode.id === item.id && styles.scene_item_active)}>
                <View className={styles.colours}>
                  {item.value.colors.map((color, index) => <View key={index} className={styles.colours_item}
                    style={{ backgroundColor: hsvToRGB(color.hue, color.saturation, item.value.brightness) }} />)}
                </View>
                <View className={styles.name}>
                  {edit && <>
                    <View className={styles.scene_edit}
                      onClick={(e) => {
                        e.origin.stopPropagation();
                        handleEditScene(item)
                      }}
                    >
                      {String.getLang('edit')}
                    </View>
                    <View className={styles.scene_del}
                      onClick={() => {
                        handleDelScene(item)
                      }}
                    >
                      {String.getLang('remove')}
                    </View>
                  </>}
                  {!edit && <Text>{item.name}</Text>}
                </View>
              </View>
            </View>)}
        </View>
        {/* 添加diy场景 */}
        <View className={styles.add_diy} onClick={() => {
          handleAddScene();
        }}>
          <Text style={{ marginRight: '8rpx' }}>+</Text>
          {String.getLang('add_scene')}
        </View>
      </View>
    </View>
  )
}

export default memo(DIY);
