import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { XTreeFileComponent } from './tree-file.component';
import { XTreeFileProperty } from './tree-file.property';
import { XTreeModule } from '@ng-nest/ui/tree';
import { XHighlightModule } from '@ng-nest/ui/highlight';
import { XCrumbModule } from '@ng-nest/ui/crumb';
import { XIconModule } from '@ng-nest/ui/icon';

@NgModule({
  declarations: [XTreeFileComponent, XTreeFileProperty],
  exports: [XTreeFileComponent],
  imports: [CommonModule, HttpClientModule, XTreeModule, XCrumbModule, XIconModule, XHighlightModule]
})
export class XTreeFileModule {}
