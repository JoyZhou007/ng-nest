import { Component } from '@angular/core';

@Component({
  selector: 'ex-trigger',
  templateUrl: './trigger.component.html'
})
export class ExTriggerComponent {
  data = ['用户管理', '角色管理', '组织管理', '模块管理', '日志管理'];
}
