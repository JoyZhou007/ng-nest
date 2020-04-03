import { NcTabsLayoutEnum, NcTabsNodeJustifyEnum } from './../interfaces/tabs';
import * as path from 'path';
import * as fs from 'fs-extra';
import { NcPage } from '../interfaces/page';
import { NcExamples, NcCates } from '../interfaces/examples';
import {
  replaceKey,
  randomString,
  generateTabs,
  handlerTabs,
  hanlderCates,
  generateCates,
  hanlderType,
  generateTypes,
  hanlderPattern,
  generatePatterns,
  hanlderSpec
} from '.';
import * as _ from 'lodash';

const tplDir = path.resolve(__dirname, '../../main/templates');

/**
 * 组件处理
 *
 * @export
 * @param {NcPage} page
 */
export async function handlerComponent(page: NcPage) {
  handlerExamples(page);
  await handlerApi(page);
  await handlerPattern(page);
  await handlerSpec(page);
}

/**
 * 示例内容处理
 *
 * @export
 * @param {NcPage} page
 */
export function handlerExamples(page: NcPage) {
  if (page.custom.indexOf('__examples') <= -1) return;
  let examples: NcExamples = {};
  let comTpl = _.find(page.templates, x => x.name == 'component');

  examples.path = path.join(page.path, 'examples');
  examples.tplPath = path.join(tplDir, 'examples-component.template.html');
  let func = '';
  while (func == '' || _.hasIn(comTpl.syswords.constant, func)) func = randomString();
  let tabs = handlerTabs({
    layout: NcTabsLayoutEnum.Left,
    nodeJustify: NcTabsNodeJustifyEnum.Start,
    folderPath: examples.path
  });
  tabs.tabs.forEach(x => {
    let cates: NcCates = { folderPath: path.join(tabs.folderPath, x.name) };
    hanlderCates(cates, page);
    generateCates(cates, comTpl);
    if (cates.content) {
      x.content = cates.content;
    }
  });
  generateTabs(tabs);
  let examplesTpl = fs.readFileSync(examples.tplPath, 'utf8');
  page.custom = replaceKey(page.custom, '__examples', replaceKey(examplesTpl, '__tabs', tabs.content));
  page.copyDir.push({
    from: examples.path,
    to: path.join(page.genDir, 'examples'),
    exclude: ['.md']
  });
}

export async function handlerApi(page: NcPage) {
  if (page.custom.indexOf('__api') === -1) return;
  let types = await hanlderType(path.join(page.path, `${page.name}.type.ts`));
  page.custom = replaceKey(page.custom, '__api', `<x-api>${generateTypes(...types)}</x-api>`);
}

export async function handlerPattern(page: NcPage) {
  if (page.custom.indexOf('__pattern') === -1) return;
  let patterns = await hanlderPattern(path.join(page.path, 'style', `param.scss`));
  page.custom = replaceKey(page.custom, '__pattern', `<x-pattern>${generatePatterns(...patterns)}</x-pattern>`);
}

export async function handlerSpec(page: NcPage) {
  if (page.name === 'button') {
    await hanlderSpec(path.join(page.path, `${page.name}.component.spec.ts`));
  }
}
