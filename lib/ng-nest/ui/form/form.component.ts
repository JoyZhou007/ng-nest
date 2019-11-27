import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { XFormInput, FormPrefix, XControl, XFormRow } from "./form.type";
import { fillDefault } from "@ng-nest/ui/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "x-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XFormComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() controls?: XControl<any>[] | XFormRow[];

  formGroup: FormGroup;

  controlsType: "controls" | "rows";

  private _default: XFormInput = {};

  private _controls: XControl<any>[] = [];

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, FormPrefix);
  }

  ngOnInit() {
    fillDefault(this, this._default);
    this.getControlsType();
    this.createFormGroup();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.removeListen();
  }

  getControlsType() {
    if (this.controls && this.controls.length > 0) {
      this.controlsType =
        this.controls[0] instanceof XControl ? "controls" : "rows";
      if (this.controlsType === "controls") {
        this._controls = this.controls as XControl<any>[];
      } else if (this.controlsType === "rows") {
        for (let row of this.controls as XFormRow[]) {
          this._controls = [...this._controls, ...row.controls];
        }
      }
    }
  }

  createFormGroup() {
    let group: any = {};
    this._controls.forEach(x => {
      group[x.key] = new FormControl(x.value);
    });
    this.formGroup = new FormGroup(group);
  }

  submit() {}

  private removeListen() {}
}
