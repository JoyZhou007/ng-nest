import { Component, OnInit } from "@angular/core";
import { XData } from "@ng-nest/ui/core";
import { XCrumbNode, XCrumbNodeClick } from "@ng-nest/ui/crumb";

@Component({
  selector: "ex-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"]
})
export class ExDefaultComponent implements OnInit {
  data: XData<XCrumbNode[]> = [
    { key: 1, label: "首页" },
    { key: 2, label: "系统管理" },
    { key: 3, label: "基础信息" },
    { key: 4, label: "用户管理" }
  ];
  constructor() {}

  ngOnInit() {}

  nodeClick(node: XCrumbNodeClick) {

  }
}
