import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XCheckboxComponent } from './checkbox.component';
import { FormsModule } from '@angular/forms';
import { XButtonModule } from '@ng-nest/ui/button';
import { XOutletModule } from '@ng-nest/ui/outlet';
import { XCheckboxProperty } from './checkbox.property';

@NgModule({
  declarations: [XCheckboxComponent, XCheckboxProperty],
  exports: [XCheckboxComponent],
  imports: [CommonModule, FormsModule, XButtonModule, XOutletModule]
})
export class XCheckboxModule {}
