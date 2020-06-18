import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Renderer2, ElementRef, Input, HostBinding } from '@angular/core';
import { XButtonsPrefix, XButtonsProperty } from './button.property';

@Component({
  selector: `${XButtonsPrefix}`,
  template: '<ng-content></ng-content>',
  styleUrls: ['./buttons.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XButtonsComponent extends XButtonsProperty implements OnInit {
  @HostBinding('class.x-buttons-space') get getSpace() {
    return this.space;
  }
  @HostBinding('class.x-buttons-hiddenBorder') get getHiddenBorder() {
    return this.hiddenBorder;
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    super();
    this.renderer.addClass(this.elementRef.nativeElement, XButtonsPrefix);
  }

  ngOnInit() {
    this.setSpace();
  }

  setSpace() {
    if (!this.space) return;
    this.renderer.setStyle(this.elementRef.nativeElement, 'margin-left', `-${Number(this.space) / 2}rem`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'margin-right', `-${Number(this.space) / 2}rem`);
  }
}
