import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Renderer2, ElementRef, Input, SimpleChanges } from '@angular/core';
import { XContainerPrefix, XContainerProperty } from './container.property';
import { XDirection } from '@ng-nest/ui/core';

@Component({
  selector: `${XContainerPrefix}`,
  template: '<ng-content></ng-content>',
  styleUrls: ['./container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XContainerComponent extends XContainerProperty implements OnInit {
  private _direction?: XDirection;
  public get direction(): XDirection {
    return this._direction;
  }
  public set direction(value: XDirection) {
    if (this._direction !== value) {
      this._direction = value;
      this.setDirection();
    }
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    super();
    this.renderer.addClass(this.elementRef.nativeElement, XContainerPrefix);
  }

  ngOnInit() {
    this.setDirection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let direction = changes.direction;
    if (direction && direction.currentValue != direction.previousValue) {
      this.setDirection();
    }
  }

  setDirection() {
    if (this.direction) {
      this.renderer.addClass(this.elementRef.nativeElement, `x-direction-${this.direction}`);
    }
  }
}
