import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
  ViewChild,
  Inject,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import {
  AnchorPrefix,
  NmAnchorOption,
  NmAnchorNode,
  NmActivatedAnchor,
  NmAnchorLayoutType
} from "./nm-anchor.type";
import { fillDefault, reqAnimFrame, computedStyle } from "../../../core/util";
import {
  NmSliderNode,
  NmActivatedSlider,
  NmSliderComponent,
  NmSliderOption
} from "../../basic/slider";
import { BehaviorSubject, Subscription, fromEvent, Observable } from "rxjs";
import { throttleTime, distinctUntilChanged } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import * as _ from "lodash";

@Component({
  selector: "nm-anchor",
  templateUrl: "./nm-anchor.component.html",
  // Todo: 使用 ShadowDom 模式后，模板中使用 ng-content 里面的内容无法显示
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./style/index.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NmAnchorComponent implements OnInit, OnDestroy {
  private _nmLayout: NmAnchorLayoutType;
  public get nmLayout(): NmAnchorLayoutType {
    return this._nmLayout;
  }
  @Input()
  public set nmLayout(value: NmAnchorLayoutType) {
    this._nmLayout = value;
    this.sliderOption.nmBorderPosition =
      this._nmLayout === "left" ? "right" : "left";
  }
  @Input() nmScrollElement: HTMLElement | Window;

  @Output() nmActivatedChange?: EventEmitter<
    NmActivatedAnchor
  > = new EventEmitter<NmActivatedAnchor>();

  listFixed: boolean = false;

  sliderOption: NmSliderOption = {
    nmData: new BehaviorSubject<NmSliderNode[]>([]),
    nmActivatedIndex: 0,
    nmBorderPosition: "left"
  };

  scrollObservable: Observable<any>;

  private _default: NmAnchorOption = {
    nmLayout: "right"
  };
  private _windowScroll: boolean = false;
  private _scroll$: Subscription | null = null;
  private _windowScroll$: Subscription | null = null;
  private _windowSize$: Subscription | null = null;
  private _hElements: HTMLElement[];
  private _isAnimation: boolean = false;
  private _offsetParent: any;
  @ViewChild("slider", { static: false }) slider: NmSliderComponent;
  @ViewChild("list", { static: false }) list: ElementRef;
  @ViewChild("content", { static: false }) content: ElementRef;

  @HostBinding(`class.nm-anchor-left`)
  get getLayoutLeft() {
    return this.nmLayout === "left";
  }
  @HostBinding(`class.nm-anchor-right`)
  get getLayoutRight() {
    return this.nmLayout === "right";
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private doc: any
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, AnchorPrefix);
  }

  ngOnInit() {
    fillDefault(this, this._default);
  }

  ngAfterViewInit() {
    this.setElements();
  }

  ngOnDestroy(): void {
    this.removeListen();
  }

  private removeListen() {
    this._scroll$.unsubscribe();
    this._windowSize$.unsubscribe();
    if (this._windowScroll$) {
      this._windowScroll$.unsubscribe();
    }
  }

  activatedChange(activated: NmActivatedSlider) {
    this._isAnimation = true;
    const activatedEle = this._hElements[activated.nmActivatedIndex];
    const marginTop = parseFloat(computedStyle(activatedEle, "marginTop"));
    let top =
      activatedEle.offsetTop +
      this.elementRef.nativeElement.offsetTop -
      marginTop +
      1;
    let scrollEle = this._windowScroll
      ? this.doc.documentElement
      : (this.nmScrollElement as HTMLElement);
    if (!this._windowScroll) {
      top -= scrollEle.offsetTop;
    }
    this.scrollTo(scrollEle, _.ceil(top), 150);
    this.nmActivatedChange.emit(activated);
    setTimeout(() => {
      this._isAnimation = false;
    }, 300);
  }

  private setElements() {
    this.setHElements();
    this.setScrollElement();
    this.windowSizeChange();
  }

  private setHElements() {
    this._hElements = this.elementRef.nativeElement.querySelectorAll(
      "h1, h2, h3, h4, h5"
    );
    if (this._hElements.length > 0) {
      this.renderer.addClass(
        this.elementRef.nativeElement,
        `${AnchorPrefix}-open`
      );
      let list: NmAnchorNode[] = [];
      this._hElements.forEach((x: HTMLElement, i: number) => {
        const link = `nm-anchor-${i}`;
        const left = this.setLeft(x);
        this.renderer.setAttribute(x, "id", link);
        list = [
          ...list,
          {
            nmKey: i,
            nmLabel: x.innerText,
            nmLeft: left,
            // nmIcon: left > 1 ? "adf-forward" : "adf-forward",
            // router: `${this.location.path()}`,
            nmLink: link
          }
        ];
      });
      (this.sliderOption.nmData as BehaviorSubject<NmSliderNode[]>).next(list);
      (this.sliderOption.nmData as BehaviorSubject<NmSliderNode[]>).complete();
    }
  }

  private getScrollTop() {
    if (this._windowScroll) {
      return document.documentElement.scrollTop;
    } else {
      return (this.nmScrollElement as HTMLElement).scrollTop;
    }
  }

  private setScrollElement() {
    if (typeof this.nmScrollElement === "undefined") {
      this.nmScrollElement = window;
      this._windowScroll = true;
    } else {
      let scroll = new ElementRef(this.nmScrollElement);
      console.log(scroll, (scroll.nativeElement as HTMLElement).clientHeight);
      this._offsetParent = (this.nmScrollElement as HTMLElement).offsetParent;
      this.renderer.setStyle(
        this.list.nativeElement,
        "max-height",
        `${(this.nmScrollElement as HTMLElement).clientHeight}px`
      );
      console.log(new ElementRef(this._offsetParent));
      if (this._offsetParent) {
        fromEvent(this._offsetParent, "scroll")
          .pipe(distinctUntilChanged())
          .subscribe(() => {
            if (this.listFixed) {
              this.setFixedTop();
            }
          });
      }
      this.setWindowScroll();
    }
    this.scrollObservable = fromEvent(this.nmScrollElement, "scroll").pipe(
      throttleTime(10),
      distinctUntilChanged()
    );
    this._scroll$ = this.scrollObservable.subscribe(() => {
      this.setActiveatedIndex();
    });
  }

  setActiveatedIndex() {
    let scrollTop = this.getScrollTop();
    this.listFixed = this.setFixed(scrollTop);
    this.setListFixed();
    if (!this._isAnimation) {
      let now = 0;
      this._hElements.forEach((item, index) => {
        let distance = scrollTop - this.elementRef.nativeElement.offsetTop;
        if (!this._windowScroll)
          distance += (this.nmScrollElement as HTMLElement).offsetTop;
        if (
          distance >=
          item.offsetTop - parseFloat(computedStyle(item, "marginTop"))
        ) {
          now = index;
          return;
        }
      });
      this.sliderOption.nmActivatedIndex = now;
    }
    this.cdr.detectChanges();
  }

  private setWindowScroll() {
    this._windowScroll$ = fromEvent(window, "scroll")
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        if (this.listFixed) {
          this.setFixedTop();
        }
      });
  }

  private setFixed(scrollTop) {
    let eleTop = this.elementRef.nativeElement.offsetTop;
    if (this._windowScroll) {
      return scrollTop >= eleTop;
    } else {
      let scroll = this.nmScrollElement as HTMLElement;
      let fixed = scrollTop >= eleTop - scroll.offsetTop;
      if (fixed) {
        this.setFixedTop();
      } else {
        this.renderer.setStyle(this.list.nativeElement, "top", `0px`);
      }
      return fixed;
    }
  }

  private setFixedTop() {
    let windowScrollTop = document.documentElement.scrollTop;
    let offsetTop = (this.nmScrollElement as HTMLElement).offsetTop;
    let offsetParent = (this.nmScrollElement as HTMLElement)
      .offsetParent as HTMLElement;
    if (offsetParent)
      offsetTop = offsetTop + offsetParent.offsetTop - offsetParent.scrollTop;
    this.renderer.setStyle(
      this.list.nativeElement,
      "top",
      `${offsetTop - windowScrollTop}px`
    );
  }

  private windowSizeChange() {
    this._windowSize$ = fromEvent(window, "resize")
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.setListFixed();
      });
  }

  private getAnchorLeft() {
    return this.nmLayout === "right"
      ? this.content.nativeElement.clientWidth
      : 0;
  }

  private setListFixed() {
    let fixedLeft = this.elementRef.nativeElement.offsetLeft;
    let anchorLeft = this.getAnchorLeft();
    this.renderer.setStyle(
      this.list.nativeElement,
      "left",
      `${this.listFixed ? fixedLeft + anchorLeft : anchorLeft}px`
    );
  }

  private setLeft(element: HTMLElement): number {
    const eles = ["H1", "H2", "H3", "H4", "H5"];
    const index = eles.indexOf(element.tagName);
    return index + 1;
  }

  private scrollTo(element: HTMLElement, to: number, duration: number): void {
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;
    reqAnimFrame(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to || duration <= 0) {
        return;
      } else {
        this.scrollTo(element, to, duration - 10);
      }
    });
  }
}
