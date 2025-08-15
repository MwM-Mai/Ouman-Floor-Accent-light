import React, { memo } from 'react';
import { View, Image, getSystemInfoSync, navigateBack } from '@ray-js/ray';

import styles from './index.module.less';
import { useSelector } from 'react-redux';

interface IProps {
  title?: string;
  leftRender?: (() => React.ReactNode);
}

const systemInfo = getSystemInfoSync();
const Navbar = (props: IProps) => {

  const handleReturn = () => {
    if (!props.leftRender) return;
    navigateBack();
  };

  return (
    <View
      className={styles.nabbar}
      style={{
        height: `${systemInfo.statusBarHeight + 44 + 'px'}`,
        paddingTop: systemInfo.statusBarHeight + 'px',
      }}
    >
      <View
        className={styles.left}
        onClick={() => {
          handleReturn();
        }}
      >
        {props.leftRender && (
          props.leftRender()
        )}
      </View>
      <View className={styles.conter}>{props.title}</View>
      <View className={styles.right}></View>
    </View>
  );
};

export default memo(Navbar);
