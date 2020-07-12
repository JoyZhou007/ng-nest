import { XData, XProperty, XDataConvert, XInputBoolean, XBoolean, XPlacement, XWithConfig, XTrigger } from '@ng-nest/ui/core';
import { XListNode } from '@ng-nest/ui/list';
import { Input, Output, EventEmitter, Component } from '@angular/core';

/**
 * Dropdown
 * @selector x-dropdown
 * @decorator component
 */
export const XDropdownPrefix = 'x-dropdown';

/**
 * Dropdown Property
 */
@Component({ template: '' })
export class XDropdownProperty extends XProperty {
  /**
   * 节点数据
   */
  @Input() @XDataConvert() data: XData<XDropdownNode> = [];
  /**
   * 触发方式
   */
  @Input() @XWithConfig<XDropdownTrigger>('hover') trigger: XDropdownTrigger;
  /**
   * 展示位置
   */
  @Input() @XWithConfig<XPlacement>('bottom-start') placement: XPlacement;
  /**
   * 禁用
   */
  @Input() @XInputBoolean() disabled: XBoolean;
  /**
   * 节点中已经包含子节点数据
   */
  @Input() @XInputBoolean() children: XBoolean;
  /**
   * 节点点击事件
   */
  @Output() nodeClick = new EventEmitter<XDropdownNode>();
}

/**
 * Dropdown 数据对象
 */
export interface XDropdownNode extends XListNode {}

/**
 * 显示方式
 */
export type XDropdownTrigger = XTrigger;

/**
 * Dropdown Portal
 * @selector x-dropdown-portal
 * @decorator component
 */
export const XDropdownPortalPrefix = 'x-dropdown-portal';
