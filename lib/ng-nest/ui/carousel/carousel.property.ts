import { XProperty, XInputNumber, XInputBoolean, XNumber, XBoolean } from '@ng-nest/ui/core';
import { Input, Output, EventEmitter, Component } from '@angular/core';

/**
 * Carousel
 * @selector x-carousel
 * @decorator component
 */
export const XCarouselPrefix = 'x-carousel';

/**
 * Carousel Property
 */
@Component({ template: '' })
export class XCarouselProperty extends XProperty {
  /**
   * 当前激活的幻灯片索引
   */
  @Input() @XInputNumber() active: XNumber = 0;
  /**
   * 幻灯片高度
   */
  @Input() height: string = '15rem';
  /**
   * 切换器触发方式
   */
  @Input() trigger: XCarouselTrigger = 'hover';
  /**
   * 箭头显示影藏方式
   */
  @Input() arrow: XCarouselArrow = 'hover';
  /**
   * 幻灯片轮播方向
   */
  @Input() direction: XCarouselDirection = 'horizontal';
  /**
   * 自动切换
   */
  @Input() @XInputBoolean() autoplay: XBoolean = true;
  /**
   * 自动切换时间间隔
   */
  @Input() interval: XNumber = 3000;
  /**
   * 切换器否显示在外面
   */
  @Input() @XInputBoolean() outside: XBoolean;
  /**
   * 是否以卡片的方式显示幻灯片
   */
  @Input() @XInputBoolean() card: XBoolean;
  /**
   * 激活的序号改变的事件
   */
  @Output() activeChange = new EventEmitter<number>();
}

/**
 * 指示器切换方式
 */
export type XCarouselTrigger = 'hover' | 'click';

/**
 * 切换箭头显示方式
 */
export type XCarouselArrow = 'always' | 'hover' | 'never';

/**
 * 走马灯展示的方向
 */
export type XCarouselDirection = 'horizontal' | 'vertical';

/**
 * Carousel Panel
 * @selector x-carousel-panel
 * @decorator component
 */
export const XCarouselPanelPrefix = 'x-carousel-panel';

/**
 * Carousel Panel Property
 */
@Component({ template: '' })
export class XCarouselPanelProperty extends XProperty {
  /**
   * 激活当前幻灯片
   */
  @Input() @XInputBoolean() active: XBoolean;
}
