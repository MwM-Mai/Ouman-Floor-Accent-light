import { SmartStorageAbility } from '@ray-js/panel-sdk';

type TReturnRes = {
  data: { value: any, type: string },
  time: number,
} | null;

class Storage {
  private storage: SmartStorageAbility;

  constructor() {
    this.storage = new SmartStorageAbility();
    this.init();
  }

  async init() {
    await this.storage.init();
  }

  get(key: string) {
    return new Promise<any>(async (resolve, reject) => {
      this.storage.get(key).then((res: TReturnRes) => {
        if (res) {
          resolve(res.data.value);
        } else {
          resolve(null);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  getAll() {
    return new Promise<{ [key: string]: TReturnRes }>((resolve, reject) => {
      this.storage.getAll((localDatas: { [key: string]: TReturnRes }) => {
        resolve(localDatas);
      }).then((res: { [key: string]: TReturnRes }) => {
        Object.keys(res).forEach(key => {
          if (res[key] === null || res[key] === undefined) {
            delete res[key];
          }
        });
        resolve(res);
      });
    });
  }

  set(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.storage.set(key, value).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }

  remove(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.remove(key).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export default new Storage();
