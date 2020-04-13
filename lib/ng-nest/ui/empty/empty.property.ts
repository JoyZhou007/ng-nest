import { XTemplate } from '@ng-nest/ui/core';
import { Input, Component } from '@angular/core';

/**
 * Empty
 * @selector x-empty
 * @decorator component
 */
export const XEmptyPrefix = 'x-empty';

/**
 * Empty Property
 */
@Component({ template: '' })
export class XEmptyProperty {
  /**
   * 图片地址或自定义模板
   */
  @Input() img?: XTemplate;
  /**
   * 内容或自定义模板
   */
  @Input() content?: XTemplate;
}
