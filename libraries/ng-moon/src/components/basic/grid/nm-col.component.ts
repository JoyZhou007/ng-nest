import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Renderer2,
  ElementRef,
  Input,
  Optional,
  Host
} from "@angular/core";
import { ColPrefix } from "./nm-grid.type";
import { NmRowComponent } from "./nm-row.component";

@Component({
  selector: "nm-col",
  template: "<ng-content></ng-content>",
  styleUrls: ["./nm-col.component.scss"],
  // Todo: 默认模式，ng-content中的内容中的样式无法生效
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NmColComponent implements OnInit {
  @Input() nmSpan?: number;

  constructor(
    @Optional() @Host() public nmRowComponent: NmRowComponent,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, ColPrefix);
  }

  ngOnInit() {
    if (typeof this.nmSpan !== "undefined") {
      this.renderer.addClass(
        this.elementRef.nativeElement,
        `${ColPrefix}-${this.nmSpan}`
      );
    }
    if (this.nmRowComponent.nmSpace) {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        "padding-left",
        `${this.nmRowComponent.nmSpace / 2}rem`
      );
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        "padding-right",
        `${this.nmRowComponent.nmSpace / 2}rem`
      );
    }
  }
}
