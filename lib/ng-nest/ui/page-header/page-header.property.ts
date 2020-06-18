import { Input, Output, EventEmitter, Component } from '@angular/core';

/**
 * PageHeader
 * @selector x-page-header
 * @decorator component
 */
export const XPageHeaderPrefix = 'x-page-header';

/**
 * PageHeader Property
 */
@Component({ template: '' })
export class XPageHeaderProperty {
  /**
   * 返回图标
   */
  @Input() backIcon: string = 'fto-arrow-left';
  /**
   * 返回文字
   */
  @Input() backText: string = '返回';
  /**
   * 标题
   */
  @Input() title: string;
  /**
   * 副标题
   */
  @Input() subTitle: string;
  /**
   * 点击返回的事件
   */
  @Output() backClick = new EventEmitter();
}
