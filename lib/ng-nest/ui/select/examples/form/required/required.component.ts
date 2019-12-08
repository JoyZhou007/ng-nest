import { Component, OnInit } from "@angular/core";
import { XSelectNode } from "@ng-nest/ui/select";
import { XData } from "@ng-nest/ui/core";

@Component({
  selector: "ex-required",
  templateUrl: "./required.component.html",
  styleUrls: ["./required.component.scss"]
})
export class ExRequiredComponent implements OnInit {
  data: XData<XSelectNode[]> = [
    { key: 1, label: "QQ" },
    { key: 2, label: "微信" },
    { key: 3, label: "钉钉" },
    { key: 4, label: "微博" }
  ];
  model1: number;
  model2: number;
  constructor() {}

  ngOnInit() {}
}
