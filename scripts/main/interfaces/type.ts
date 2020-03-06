/**
 * 组件中的类型定义对象
 *
 * @export
 * @interface NcType
 */
export interface NcType {
  /**
   * 属性名
   *
   * @type {string}
   * @memberof NcType
   */
  name?: string;
  /**
   * 名称
   *
   * @type {string}
   * @memberof NcType
   */
  label?: string;
  /**
   * 描述
   *
   * @type {string}
   * @memberof NcType
   */
  description?: string;
  /**
   * 对象类型
   *
   * @type {NcObjectType}
   * @memberof NcType
   */
  object?: NcObjectType;
  /**
   * 继承对象
   *
   * @type {string}
   * @memberof NcType
   */
  extends?: string;
  /**
   * 属性
   *
   * @type {Property[]}
   * @memberof NcType
   */
  properties?: NcProperty[];
  /**
   * 值 object等于Type
   *
   * @type {string}
   * @memberof NcType
   */
  value?: string;
  /**
   * 组件名/指令名
   *
   * @type {string}
   * @memberof NcType
   */
  selector?: string;
  /**
   * 装饰器
   *
   * @type {string}
   * @memberof NcType
   */
  decorator?: string;
}

export interface NcProperty {
  /**
   * 属性名
   *
   * @type {string}
   * @memberof Property
   */
  name?: string;
  /**
   * 名称
   *
   * @type {string}
   * @memberof Property
   */
  label?: string;
  /**
   * 默认值
   *
   * @type {string}
   * @memberof Property
   */
  defalut?: string;
  /**
   * 属性类型
   *
   * @type {string}
   * @memberof Property
   */
  type?: string;
  /**
   * 描述
   *
   * @type {string}
   * @memberof Property
   */
  description?: string;
}

export enum NcObjectType {
  Interface = 'interface',
  Class = 'class',
  Const = 'const',
  Type = 'type',
  Enum = 'enum'
}
