export interface IProps {
  location: {
    query: {
      data: JsonString<IqueryData>;
    };
  }
}

type JsonString<T> = string & { __brand: "JsonString" }; // 用 __brand 标记类型

export interface IqueryData {
  type: "diy" | "custom" | "ai"; // 类型 自定义: DIY 自定义情景: custom
  mode: "edit" | "add"; // 模式 编辑: edit 添加: add
  id?: number;
  colors?: SceneColorType[];
}