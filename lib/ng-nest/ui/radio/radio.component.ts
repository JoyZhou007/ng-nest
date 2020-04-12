import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { XRadioPrefix, XRadioNode, XRadioProperty } from './radio.property';
import { Subject } from 'rxjs';
import { XValueAccessor, XIsChange, XSetData } from '@ng-nest/ui/core';

@Component({
  selector: `${XRadioPrefix}`,
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [XValueAccessor(XRadioComponent)]
})
export class XRadioComponent extends XRadioProperty implements OnChanges {
  nodes: XRadioNode[] = [];
  private _unSubject = new Subject<void>();

  constructor(public renderer: Renderer2, public elementRef: ElementRef, public cdr: ChangeDetectorRef) {
    super(renderer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    XIsChange(changes.data) && this.setData();
  }

  ngOnDestroy(): void {
    this._unSubject.next();
    this._unSubject.unsubscribe();
  }

  writeValue(value: any) {
    this.value = value;
    this.cdr.detectChanges();
  }

  radioClick(event: Event, node: XRadioNode) {
    event.preventDefault();
    if (this.disabled || node.disabled || node.id === this.value) return;
    this.value = node.id;
    this.cdr.detectChanges();
    if (this.onChange) this.onChange(this.value);
  }

  private setData() {
    XSetData<XRadioNode>(this.data, this._unSubject).subscribe((x) => {
      this.nodes = x;
      this.cdr.detectChanges();
    });
  }
}
