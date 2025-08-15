import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, Text, Image } from "@ray-js/ray";
import { useSupport } from '@ray-js/panel-sdk';
import { LampCirclePickerColor, LampCirclePickerWhite } from '@ray-js/components-ty-lamp';
import { useDispatch, useSelector } from 'react-redux';
import { Popup } from "@ray-js/smart-ui";
import { LampCirclePicker } from '@ray-js/components-ty-lamp';

import { Navbar } from '@/components';
import { IProps } from "./type"
import styles from './index.module.less'
import { IHS } from '@/components/Dimmer/type'
import { selectCollectColours, selectCollectWhites } from '@/redux/modules/cloudStateSlice'
import String from '@/i18n';



const AddColour = (props: IProps) => {
  const { showPopup, closePopup, type, id, mode } = props

  const support = useSupport()

  const whites = useSelector(selectCollectWhites);
  const collectColours = useSelector(selectCollectColours);

  const [hs, setHs] = useState({
    h: 0,
    s: 1000,
  });
  const [temp, setTemp] = useState(0);
  const [showColor, setShowColor] = useState(false);
  const [pickerType, setPickerType] = useState<"colour" | "white">("colour"); // colour white
  const [way, setWay] = useState(0); // 0: 3路 1: 4路 2: 5路

  useEffect(() => {
    if (support.isSupportBright() && support.isSupportTemp()) setWay(2);
    if (support.isSupportBright() && !support.isSupportTemp()) setWay(1);
    if (!support.isSupportBright() && !support.isSupportTemp()) setWay(0);
  }, []);

  useEffect(() => {
    if (!showPopup) return;
    if (type === 2) {
      if (mode === 'colour') {
        const hsv = collectColours[id];
        setHs({
          h: hsv.hue,
          s: hsv.saturation,
        })
      } else if (mode === 'white') {
        const tempOrbrigh = whites[id];
        setTemp(tempOrbrigh.temperature);
      }
    }
  }, [type, id, mode, showPopup])


  /**
   * 处理按颜色触摸结束的事件
   * @param hs hs
   */
  const handleTouchEndByColour = async (hs: IHS) => {
    setHs(hs);
  }

  /**
   * 处理按白色触摸结束的事件
   * @param temp temp
   */
  const handleTouchEndByWhite = async (temp: number) => {
    setTemp(temp);
  }

  /**
   * 处理点击保存
   */
  const handleSave = async () => {
    props.savaCallBack({
      hs,
      temp: way === 1 ? 0 : temp,
      pickerType
    })
  }

  const randerPicker = useMemo(() => {
    if (props.mode === 'colour') {
      return <LampCirclePickerColor
        hs={hs}
        thumbRadius={15}
        radius={150}
        whiteRange={0.15}
        onTouchEnd={handleTouchEndByColour}
      />
    } else if (props.mode === 'white') {
      return <LampCirclePickerWhite
        thumbRadius={15}
        temperature={temp}
        radius={130}
        onTouchEnd={handleTouchEndByWhite}
        canvasId="white_picker_1"
      />
    } else {
      if (way === 0) {
        return <LampCirclePickerColor
          hs={hs}
          thumbRadius={15}
          radius={150}
          whiteRange={0.15}
          onTouchEnd={handleTouchEndByColour}
        />
      } else if (way === 1) {
        return pickerType === "colour" ? (
          <LampCirclePickerColor
            hs={hs}
            thumbRadius={15}
            radius={150}
            whiteRange={0.15}
            onTouchEnd={handleTouchEndByColour}
          />
        ) : (
          <View style={{
            margin: "60rpx",
            width: '520rpx',
            height: '520rpx',
            borderRadius: "50%",
            background: '#FFCC62',
            boxSizing: "border-box"
          }} />
        )
      } else {
        return pickerType === "colour" ? (
          <LampCirclePickerColor
            hs={hs}
            thumbRadius={15}
            radius={150}
            whiteRange={0.15}
            onTouchEnd={handleTouchEndByColour}
          />
        ) : (
          <LampCirclePickerWhite
            thumbRadius={15}
            temperature={temp}
            radius={150}
            onTouchEnd={handleTouchEndByWhite}
            canvasId="white_picker_1"
          />
        )
      }
    }
  }, [props.mode, pickerType, hs])

  return (
    <Popup
      show={showPopup}
      position="bottom"
      customStyle={{
        margin: "0",
        width: "100%",
        height: "100vh",
        background: "var(--theme-background-color)"
      }}
      onAfterEnter={() => {
        setShowColor(true);
      }}
      onAfterLeave={() => {
        setShowColor(false);
      }}
    >
      <View className={styles.add_color}>
        {/* Navbar */}
        <Navbar leftRender={() => (
          <View onClick={(e) => {
            e.origin.stopPropagation();
            closePopup()
          }}>
            <Text>{String.getLang("cancel")}</Text>
          </View>
        )}
          title={String.getLang("add_color")} />
        <View className={styles.content}>
          {showColor && randerPicker}
        </View>

        {way !== 0 && <Image className={styles.change_image} src={require('@/static/images/home/ic_convert.png')}
          onClick={() => {
            setPickerType(pickerType === "colour" ? "white" : "colour")
          }}
        />}

        {/* 保存按钮 */}
        <View className={styles.footer}>
          <View className={styles.save} onClick={handleSave}>{String.getLang("save")}</View>
        </View>
      </View>
    </Popup>
  );
};

export default AddColour;