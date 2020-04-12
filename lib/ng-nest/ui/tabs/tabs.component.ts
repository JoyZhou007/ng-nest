import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ContentChildren,
  ViewChild,
  ViewEncapsulation,
  SimpleChange
} from '@angular/core';
import { XTabsPrefix, XTabsNode, XTabsProperty } from './tabs.property';
import { XIsChange, XSetData, XIsUndefined } from '@ng-nest/ui/core';
import { Subject } from 'rxjs';
import { XSliderComponent, XSliderProperty } from '@ng-nest/ui/slider';
import { XTabComponent } from './tab.component';

@Component({
  selector: `${XTabsPrefix}`,
  templateUrl: './tabs.component.html',
  styleUrls: ['./style/index.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XTabsComponent extends XTabsProperty implements OnInit, OnChanges {
  private _activatedIndex: number = 0;
  public get activatedIndex(): number {
    return this._activatedIndex;
  }
  @Input()
  public set activatedIndex(value: number) {
    console.log('1', value);
    if (XIsUndefined(value)) return;
    console.log('2', value);
    this._activatedIndex = value;
    console.log('3', value);
    if (typeof this.sliderOption === 'undefined') {
      this.sliderOption = new XSliderProperty();
    }
    this.sliderOption.activatedIndex = value;
    console.log('4', value);
    this.setFirstAndLast();
    console.log('5', value);
    this.cdr?.detectChanges();
  }

  sliderOption = new XSliderProperty();
  tabs: XTabsNode[] = [];
  private _unSubject = new Subject<void>();

  @ContentChildren(XTabComponent) listTabs: Array<XTabComponent>;

  @ViewChild(XSliderComponent, { static: false }) slider: XSliderComponent;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.setClassMap();
    this.setSliderOption();
    this.setNodeJustify();
  }

  ngOnChanges(changes: SimpleChanges): void {
    XIsChange(changes.data) && this.setData();
    XIsChange(changes.layout) && this.setLayout(changes.layout);
    XIsChange(changes.justify) && this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this._unSubject.next();
    this._unSubject.unsubscribe();
  }

  ngAfterViewInit() {
    this.setData();
  }

  activatedChange(index: number) {
    console.log(index);
    this.activatedIndex = index;
    this.indexChange.emit({
      activatedIndex: index,
      activatedTab: this.tabs[index]
    });
    this.cdr.detectChanges();
  }

  private setClassMap() {
    this.classMap[`${XTabsPrefix}-${this.layout}`] = this.layout ? true : false;
    this.classMap[`${XTabsPrefix}-${this.type}`] = this.type ? true : false;
  }

  private setLayout(layout: SimpleChange) {
    this.classMap[`${XTabsPrefix}-${layout.previousValue}`] = false;
    this.classMap[`${XTabsPrefix}-${layout.currentValue}`] = true;
    this.setSliderOption();
    this.cdr.detectChanges();
  }

  private setNodeJustify() {
    this.nodeJustify = this.nodeJustify ? this.nodeJustify : this.layout === 'left' ? 'end' : this.layout === 'right' ? 'start' : 'center';
  }

  private setData() {
    if (typeof this.data === 'undefined') {
      if (this.listTabs && this.listTabs.length > 0) {
        let _data: any[] = [];
        this.listTabs.forEach((x, index) => {
          _data = [...(_data as XTabsNode[]), { id: index + 1, label: x.label }];
        });
        this.data = _data;
      } else {
        return;
      }
    }
    XSetData<XTabsNode>(this.data, this._unSubject).subscribe((x) => {
      this.tabs = x;
      this.sliderHidden = this.tabs.length <= 1;
      this.sliderOption.data = this.tabs;
      this.setFirstAndLast();
      this.cdr.detectChanges();
    });
  }

  private setSliderOption() {
    this.sliderOption.layout = ['top', 'bottom'].indexOf(this.layout) !== -1 ? 'row' : 'column';
  }

  private setFirstAndLast() {
    this.classMap[`${XTabsPrefix}-is-first`] = this.activatedIndex === 0;
    this.classMap[`${XTabsPrefix}-is-last`] = this.activatedIndex === this.tabs?.length - 1;
  }
}
