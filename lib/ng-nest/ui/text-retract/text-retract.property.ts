import { Input, Component } from '@angular/core';
import { XInputNumber, XNumber } from '@ng-nest/ui/core';

/**
 * TextRetract
 * @selector x-text-retract
 * @decorator component
 */
export const XTextRetractPrefix = 'x-text-retract';

/**
 * TextRetract Property
 */
@Component({ template: '' })
export class XTextRetractProperty {
  /**
   * 文本
   */
  @Input() content: string;
  /**
   * 默认最大显示字符数
   */
  @Input() @XInputNumber() max: XNumber = 256;
}
