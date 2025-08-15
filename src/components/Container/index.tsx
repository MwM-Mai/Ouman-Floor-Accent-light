import React, { useMemo, memo } from 'react';
import { View, Image } from '@ray-js/ray';
import { useProps } from '@ray-js/panel-sdk';
import { useSelector } from 'react-redux';

import { selectModeIndex } from "@/redux/modules/uiStateSlice"
import Dimmer from '../Dimmer';
import Music from '../Music';
import Scene from '../Scene';
import DIY from '../DIY';
import styles from './index.module.less';
const Container = () => {
  const mode = useProps(props => props.work_mode);

  const modeIndex = useSelector(selectModeIndex);

  const render = useMemo(() => {
    switch (modeIndex) {
      case 0:
        return <Dimmer />;
      case 1:
        return <Scene />;
      case 2:
        return <Music />;
      case 3:
        return <DIY />;
    }

  }, [modeIndex]);

  return (
    <View className={styles.container}>
      {render}
    </View>
  );
};

export default memo(Container);
