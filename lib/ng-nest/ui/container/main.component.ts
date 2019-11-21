import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Renderer2,
  ElementRef
} from "@angular/core";
import { XMainPrefix } from "./container.type";

@Component({
  selector: `${XMainPrefix}`,
  template: "<ng-content></ng-content>",
  styleUrls: ["./main.component.scss"],
  // Todo: 默认模式，ng-content中的内容中的样式无法生效
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XMainComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.renderer.addClass(this.elementRef.nativeElement, XMainPrefix);
  }

  ngOnInit() {}
}
