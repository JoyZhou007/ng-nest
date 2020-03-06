import { Subscription, Observable } from 'rxjs';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { XListInput, XListNode } from './list.type';
import {
  fillDefault,
  XData,
  XValueAccessor,
  XControlValueAccessor,
  XInputNumber,
  XIsObservable,
  XDataConvert,
  XToDataConvert,
  XInputBoolean
} from '@ng-nest/ui/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'x-list',
  templateUrl: './list.component.html',
  styleUrls: ['./style/index.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [XValueAccessor(XListComponent)]
})
export class XListComponent extends XControlValueAccessor implements OnInit, OnChanges {
  @Input() @XDataConvert() data?: XData<XListNode[]>;
  @Input() @XInputNumber() multiple?: number;
  @Input() @XInputBoolean() checked?: boolean;
  @Output() nodeEmit?: EventEmitter<XListNode> = new EventEmitter<XListNode>();

  nodes: XListNode[] = [];
  selectedNodes: XListNode[] = [];

  writeValue(value: any): void {
    this.value = value;
    this.setSelected();
    this.cdr.detectChanges();
  }

  private _default: XListInput = {
    multiple: 1
  };
  private data$: Subscription | null = null;

  constructor(public renderer: Renderer2, private cdr: ChangeDetectorRef) {
    super(renderer);
  }

  ngOnInit() {
    fillDefault(this, this._default);
    // removeNgTag(this.elementRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let dataChange = changes.data;
    if (dataChange && dataChange.currentValue !== dataChange.previousValue) {
      this.setData();
    }
  }

  ngOnDestroy(): void {
    this.data$ && this.data$.unsubscribe();
  }

  private setData() {
    if (typeof this.data === 'undefined') return;
    if (XIsObservable(this.data)) {
      this.data$ && this.data$.unsubscribe();
      this.data$ = (this.data as Observable<any>).pipe(map(x => XToDataConvert(x))).subscribe(x => {
        this.setDataChange(x);
      });
    } else {
      this.setDataChange(this.data as Array<any>);
    }
  }

  private setDataChange(value: XListNode[]) {
    this.nodes = value;
    this.setSelected();
    this.cdr.detectChanges();
  }

  setSelected() {
    if (this.nodes.length > 0) {
      let valArry = [];
      if (this.value instanceof Array) {
        valArry = this.value;
      } else {
        valArry = [this.value];
      }
      this.nodes
        .filter(x => x.selected)
        .map(x => {
          x.selected = false;
        });
      this.selectedNodes = this.nodes
        .filter(x => valArry.indexOf(x.id) > -1)
        .map(x => {
          x.selected = true;
          return x;
        });
    }
  }

  nodeClick(event: Event, node: XListNode) {
    event.preventDefault();
    if (node.disabled || (node.selected && this.multiple === 1)) return;
    const selected = !node.selected;
    if (selected) {
      if (this.selectedNodes.length < this.multiple || this.multiple === 0) {
        node.selected = selected;
        this.selectedNodes = [...this.selectedNodes, node];
      } else if (this.multiple === 1 && this.selectedNodes.length === 1) {
        node.selected = selected;
        this.selectedNodes[0].selected = false;
        this.selectedNodes[0] = node;
      } else {
        return;
      }
    } else {
      node.selected = selected;
      this.selectedNodes.splice(
        this.selectedNodes.findIndex(x => x.id == node.id),
        1
      );
    }
    if (this.multiple === 1 && this.selectedNodes.length === 1) {
      this.value = this.selectedNodes[0].id;
    } else {
      this.value = this.selectedNodes.map(x => x.id);
    }
    if (this.onChange) this.onChange(this.value);
    node.event = event;
    this.nodeEmit.emit(node);
  }
}
