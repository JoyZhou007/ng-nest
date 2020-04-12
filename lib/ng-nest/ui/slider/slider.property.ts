import {
  XData,
  XTemplate,
  XProperty,
  XIdentityProperty,
  XDataConvert,
  XInputBoolean,
  XInputNumber,
  XJustify,
  XSize
} from '@ng-nest/ui/core';
import { TemplateRef, Input, EventEmitter, Output } from '@angular/core';

/**
 * Slider
 * @selector x-slider
 * @decorator component
 */
export const XSliderPrefix = 'x-slider';

/**
 * Slider Property
 */
export class XSliderProperty extends XProperty {
  /**
   * 节点数据
   */
  @Input() @XDataConvert() data: XData<XSliderNode> = [];
  /**
   * 滑动动画
   */
  @Input() @XInputBoolean() animated: boolean = true;
  /**
   * 当前激活的索引
   */
  @Input() @XInputNumber() activatedIndex: number = 0;
  /**
   * 排列方式
   */
  @Input() layout: XSliderLayout = 'row';
  /**
   * 对齐方式
   */
  @Input() justify: XJustify = 'start';
  /**
   * 节点文字对齐方式
   */
  @Input('node-justify') nodeJustify: XJustify = 'center';
  /**
   * 节点自定义模板
   */
  @Input() nodeTpl?: TemplateRef<any>;
  /**
   * 尺寸
   */
  @Input() size: XSize = 'medium';
  /**
   * 激活索引变化事件
   */
  @Output() indexChange = new EventEmitter<number>();
}

/**
 * Slider 数据对象
 */
export interface XSliderNode extends XIdentityProperty {
  /**
   * 标题，支持模板
   */
  label?: XTemplate;
}

/**
 * 布局方式
 */
export type XSliderLayout = 'row' | 'column';
