import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XResultComponent } from './result.component';
import { XIconModule } from '@ng-nest/ui/icon';
import { XOutletModule } from '@ng-nest/ui/outlet';

@NgModule({
  declarations: [XResultComponent],
  exports: [XResultComponent],
  imports: [CommonModule, XIconModule, XOutletModule]
})
export class XResultModule {}
