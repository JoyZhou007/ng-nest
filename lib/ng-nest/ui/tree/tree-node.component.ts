import {
  Component,
  OnInit,
  ViewEncapsulation,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostBinding,
  Optional
} from '@angular/core';
import { XTreeNodePrefix, XTreeNode, XTreeNodeProperty } from './tree.property';
import { XTreeComponent } from './tree.component';
import { XIsEmpty } from '@ng-nest/ui/core';
import { map } from 'rxjs/operators';

@Component({
  selector: `${XTreeNodePrefix}, [${XTreeNodePrefix}]`,
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XTreeNodeComponent extends XTreeNodeProperty implements OnInit {
  @HostBinding('class.x-tree-node') rootClass = true;
  private _loading = false;
  public get loading() {
    return this._loading;
  }
  public set loading(value) {
    this._loading = value;
    this.cdr.detectChanges();
  }
  constructor(
    @Optional() public tree: XTreeComponent,
    public renderer: Renderer2,
    public elementRef: ElementRef,
    public cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.node.change = (check: boolean) => {
      if (check) this.onCheckboxChange();
      this.cdr.detectChanges();
    };
    if (!XIsEmpty(this.node.checked)) this.onCheckboxChange();
    this.setIndeterminate(this.node);
  }

  onToggle(event: Event, node: XTreeNode) {
    event.stopPropagation();
    node.open = !node.open;
    if (node.open && !node.childrenLoaded) {
      if (this.lazy) {
        this.loading = true;
        this.lazyData(node.id)
          .pipe(
            map((x) =>
              x.map((y) => {
                y.level = (node.level as number) + 1;
                y.checked = XIsEmpty(node.checked) ? [] : [y.id];
                return y;
              })
            )
          )
          .subscribe((x) => {
            node.children = x;
            node.childrenLoaded = true;
            this.loading = false;
            this.cdr.detectChanges();
          });
      } else {
        node.childrenLoaded = true;
      }
    }
    this.cdr.detectChanges();
  }

  onActivate(node: XTreeNode) {
    let change: Function;
    if (this.tree.activatedNode) {
      if (this.tree.activatedNode.id === node.id) return;
      change = this.tree.activatedNode.change as Function;
      change?.();
    }
    this.tree.activatedNode = node;
    this.tree.activatedChange.emit(node);
    this.cdr.detectChanges();
  }

  onCheckboxChange() {
    this.node.indeterminate = !XIsEmpty(this.node.checked);
    this.node.children && this.setChildrenCheckbox(this.node.checked as any[]);
    this.parent?.setParentCheckbox();
  }

  setChildrenCheckbox(checked: any[]) {
    const setChildren = (children: XTreeNode[], isChecked: boolean) => {
      if (XIsEmpty(children)) return;
      children.forEach((x) => {
        x.checked = isChecked ? [x.id] : [];
        x.indeterminate = isChecked;
        x.change && x.change();
        setChildren(x.children as XTreeNode[], isChecked);
      });
    };
    setChildren(this.node.children as XTreeNode[], !XIsEmpty(checked));
    this.cdr.detectChanges();
  }

  setParentCheckbox() {
    if (XIsEmpty(this.node.children)) return;
    let checkedList = this.node.children?.filter((x) => !XIsEmpty(x.checked));
    let indeterminateList = this.node.children?.filter((x) => x.indeterminate);
    this.node.checked = checkedList?.length === this.node.children?.length ? [this.node.id] : [];
    this.node.indeterminate = (checkedList as XTreeNode[]).length > 0 || (indeterminateList as XTreeNode[]).length > 0;
    this.parent?.setParentCheckbox();
    this.cdr.detectChanges();
  }

  setIndeterminate(node: XTreeNode) {
    const getChildren = (children: XTreeNode[]) => {
      if (XIsEmpty(children)) return;
      children.forEach((x) => {
        if (x.indeterminate || !XIsEmpty(x.checked)) {
          node.indeterminate = true;
          return;
        }
        getChildren(x.children as XTreeNode[]);
      });
    };
    getChildren(node.children as XTreeNode[]);
    this.cdr.detectChanges();
  }
}
