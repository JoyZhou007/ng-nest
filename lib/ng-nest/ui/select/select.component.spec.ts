import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XSelectComponent } from './select.component';
import { Component, DebugElement, ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { XSelectModule } from '@ng-nest/ui/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XSelectPrefix, XSelectNode } from './select.type';
import { XLayoutModule } from '@ng-nest/ui/layout';
import { Observable, interval } from 'rxjs';
import { XData } from '@ng-nest/ui/core';

describe(XSelectPrefix, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [XSelectModule, FormsModule, ReactiveFormsModule, XLayoutModule],
      declarations: [
        TestXSelectComponent,
        TestXSelectAsyncComponent,
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
    it('should create.', () => {
      expect(debugElement).toBeDefined();
    });
  });
  describe(`async.`, () => {
    let fixture: ComponentFixture<TestXSelectAsyncComponent>;
    let debugElement: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TestXSelectAsyncComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.directive(XSelectComponent));
    });
    it('should create.', () => {
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
    it('should create.', () => {
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
    it('should create.', () => {
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
    it('should create.', () => {
      expect(debugElement).toBeDefined();
    });
  });
});

const data: XData<XSelectNode[]> = ['AAAA', 'BBBB', 'CCCC', 'DDDD', 'EEEE', 'FFFF', 'GGGG', 'HHHH', 'IIII', 'JJJJ'];

@Component({
  template: `
    <x-row>
      <x-col span="8">
        <x-select [data]="data1" [(ngModel)]="model1"></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col span="8">
        <x-select [data]="data2" [(ngModel)]="model2"></x-select>
      </x-col>
    </x-row>
  `,
  styles: [
    `
      :host {
        height: 900px;
      }
      x-row:not(:first-child) {
        margin-top: 0.5rem;
      }
    `
  ]
})
class TestXSelectComponent {
  data1 = data;
  data2 = JSON.parse(JSON.stringify(data));
  model1: any;
  model2: any = 'BBBB';
  constructor(public cdr: ChangeDetectorRef) {
    interval(50).subscribe(x => {
      this.cdr.detectChanges();
    });
  }
}

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select label="方式" [data]="data" [(ngModel)]="model"></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select label="方式" [data]="data" [(ngModel)]="model" direction="column-reverse"></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select label="方式" [data]="data" [(ngModel)]="model" direction="row"></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select label="方式" [data]="data" [(ngModel)]="model" direction="row-reverse"></x-select>
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
class TestXSelectLabelComponent {
  data = data;
  model: any;
  constructor(public cdr: ChangeDetectorRef) {
    interval(50).subscribe(x => {
      this.cdr.detectChanges();
    });
  }
}

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select [data]="data" disabled></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select [data]="data" [(ngModel)]="model" disabled></x-select>
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
class TestXSelectDisabledComponent {
  data = data;
  model = 'DDDD';
  constructor(public cdr: ChangeDetectorRef) {
    interval(50).subscribe(x => {
      this.cdr.detectChanges();
    });
  }
}

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select [data]="data" [(ngModel)]="model1" required></x-select>
      </x-col>
    </x-row>
    <x-row>
      <x-col>
        <x-select [data]="data" [(ngModel)]="model2" label="选择" required></x-select>
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
class TestXSelectRequiredComponent {
  data = data;
  model1: any;
  model2: any;
}

@Component({
  template: `
    <x-row>
      <x-col>
        <x-select [data]="data" [(ngModel)]="model" (ngModelChange)="change($event)" async></x-select>
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
class TestXSelectAsyncComponent {
  model = 'QQ';
  data = Observable.create(x => {
    // 替换成http请求，或者data直接定义成 Observable 对象
    setTimeout(() => {
      this.model = '钉钉';
      x.next(['QQ', '微信', '钉钉', '微博']);
      x.complete();
    }, 2000);
  });
  constructor(private cdr: ChangeDetectorRef) {
    interval(50).subscribe(x => {
      this.cdr.detectChanges();
    });
  }
  change(val) {
    this.cdr.detectChanges();
  }
}
