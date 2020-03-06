import { XCascadePortalComponent } from './cascade-portal.component';
import { XPortalService, XPortalOverlayRef } from '@ng-nest/ui/portal';
import { Subscription, Observable, Subject } from 'rxjs';
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
  ViewContainerRef,
  ViewChild,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { XCascadePrefix, XCascadeInput, XCascadeNode, XCascadePortal } from './cascade.type';
import {
  fillDefault,
  XValueAccessor,
  XControlValueAccessor,
  XData,
  XIsEmpty,
  XDataConvert,
  XIsObservable,
  XToDataConvert,
  removeNgTag
} from '@ng-nest/ui/core';
import { XInputComponent } from '@ng-nest/ui/input';
import { DOCUMENT } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'x-cascade',
  templateUrl: './cascade.component.html',
  styleUrls: ['./cascade.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [XValueAccessor(XCascadeComponent)]
})
export class XCascadeComponent extends XControlValueAccessor implements OnInit, OnChanges {
  @Input() @XDataConvert() data?: XData<XCascadeNode[]>;
  @ViewChild('cascade', { static: true }) cascade: ElementRef;
  @ViewChild('inputCom', { static: true }) inputCom: XInputComponent;
  @Output() nodeEmit?: EventEmitter<XCascadeNode> = new EventEmitter<XCascadeNode>();

  get getRequired() {
    return this.required && XIsEmpty(this.value);
  }

  writeValue(value: any) {
    this.value = value;
    this.setDisplayValue();
    this.valueChange.next(this.value);
    this.cdr.detectChanges();
  }

  readonly: boolean = true;
  clearable: boolean = false;
  enter: boolean = false;
  displayValue: any = '';
  datas: XCascadeNode[] = [];
  nodes: XCascadeNode[] = [];
  portal: XPortalOverlayRef;
  icon: string = 'fto-chevron-down';
  box: DOMRect;
  protalHeight: number;
  maxNodes: number = 6;
  protalTobottom: boolean = true;
  scrollFunction: Function;
  resizeFunction: Function;
  private _default: XCascadeInput = {};
  private data$: Subscription | null = null;
  valueChange: Subject<any> = new Subject();
  dataChange: Subject<any> = new Subject();

  constructor(
    public renderer: Renderer2,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private portalService: XPortalService,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private doc: any
  ) {
    super(renderer);
    this.renderer.addClass(this.elementRef.nativeElement, XCascadePrefix);
  }

  ngOnInit() {
    fillDefault(this, this._default);
    this.setFlex(this.cascade.nativeElement, this.justify, this.align, this.direction);
    // removeNgTag(this.elementRef.nativeElement);
  }

  ngAfterViewInit() {
    this.setPortal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let dataChange = changes.data;
    if (dataChange && dataChange.currentValue !== dataChange.previousValue) {
      this.setData();
    }
  }

  ngOnDestroy(): void {
    this.data$ && this.data$.unsubscribe();
    this.removeListen();
  }

  addListen() {
    this.scrollFunction = this.renderer.listen('window', 'scroll', () => {
      this.setPortal();
    });
    this.resizeFunction = this.renderer.listen('window', 'resize', () => {
      this.setPortal();
    });
  }

  removeListen() {
    this.scrollFunction && this.scrollFunction();
    this.resizeFunction && this.resizeFunction();
    this.cdr.markForCheck();
  }

  private setData() {
    if (typeof this.data === 'undefined') return;
    if (XIsObservable(this.data)) {
      this.data$ && this.data$.unsubscribe();
      this.data$ = (this.data as Observable<any>).pipe(map(x => XToDataConvert(x))).subscribe(x => {
        this.setDataChange(x);
      });
    } else {
      this.setDataChange(this.data as XCascadeNode[]);
    }
  }

  private setDataChange(value: XCascadeNode[]) {
    this.datas = value;
    let getChildren = (node: XCascadeNode, level: number) => {
      node.level = level;
      node.children = value.filter(y => y.pid === node.id);
      node.leaf = node.children.length > 0;
      if (node.leaf) node.children.map(y => getChildren(y, level + 1));
      return node;
    };
    this.nodes = value.filter(x => XIsEmpty(x.pid)).map(x => getChildren(x, 0));
    this.setPortal();
  }

  change() {
    // if (this.onChange) this.onChange(this.value);
  }

  menter() {
    if (this.disabled) return;
    this.enter = true;
    if (!XIsEmpty(this.value)) {
      this.icon = '';
      this.clearable = true;
      this.cdr.detectChanges();
    }
  }

  mleave() {
    if (this.disabled) return;
    this.enter = false;
    if (this.clearable) {
      this.icon = 'fto-chevron-down';
      this.clearable = false;
      this.cdr.detectChanges();
    }
  }

  clearEmit() {
    this.value = '';
    this.displayValue = '';
    this.mleave();
    this.valueChange.next(this.value);
    if (this.onChange) this.onChange(this.value);
  }

  portalAttached() {
    return this.portal && this.portal.overlayRef.hasAttached();
  }

  closePortal() {
    if (this.portalAttached()) {
      this.portal.overlayRef.dispose();
      this.removeListen();
      return true;
    }
    return false;
  }

  showPortal(event: Event) {
    if (this.disabled) return;
    if (this.closePortal()) return;
    this.portal = this.portalService.create({
      content: XCascadePortalComponent,
      viewContainerRef: this.viewContainerRef,
      injector: this.portalService.createInjector(
        {
          datas: this.datas,
          nodes: this.nodes,
          value: this.value,
          valueChange: this.valueChange,
          closePortal: () => this.closePortal(),
          nodeEmit: node => this.nodeClick(node)
        },
        XCascadePortal
      ),
      overlayConfig: {
        backdropClass: '',
        positionStrategy: this.setPositionStrategy()
      }
    });
    this.addListen();
  }

  nodeClick(selected: { node: XCascadeNode; label: string }) {
    this.value = selected.node.id;
    this.displayValue = selected.label;
    this.closePortal();
    if (this.onChange) this.onChange(this.value);
    this.nodeEmit.emit(selected);
  }

  setDisplayValue() {
    let node = this.datas.find(x => x.id === this.value);
    if (!node) {
      this.displayValue = '';
      return;
    }
    let selecteds = [node];
    while (!XIsEmpty(node.pid)) {
      node = this.datas.find(x => x.id === node.pid);
      selecteds = [node, ...selecteds];
    }
    this.displayValue = selecteds.map(x => x.label).join(` / `);
  }

  setPositionStrategy() {
    this.box = this.inputCom.input.nativeElement.getBoundingClientRect();
    this.protalTobottom = this.doc.documentElement.clientHeight - this.box.top - this.box.height > this.protalHeight;
    return this.portalService.setPositionStrategy(
      this.inputCom.input,
      this.protalTobottom ? 'bottom-start' : 'top-start'
    );
  }

  setPortal() {
    if (!this.inputCom.input) return;
    this.box = this.inputCom.input.nativeElement.getBoundingClientRect();
    if (this.box && this.nodes.length > 0) {
      this.protalHeight = this.box.height * (this.nodes.length > this.maxNodes ? this.maxNodes : this.nodes.length);
    }
    if (this.portalAttached()) {
      this.portal.overlayRef.updatePositionStrategy(this.setPositionStrategy());
    }
  }
}
