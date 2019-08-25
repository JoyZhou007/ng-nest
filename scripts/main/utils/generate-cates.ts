import * as fs from "fs-extra";
import * as path from "path";
import { NcCates } from "../interfaces/examples";
import {
  handlerTabs,
  handlerTabsByFiles,
  randomString,
  generateTabsActivatedChange
} from ".";
import { NcTabsLayoutEnum, NcTab } from "../interfaces/tabs";
import { generateTabs } from ".";
import * as _ from "lodash";
import { replaceKey } from "./replace-key";
import { NcTemplate } from "../interfaces/template";

const tplDir = path.resolve(__dirname, "../../main/templates");

/**
 * 生成示例分类
 *
 * @export
 * @param {NcCates} cates
 * @returns
 */
export function generateCates(
  cates: NcCates,
  comTpl: NcTemplate,
  func: string
): NcCates {
  if (cates.list.length > 0) {
    let subFunc = "";
    while (subFunc == "" || _.hasIn(comTpl.syswords.constant, subFunc))
      subFunc = randomString();
    comTpl.syswords.constant += `${generateTabsActivatedChange(subFunc)}\n`;
    let catesTabs = handlerTabs({
      layout: NcTabsLayoutEnum.Top,
      folderPath: cates.folderPath,
      activatedChange: `(nmActivatedChange)="${subFunc}Change($event)"`,
      id: func
    });
    catesTabs.tabs.forEach(x => {
      generateFiles(x, comTpl, path.join(cates.folderPath, x.name), subFunc);
    });
    cates.content = generateTabs(catesTabs).content;
  }
  return cates;
}

/**
 * 生成分类文件中的代码
 *
 * @export
 * @param {NcTab} tab
 */
export function generateFiles(
  tab: NcTab,
  comTpl: NcTemplate,
  folderPath: string,
  func: string
) {
  let highlightTpl = fs.readFileSync(
    path.join(tplDir, "highlight-component.template.html"),
    "utf8"
  );
  if (!comTpl) return;
  let childTabs = handlerTabsByFiles({
    layout: NcTabsLayoutEnum.Top,
    folderPath: folderPath,
    id: func
  });
  let html = "";
  childTabs.tabs.forEach((x, index) => {
    let param = "";
    while (param == "" || _.hasIn(comTpl.syswords.constant, param))
      param = randomString();
    let tpl = highlightTpl;
    let content =
      x.content.lastIndexOf("\n") == x.content.length - 1
        ? x.content.slice(0, x.content.length - 1)
        : x.content;
    let type =
      extToType[x.name.slice(x.name.lastIndexOf(".") + 1, x.name.length)];
    tpl = replaceKey(tpl, "__type", type);
    tpl = replaceKey(tpl, "__data", param);
    if (type == extToType.ts) {
      let consts = getConstByContent(content);
      for (let key in consts) {
        comTpl.syswords.constant += `${key}=\`${consts[key]}\`;\n  `;
      }
      content = handlerContent(content);
    }
    comTpl.syswords.constant += `${param}=\`${content}\`;\n  `;
    if (x.name == `${tab.name}.component.html`) html = content;
    x.content = tpl;
  });
  tab.content = `
  <div class="nm-examples-html">${html}</div>\n
  <div class="nm-examples-info">${tab.content}</div>\n
  <div class="nm-examples-code">${generateTabs(childTabs).content}</div>\n
  `;

  return tab;
}

/**
 * ts文件中特殊字符处理
 */
export function handlerContent(content: string) {
  let special = ["`"];
  special.forEach(x => {
    if (content.indexOf(x) > -1) {
      content = content.replace(new RegExp(x, "g"), `\\${x}`);
    }
  });
  return content;
}

export function getConstByContent(content: string) {
  let conSpt = content.split("\n");
  let consts = {};
  let prop = "";
  let val = "";
  let startVal = "";
  let isReadClass = false;
  let isReadConst = false;
  let isReadProp = false;
  conSpt.forEach((x: string) => {
    if (x.trim().startsWith("export") && !isReadClass) {
      isReadClass = true;
    }
    if (isReadClass && !isReadProp && !isReadConst && x.indexOf("=") > -1) {
      isReadConst = true;
      isReadProp = true;
      let lineSpt = x.split("=");
      prop = lineSpt[0].trim();
      val = lineSpt.length > 1 ? lineSpt[1].trim() : "";
      startVal = val.length > 0 ? val.slice(0, 1) : "";
      consts[prop] = val;
    }
    if (!isReadProp && isReadClass && isReadConst) {
      let value = x;
      val += `\n${value}`;
      consts[prop] = val;
      if (x.endsWith(`${startVal};`)) {
        isReadConst = false;
        consts[prop] = consts[prop].slice(1, consts[prop].length - 2);
        prop = val = startVal = "";
      }
    } else {
      isReadProp = false;
    }
  });

  return consts;
}

/**
 * 文件后缀对应的文件类型
 */
export const extToType = {
  ts: "typescript",
  html: "html",
  scss: "scss",
  css: "css"
};
