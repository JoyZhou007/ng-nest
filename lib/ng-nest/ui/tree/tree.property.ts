import { XDataConvert, XProperty, XData, XInputBoolean, XParentIdentityProperty } from '@ng-nest/ui/core';
import { Input, TemplateRef, Output, EventEmitter, Component } from '@angular/core';
import { XTreeNodeComponent } from './tree-node.component';
import { Observable } from 'rxjs';

/**
 * Tree
 * @selector x-tree
 * @decorator component
 */
export const XTreePrefix = 'x-tree';

/**
 * Tree Property
 */
@Component({ template: '' })
export class XTreeProperty extends XProperty {
  /**
   * 节点数据
   */
  @Input() @XDataConvert() data: XData<XTreeNode> = [];
  /**
   * 显示多选框
   */
  @Input() @XInputBoolean() checkbox: boolean;
  /**
   * 展开的节点
   */
  @Input() expanded: any[] = [];
  /**
   * 选中的节点
   */
  @Input() checked: any[] = [];
  /**
   * 展开所有节点
   */
  @Input() @XInputBoolean() expandedAll: boolean;
  /**
   * 标签自定义模板
   */
  @Input() labelTpl: TemplateRef<void>;
  /**
   * 当前点击选中的节点变化的事件
   */
  @Output() activatedChange = new EventEmitter<XTreeNode>();
  /**
   * 使用 checkedbox 选中变化的事件
   */
  @Output() selectedChange = new EventEmitter<XTreeNode[]>();
}

/**
 * Timeline 数据对象
 */
export interface XTreeNode extends XParentIdentityProperty<XTreeNode> {
  /**
   * 子节点
   */
  children?: XTreeNode[];
  /**
   * 展开
   */
  open?: boolean;
  /**
   * 激活的
   */
  activated?: boolean;
  /**
   * 检查更新
   */
  change?: Function;
  /**
   * 子节点已加载过
   */
  childrenLoaded?: boolean;
  /**
   * checkbox 选中的值
   */
  checked?: any[];
  /**
   * 禁用checkbox
   */
  disabled?: boolean;
  /**
   * checkbox 子节点是否有选中的状态
   */
  indeterminate?: boolean;
}

/**
 * TreeNode
 * @selector x-tree-node
 * @decorator directive
 */
export const XTreeNodePrefix = 'x-tree-node';

/**
 * TreeNode Property
 */
@Component({ template: '' })
export class XTreeNodeProperty {
  /**
   * 节点数据
   */
  @Input() node: XTreeNode = {};
  /**
   * 父节点组件
   */
  // @Input() parent: XTreeNodeComponent;
  /**
   * 层级
   */
  @Input() level: number;
  /**
   * 懒加载子节点
   */
  @Input() @XInputBoolean() lazy: boolean;
  /**
   * 懒加载函数
   */
  @Input() lazyData: (pid?: any) => Observable<XTreeNode[]>;
}
