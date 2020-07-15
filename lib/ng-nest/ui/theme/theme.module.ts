import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XThemeComponent } from './theme.component';
import { XThemeProperty } from './theme.property';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XButtonModule } from '@ng-nest/ui/button';
import { XFormModule } from '@ng-nest/ui/form';
import { XSwitchModule } from '@ng-nest/ui/switch';
import { XLayoutModule } from '@ng-nest/ui/layout';

@NgModule({
  declarations: [XThemeComponent, XThemeProperty],
  exports: [XThemeComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, XSwitchModule, XButtonModule, XLayoutModule, XFormModule]
})
export class XThemeModule {}
