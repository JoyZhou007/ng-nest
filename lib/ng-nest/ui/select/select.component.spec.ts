import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { XSelectComponent } from "./select.component";
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { XSelectModule } from "./select.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { XSelectPrefix, XSelectNode } from "./select.type";
import { XFenceModule } from "@ng-nest/ui/fence";

describe(XSelectPrefix, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [XSelectModule, FormsModule, ReactiveFormsModule, XFenceModule],
      declarations: [
        TestXSelectComponent,
        TestXSelectLabelComponent,
        TestXSelectDisabledComponent,
        TestXSelectRequiredComponent
      ]
    }).compileComponents();
  }));
  describe(`default.`, () => {
    let fixture: ComponentFixture<TestXSelectComponent>;
    let debugElement: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TestXSelectComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.directive(XSelectComponent));
    });
    it("should create.", () => {
      expect(debugElement).toBeDefined();
    });
  });
  describe(`label.`, () => {
    let fixture: ComponentFixture<TestXSelectLabelComponent>;
    let debugElement: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TestXSelectLabelComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.directive(TestXSelectLabelComponent));
    });
    it("should create.", () => {
      expect(debugElement).toBeDefined();
    });
  });
  describe(`disabled.`, () => {
    let fixture: ComponentFixture<TestXSelectDisabledComponent>;
    let debugElement: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TestXSelectDisabledComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.directive(TestXSelectDisabledComponent));
    });
    it("should create.", () => {
      expect(debugElement).toBeDefined();
    });
  });
  describe(`required.`, () => {
    let fixture: ComponentFixture<TestXSelectRequiredComponent>;
    let debugElement: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TestXSelectRequiredComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.directive(TestXSelectRequiredComponent));
    });
    it("should create.", () => {
      expect(debugElement).toBeDefined();
    });
  });
});

const data: XSelectNode[] = [
  { key: 1, label: "QQ" },
  { key: 2, label: "微信" },
  { key: 3, label: "钉钉" },
  { key: 4, label: "微博" }
];

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select [data]="data"></x-select>
      </x-col>
    </x-row>
  `,
  styles: [
    `
      x-row > x-col {
        width: 10rem;
      }
    `
  ]
})
class TestXSelectComponent {
  data = data;
}

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select label="数量"></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select label="数量" direction="column-reverse"></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select label="数量" direction="row"></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select label="数量" direction="row-reverse"></x-select>
      </x-col>
    </x-row>
  `,
  styles: [
    `
      x-row > x-col {
        width: 10rem;
      }
      x-row:not(:first-child) {
        margin-top: 0.5rem;
      }
    `
  ]
})
class TestXSelectLabelComponent {}

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select disabled></x-select>
      </x-col>
      <x-col>
        <x-select disabled [(ngModel)]="model"></x-select>
      </x-col>
    </x-row>
  `,
  styles: [
    `
      x-row > x-col {
        width: 10rem;
      }
      x-row > x-col:not(:first-child) {
        margin-top: 0.5rem;
      }
    `
  ]
})
class TestXSelectDisabledComponent {
  model = 10;
}

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select required></x-select>
      </x-col>
      <x-col>
        <x-select label="数量" required></x-select>
      </x-col>
    </x-row>
  `,
  styles: [
    `
      x-row > x-col {
        width: 10rem;
      }
      x-row > x-col:not(:first-child) {
        margin-top: 0.5rem;
      }
    `
  ]
})
class TestXSelectRequiredComponent {}
