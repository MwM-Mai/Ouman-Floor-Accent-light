import React, { memo, useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, Image, showToast, ScrollView, getSystemInfoSync, Input, router } from '@ray-js/ray';
import { useActions, useProps, useSupport, utils, useStructuredProps, useStructuredActions } from '@ray-js/panel-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { Popup } from "@ray-js/smart-ui";
import TYSlider from '@ray-js/components-ty-slider';
import clsx from 'clsx';
import _ from "lodash-es"

import styles from './index.module.less';
import { IProps, IqueryData } from "./type";
import { selectCustomScenes, selectDiyScenes, updateDiyScenes, updateCustomScenes } from '@/redux/modules/cloudStateSlice';
import { Navbar } from '@/components'
import config from "@/config/default"
import AddColor from '@/components/AddColor';
import { CLOUD_DATA_KEYS_MAP } from '@/constant';
import String from '@/i18n'
import { devices } from '@/devices';

const { sceneModes } = config;

// 跳变 呼吸 闪烁 飘落 追光 飘动 彩虹 闪现 穿梭 乱闪 - 变换速度模式 
// 渐变 - 段落(全段/分段) 模式 
// 流星 - 方向(顺时针/逆时针) + 变换方式(流星/流星雨/幻彩流星) + 变换速度模式 
// 堆积 - 方向(顺时针/逆时针) + 段落(全段/分段) + 换速度模式
// 流水 - 方向(顺时针/逆时针) + 变换速度模式
// 反弹 - 段落(全段/分段) + 变换方式(反弹/幻彩反弹) + 变换速度模式
// 开合 - 变换方式(同时/交错) + 变换速度模式

// 段落
const paragraphs = [String.getLang("segmented_0"), String.getLang("segmented_1")]
// 方向
const directions = [String.getLang("direction_0"), String.getLang("direction_1")]
// 变换方式
const meteors = [String.getLang("meteor_0"), String.getLang("meteor_1"), String.getLang("meteor_2")]
const rebounds = [String.getLang("rebound_0"), String.getLang("rebound_1")]
const transforms = [String.getLang("transform_0"), String.getLang("transform_1")]

const { hsv2rgb, brightKelvin2rgb } = utils;

const system = getSystemInfoSync();
const { statusBarHeight } = system;
const CustomScene = (props: IProps) => {
  const dispatch = useDispatch();
  const { location: { query: { data } } } = props;
  const structuredActions = useStructuredActions()
  const params: IqueryData = JSON.parse(decodeURIComponent(data));
  const diyScenes = useSelector(selectDiyScenes);
  const customScenes = useSelector(selectCustomScenes);
  // TODO 需要改成[0]
  const [sceneData, setSceneData] = useState<IDIYScene>(sceneModes[1]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddcolor, setShowAddcolor] = useState(false);
  const [colorType, setColorType] = useState(1); // 1: 添加 2: 编辑
  const [colorId, setColorId] = useState(-1); // 编辑的颜色id


  useEffect(() => {
    const type = params.type;
    const mode = params.mode;
    let scene = null;
    if (type === "diy") {
      scene = mode == "add" ? { ...sceneModes[1] } : { ...diyScenes.find(item => item.id === params.id) };
      scene.name = mode == "add" ? String.getLang("defautl_name") : scene.name;
    } else if (type === "custom") {
      scene = { ...customScenes.find(item => item.id === params.id) };
    } else {
      // TODO 需要改成[0]
      scene = _.cloneDeep(sceneModes[1]);
      scene.value.colors = params.colors ? params.colors : scene.value.colors;
      scene.name = String.getLang("defautl_name")
    }

    // TODO 需要改成[0]
    setSceneData(scene);
  }, [])

  const colors = useMemo(() => {
    console.log("=== sceneData", sceneData);
    if (sceneData === null || sceneData.value.colors.length === 0) return [];
    const brightness = sceneData.value.brightness;
    return sceneData.value.colors.map((item, index) => {
      const { hue, saturation } = item;
      if (hue <= 360) {
        const [r, g, b] = hsv2rgb(hue, saturation, brightness);
        return {
          id: index,
          color: `rgb(${r}, ${g}, ${b})`,
        }
      } else {
        const color = brightKelvin2rgb(brightness * 10, saturation * 10)
        return {
          id: index,
          color
        }
      }
    })
  }, [sceneData])

  /**
   * 处理点击删除颜色按钮
   */
  const handelRemoveColor = (id: number) => {
    setSceneData(prev => {
      const colors = prev.value.colors.filter((item, index) => index !== id);
      return {
        ...prev,
        value: {
          ...prev.value,
          colors,
        }
      }
    })
  }

  /**
   * 处理点击保存添加/修改颜色
   * @param data 
   */
  const handleSavceColor = (data: { hs: { h: number; s: number }; temp: number; pickerType?: "colour" | "white" }) => {
    data.hs.s = Math.round(data.hs.s / 10);
    data.temp = Math.round(data.temp / 10);
    if (colorType === 1) {
      setSceneData(prev => {
        return {
          ...prev,
          value: {
            ...prev.value,
            colors: [...prev.value.colors, {
              hue: data.pickerType === "colour" ? data.hs.h : 361,
              saturation: data.pickerType === "colour" ? data.hs.s : data.temp
            }]
          }
        }
      })
    } else if (colorType === 2) {
      setSceneData(prev => {
        const colors = prev.value.colors.map((item, index) => {
          if (index === colorId) {
            return {
              hue: data.pickerType === "colour" ? data.hs.h : 361,
              saturation: data.pickerType === "colour" ? data.hs.s : data.temp
            }
          }
          return item;
        })
        return {
          ...prev,
          value: {
            ...prev.value,
            colors,
          }
        }
      })
    }
  }

  /**
   * 处理点击预览
   */
  const handlePreviewScene = () => {
    structuredActions.dreamlight_scene_mode.set({ ...sceneData.value, id: params.id })
  }

  /**
   * 处理点击保存场景
   */
  const handleSaveScene = async () => {
    const { type, mode } = params;
    let data = _.cloneDeep(sceneData);
    data.key = sceneData.value.mode + '';
    data.id = params.id;
    data.value.id = params.id;
    if (data.value.colors.length === 0) {
      return showToast({
        title: String.getLang("diy_min_color_tips"),
        icon: "none",
        duration: 2000
      });
    }
    if ((data.name.length <= 0 || data.name.length > 10) && type !== "custom") {
      return showToast({
        title: String.getLang("diy_name_length_tips"),
        icon: "none",
        duration: 2000
      });
    }
    if (type === "custom") {
      data.value.colors = data.value.colors.map(color => {
        return {
          hue: color.hue,
          saturation: color.saturation
        }
      })
      const newScnens = _.cloneDeep(customScenes.map(item => {
        if (item.id === params.id) {
          const scene = {
            ...data,
            key: item.key,
            id: item.id,
            name: item.name,
            pic: item.pic,
            category: item.category,
          }
          data = scene
          return scene
        }
        return item;
      }))
      devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.customScenes + "_" + params.id, data).then(() => {
        dispatch(updateCustomScenes(newScnens))
        showToast({
          title: String.getLang('save_success'),
          icon: 'success',
        })
        router.back();
      })
    } else {
      devices.lamp.model.abilities.storage.set(CLOUD_DATA_KEYS_MAP.diyScenes + "_" + params.id, data).then(() => {
        if (mode !== "add") {
          const key = diyScenes.findIndex(item => item.value.id === params.id);
          dispatch(updateDiyScenes(diyScenes.map((item, index) => {
            if (index === key) {
              item = data;
            }
            return item;
          })))
        } else {
          dispatch(updateDiyScenes([...diyScenes, data]))
        }
        showToast({
          title: String.getLang('save_success'),
          icon: 'success',
        })
        router.back();
      })
    }
  }

  /**
   * 渲染弹窗
   */
  const render = useCallback(() => {
    const brightness = sceneData.value.brightness;
    const colorsMap = sceneData.value.colors.map((item) => {
      return { hue: item.hue, saturation: item.saturation * 10, value: brightness }
    });
    return (
      <AddColor
        showPopup={showAddcolor}
        type={colorType}
        mode={"all"}
        id={colorId}
        colours={colorsMap}
        closePopup={() => {
          setShowAddcolor(false);
        }}
        savaCallBack={async (data) => {
          await handleSavceColor(data);
          setShowAddcolor(false);
        }}
      />
    )
  }, [showAddcolor, colorType, colorId, sceneData])

  return (
    <View className={styles.custom_scene}>
      <Navbar leftRender={() => (
        <Text>{String.getLang("cancel")}</Text>
      )}
        title={String.getLang("nav_name")} />

      <ScrollView scrollY={true} style={{
        width: '100%',
        height: `calc(100vh - 200rpx - ${statusBarHeight || 0}px - 44px)`,
      }}>
        <View className={styles.content}>
          {/* 名称区域组件 */}
          {params.type !== "custom" && <View className={styles.custom_name}>
            <View className={styles.label}>
              <Text>{String.getLang("name")}</Text>
            </View>
            <View className={styles.input}>
              <Input
                placeholder={String.getLang("diy_name_placeholder")}
                // @ts-ignore
                placeholderStyle={{ color: "rgba(255, 255, 255, .65)" }}
                value={sceneData.name}
                onInput={(e) => {
                  setSceneData(prev => {
                    return {
                      ...prev,
                      name: e.detail.value
                    }
                  })
                }}
              />
            </View>
          </View>}

          <View className={styles.content_box}>
            <View className={styles.label}>
              {String.getLang("ae")}
            </View>
            <View className={styles.selector}
              onClick={() => {
                setShowPopup(true);
              }}>
              {sceneModes[sceneData.value.mode].name}
              <Image src={require(`@/static/images/diy/ic_right.png`)} />
            </View>

            {/* 段落组件 */}
            {[1, 6, 13].some(item => item === sceneData.value.mode) && <View className={styles.mode}>
              <View className={styles.label}>
                {String.getLang("paragraph")}
              </View>
              <View className={styles.paragraph}>
                {paragraphs.map((item, index) => (
                  <View key={item} className={clsx(styles.paragraph_item, index === sceneData.value.segmented && styles.paragraph_item_active)}
                    onClick={() => {
                      setSceneData(prev => {
                        return {
                          ...prev,
                          value: {
                            ...prev.value,
                            segmented: index,
                          }
                        }
                      })
                    }}>
                    {item}
                  </View>
                ))}
              </View>
            </View>}

            {/* 变换方式组件 */}
            {[16].some(item => item === sceneData.value.mode) && <View className={styles.mode}>
              <View className={styles.label}>
                {String.getLang("change_type")}
              </View>
              <View className={styles.paragraph}>
                {transforms.map((item, index) => (
                  <View key={item} className={clsx(styles.paragraph_item, index === sceneData.value.expand && styles.paragraph_item_active)}
                    onClick={() => {
                      setSceneData(prev => {
                        return {
                          ...prev,
                          value: {
                            ...prev.value,
                            expand: index,
                          }
                        }
                      })
                    }}>
                    {item}
                  </View>
                ))}
              </View>
            </View>}

            {/* 方向组件 */}
            {[5, 6, 10].some(item => item === sceneData.value.mode) && <View className={styles.mode}>
              <View className={styles.label}>
                {String.getLang("direction")}
              </View>
              <View className={styles.paragraph}>
                {directions.map((item, index) => (
                  <View key={item} className={clsx(styles.paragraph_item, index === sceneData.value.direction && styles.paragraph_item_active)}
                    onClick={() => {
                      setSceneData(prev => {
                        return {
                          ...prev,
                          value: {
                            ...prev.value,
                            direction: index,
                          }
                        }
                      })
                    }}
                  >
                    {item}
                  </View>
                ))}
              </View>
            </View>}

            {/* 变换方式组件 */}
            {[5].some(item => item === sceneData.value.mode) && <View className={styles.mode}>
              <View className={styles.label}>
                {String.getLang("change_type")}
              </View>
              <View className={styles.paragraph}>
                {meteors.map((item, index) => (
                  <View key={item} className={clsx(styles.paragraph_item, index === sceneData.value.expand && styles.paragraph_item_active)}
                    onClick={() => {
                      setSceneData(prev => {
                        return {
                          ...prev,
                          value: {
                            ...prev.value,
                            expand: index,
                          }
                        }
                      })
                    }}
                  >
                    {item}
                  </View>
                ))}
              </View>
            </View>}

            {/* 变换方式组件 */}
            {[13].some(item => item === sceneData.value.mode) && <View className={styles.mode}>
              <View className={styles.label}>
                {String.getLang("change_type")}
              </View>
              <View className={styles.paragraph}>
                {rebounds.map((item, index) => (
                  <View key={item} className={clsx(styles.paragraph_item, index === sceneData.value.expand && styles.paragraph_item_active)}
                    onClick={() => {
                      setSceneData(prev => {
                        return {
                          ...prev,
                          value: {
                            ...prev.value,
                            expand: index,
                          }
                        }
                      })
                    }}
                  >
                    {item}
                  </View>
                ))}
              </View>
            </View>}

            {/* 变换速度组件 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].some(item => item === sceneData.value.mode) && <View className={styles.mode}>
              <View className={styles.label}>
                <Text>{String.getLang("change_step")}</Text>
                <Text style={{ marginLeft: "16rpx" }}>{sceneData.value.speed}%</Text>
              </View>
              <TYSlider
                maxTrackWidth="656rpx"
                maxTrackHeight="16rpx"
                maxTrackRadius="7rpx"
                minTrackWidth="656rpx"
                minTrackHeight="16rpx"
                thumbWidth="18px"
                thumbHeight="18px"
                maxTrackColor="#45424A"
                style={{ marginTop: '38rpx' }}
                min={1}
                max={100}
                step={1}
                value={sceneData.value.speed}
                onAfterChange={(value: number) => {
                  setSceneData(prev => {
                    return {
                      ...prev,
                      value: {
                        ...prev.value,
                        speed: value,
                      }
                    }
                  })
                }}
              />
            </View>}

            <View className={styles.mode}>
              <View className={styles.label}>
                <Text>{String.getLang("brightness")}</Text>
                <Text style={{ marginLeft: "16rpx" }}>{sceneData.value.brightness}%</Text>
              </View>
              <TYSlider
                maxTrackWidth="656rpx"
                maxTrackHeight="16rpx"
                maxTrackRadius="7rpx"
                minTrackWidth="656rpx"
                minTrackHeight="16rpx"
                thumbWidth="18px"
                thumbHeight="18px"
                maxTrackColor="#45424A"
                style={{ marginTop: '38rpx' }}
                min={1}
                max={100}
                step={1}
                value={sceneData.value.brightness}
                onAfterChange={(value: number) => {
                  setSceneData(prev => {
                    return {
                      ...prev,
                      value: {
                        ...prev.value,
                        brightness: value,
                      }
                    }
                  })
                }}
              />
            </View>
          </View>

          <View className={styles.my_color}>
            <View className={styles.label}>
              <Text>{String.getLang("color")}</Text>
            </View>
            {colors.length > 0 ?
              <View className={styles.collect_list}>
                {
                  colors.map((item, index) => (
                    <View key={index} className={clsx(styles.color_item)} onClick={() => {
                      setColorId(index)
                      setColorType(2)
                      setShowAddcolor(true)
                    }}>
                      <View className={clsx(styles.color_box)}
                        style={{
                          backgroundColor: item.color
                        }}
                        hoverClassName={styles.color_box_hover}
                      >
                      </View>
                      <View className={styles.delete_btn} onClick={(e) => {
                        e.origin.stopPropagation();
                        handelRemoveColor(index);
                      }} >
                        <Image src={require('@/static/images/common/ic_remove.png')}></Image>
                      </View>
                    </View>))
                }
              </View>
              :
              <View className={styles.no_color}>
                <Image src={require('@/static/images/common/ic_no_color.png')} />
              </View>
            }
            <View className={styles.add_color} onClick={() => {
              if (colors.length >= 8) {
                return showToast({
                  title: String.getLang("diy_man_color_tips"),
                  icon: 'none',
                  duration: 2000
                });
              };
              setColorType(1);
              setShowAddcolor(true)
            }}>
              + {String.getLang("add_color")}
            </View>
          </View>
        </View>
      </ScrollView>


      {/* 保存按钮*/}
      <View className={styles.footer}>
        <View className={styles.preview} hoverClassName={styles.preview_hover} onClick={() => { handlePreviewScene() }}>{String.getLang("preview")}</View>
        <View className={styles.save} onClick={() => { handleSaveScene() }}>{String.getLang("save")}</View>
      </View>

      {render()}

      {/* 动效选择弹窗 */}
      <Popup show={showPopup} position="bottom"
        customStyle={{
          width: "100%",
          boxSizing: "border-box",
          padding: "0 20rpx",
          backgroundColor: "transparent",
          margin: "0"
        }}>
        <View className={styles.popup_box}>
          <View className={styles.popup_tital}>
            {String.getLang("ae")}
          </View>
          <View className={styles.popup_container}>
            {sceneModes.map((item, index) => (
              <View key={item.key} className={clsx(styles.popup_item, sceneData.value.mode === index && styles.popup_item_active)}
                onClick={() => {
                  setSceneData(prev => {
                    return { ...prev, value: { ...sceneData.value, mode: index } }
                  })
                  setShowPopup(false);
                }}>
                {item.name}
              </View>
            ))}
          </View>
        </View>
        <View className={styles.popup_btn} onClick={() => {
          setShowPopup(false);
        }}>{String.getLang("cancel")}</View>
      </Popup>
    </View>
  )
}

export default memo(CustomScene);
