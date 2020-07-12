import { XProperty, XWithConfig } from '@ng-nest/ui/core';
import { Input, Component } from '@angular/core';

/**
 * Inner
 * @selector x-inner
 * @decorator component
 */
export const XInnerPrefix = 'x-inner';

/**
 * Inner Property
 */
@Component({ template: '' })
export class XInnerProperty extends XProperty {
  /**
   * 内边距
   */
  @Input() @XWithConfig<string>('1rem') padding: string;
}
