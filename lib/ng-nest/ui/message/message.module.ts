import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XMessageComponent } from './message.component';
import { XAlertModule } from '@ng-nest/ui/alert';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [XMessageComponent],
  exports: [XMessageComponent],
  imports: [CommonModule, OverlayModule, PortalModule, XAlertModule]
})
export class XMessageModule {}
