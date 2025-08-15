import { GlobalConfig } from '@ray-js/types';

export const tuya = {
  window: {
    backgroundColor: 'black',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: 'white',
    navigationBarTextStyle: 'black',
  },
  functionalPages: {
    // 设备详情功能页，若未自定义实现设备详情界面，该项为必填配置，不可删除。
    settings: {
      appid: 'tycryc71qaug8at6yt',
      entryCode: 'entrye0n05idydmmfv',
    },
    // 定时倒计时功能页
    rayScheduleFunctional: {
      appid: 'tyjks565yccrej3xvo',
    },
    // 生物节律功能页
    rayRhythmFunctional: {
      appid: 'ty53odnmk2cxnzcxm6',
    },
    // 酷玩吧功能页，包含情景库、律动库和影像库
    rayPlayCoolFunctional: {
      appid: 'tyg0szxsm3vog8nf6n',
      version: '1.3.0',
    },
    // 停电勿扰功能页
    LampNoDisturbFunctional: {
      appid: 'typsxgb7vfl1unmkbt',
      version: '0.1.5',
    },
    // 断电记忆功能页
    LampPowerMemoryFunctional: {
      // tyabzhlpuchrkh7pe8 为功能页的 id
      appid: 'tyabzhlpuchrkh7pe8',
      version: '1.1.0',
    },
    // 灯光渐变
    LampMutationFunctional: {
      appid: 'tytj0ivsldjndnlnld',
      version: '1.0.6',
    },
  },
};

const globalConfig: GlobalConfig = {
  basename: '',
};

export default globalConfig;
