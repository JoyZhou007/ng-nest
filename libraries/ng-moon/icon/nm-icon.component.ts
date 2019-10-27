import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges,
  Inject,
  Optional
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { IconPrefix, NmIconOption, NmIconSourceEnum } from "./nm-icon.type";
import { NmIconService } from "./nm-icon.service";
import {
  warnIconTypeNotFound,
  warnSVGTagNotFound,
  fillDefault
} from "ng-moon/core";
import * as _ from "lodash";

// 来源路径对应
export const NmSouceUrl = {
  adf: `${NmIconSourceEnum.AntDesign}/fill/`,
  ado: `${NmIconSourceEnum.AntDesign}/outline/`,
  adt: `${NmIconSourceEnum.AntDesign}/twotone/`,
  eaf: `${NmIconSourceEnum.Eva}/fill/`,
  eao: `${NmIconSourceEnum.Eva}/outline/`,
  fto: `${NmIconSourceEnum.Feather}/`,
  fab: `${NmIconSourceEnum.FontAwesome}/brands/`,
  far: `${NmIconSourceEnum.FontAwesome}/regular/`,
  fas: `${NmIconSourceEnum.FontAwesome}/solid/`,
  md: `${NmIconSourceEnum.MaterialDesign}/`
};

export const NmViewBox = [
  // { souces: ["adf", "ado", "adt"], value: "0 0 1024 1024" },
  // { souces: ["eaf", "eao"], value: "0 0 24 24" },
  // { souces: ["fto"], value: "0 0 24 24" }
];

@Component({
  selector: "nm-icon",
  templateUrl: "./nm-icon.component.html",
  styleUrls: ["./style/index.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NmIconComponent implements OnInit, OnChanges {
  @Input() nmType?: string;
  @Input() nmColor?: string | string[];
  @Input() nmRotate?: number;
  @Input() nmSpin?: boolean;
  @Input() nmTo?: string;
  private svgElement: SVGElement;
  private _default: NmIconOption = {};

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public nmIconService: NmIconService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) private document: any
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, IconPrefix);
  }

  ngOnInit() {
    fillDefault(this, this._default);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const nmTypeChange = changes.nmType;
    if (nmTypeChange.currentValue !== nmTypeChange.previousValue) {
      this.setSvgElement();
      this.renderer.addClass(this.elementRef.nativeElement, `${this.nmType}`);
    }
  }

  setSvgElement() {
    const typeIcon = this.setSourceUrl(this.nmType);
    const toIcon = this.setSourceUrl(this.nmTo);
    let icons = [typeIcon];
    if (typeof typeIcon === "undefined") return;
    if (typeof toIcon !== "undefined") {
      icons = [...icons, toIcon];
    }
    this.nmIconService.getSvgs(...icons).subscribe(x => this.setSvgs(x));
  }

  setSvgs(svgs: string[]) {
    if (svgs && svgs.length > 0) {
      if (this.svgElement) {
        this.renderer.removeChild(
          this.elementRef.nativeElement,
          this.svgElement
        );
      } else {
        this.svgElement = this.buildSvg(svgs.shift());
        // this.setAnimates(svgs);
        this.setAttributes(this.svgElement);
      }
      this.renderer.appendChild(this.elementRef.nativeElement, this.svgElement);
      this.cdr.markForCheck();
    }
  }

  setSourceUrl(type: string) {
    if (typeof type === "undefined") return;
    const split = type.split("-");
    const souce = split.shift();
    const souceUrl = NmSouceUrl[souce];
    const fileName = split.join("-");
    if (!souceUrl || !fileName) {
      warnIconTypeNotFound();
    }
    return `${souceUrl}${fileName}`;
  }

  setAttributes(svgEle: SVGElement) {
    if (svgEle) {
      this.renderer.setAttribute(svgEle, "width", "1em");
      this.renderer.setAttribute(svgEle, "height", "1em");
      if (this.nmSpin) this.renderer.addClass(svgEle, "nm-icon-spin");
    }
  }

  buildSvg(svgStr: string): SVGAElement {
    const result = this.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    ) as SVGAElement;
    const svg = this.createSvg(svgStr);
    svg.children.forEach(x => {
      x.removeAttribute("class");
      if (x.tagName === "rect") {
        x.setAttribute("fill", "none");
      }
      result.appendChild(x);
    });
    this.setAttribute(result, svg.ele, "viewBox");
    this.setAttribute(result, svg.ele, "fill", "currentColor");
    this.setAttribute(result, svg.ele, "stroke");
    this.setAttribute(result, svg.ele, "stroke-width");
    this.setAttribute(result, svg.ele, "stroke-linecap");
    this.setAttribute(result, svg.ele, "stroke-linejoin");
    if (!result) {
      warnSVGTagNotFound();
    }

    return result;
  }

  createSvg(svgStr: string) {
    const div = this.document.createElement("div");
    div.innerHTML = svgStr;
    let svgEle = div.querySelector("svg") as SVGElement;
    return {
      ele: svgEle,
      children: svgEle.querySelectorAll(
        "path, polyline, polygon, circle, line, rect"
      )
    };
  }

  setAttribute(
    svg: SVGElement,
    svgEle: SVGElement,
    attribute: string,
    def?: string
  ) {
    let attr = svgEle.getAttribute(attribute);
    if (attr) {
      svg.setAttribute(attribute, attr);
    } else if (def) {
      svg.setAttribute(attribute, def);
    }
  }

  //<animate begin="mouseenter" dur="500ms" repeatCount="1" attributeName="d" from="M86.425,13.204l5.648,12.741H0.55   l0.125-12.616L0.55,0.544h91.523L86.425,13.204z" to="M92.725,13.521l0.044,12.887H1.245   l7-12.616l-7-12.785h91.523L92.725,13.521z" fill="freeze"></animate>

  setAnimates(svgs: string[]) {
    if (svgs && svgs.length > 0) {
      let svg = this.createSvg(svgs.shift());
      for (let i = 0; i < this.svgElement.children.length; i++) {
        let child = this.svgElement.children[i];
        let toChild = svg.children[i];
        if (
          child &&
          toChild &&
          child.nodeName === "path" &&
          toChild.nodeName === "path"
        ) {
          let toAnimate = document.createElement("animate");
          toAnimate.setAttribute("dur", "500ms");
          toAnimate.setAttribute("repeatCount", "1");
          toAnimate.setAttribute("attributeName", "d");
          toAnimate.setAttribute("fill", "freeze");
          toAnimate.setAttribute("from", child.getAttribute("d"));
          toAnimate.setAttribute("to", toChild.getAttribute("d"));
          this.renderer.appendChild(child, toAnimate);
        }
      }
    }
  }
}
