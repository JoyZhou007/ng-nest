import { XIconModule } from '@ng-nest/ui/icon';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XEmptyComponent } from './empty.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { XLayoutModule } from '@ng-nest/ui/layout';
import { XEmptyModule } from '@ng-nest/ui/empty';
import { FormsModule } from '@angular/forms';
import { XEmptyPrefix } from './empty.property';
import { XButtonModule } from '@ng-nest/ui/button';
import { XContainerModule } from '@ng-nest/ui/container';

describe(XEmptyPrefix, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, XEmptyModule, XButtonModule, XContainerModule, XLayoutModule, XIconModule],
      declarations: [TestXEmptyComponent]
    }).compileComponents();
  }));
  describe(`default.`, () => {
    let fixture: ComponentFixture<TestXEmptyComponent>;
    let empty: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TestXEmptyComponent);
      fixture.detectChanges();
      empty = fixture.debugElement.query(By.directive(XEmptyComponent));
    });
    it('should create.', () => {
      expect(empty).toBeDefined();
    });
  });
});

@Component({
  template: `
    <div class="row">
      <x-empty></x-empty>
    </div>
    <div class="row">
      <x-empty
        img="https://ngnest.com/assets/img/logo/logo-144x144.png"
      ></x-empty>
    </div>
    <div class="row">
      <x-empty content="没有数据了"></x-empty>
    </div>
    <div class="row">
      <x-empty [img]="imgTemp">
        <ng-template #imgTemp><x-icon type="fto-user"></x-icon></ng-template>
      </x-empty>
    </div>
    <div class="row">
      <x-empty [content]="contentTemp">
        <ng-template #contentTemp>
          <span>没有数据</span>
          <x-button type="primary">重新请求</x-button>
        </ng-template>
      </x-empty>
    </div>
  `,
  styles: [
    `
      .row:not(:first-child) {
        margin-top: 2rem;
      }
      .row x-empty .x-button {
        margin-top: 1rem;
      }
    `
  ]
})
class TestXEmptyComponent {}
