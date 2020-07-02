import { Injectable, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/overlay';
import { Menu } from 'src/environments/routes';
import { menus } from 'src/environments/menus';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  contentRef: ElementRef;
  contentScrolling = new Subject<CdkScrollable>();
  shrink = true;
  small = false;
  drawerVisible = false;
  defaultActivatedId: any;

  menus: Menu[] = menus;

  versions = ['0.2.0', '0.2.1', '0.2.2', '1.0.0', '1.1.2', '1.2.0', '1.2.1', '1.2.2', '1.2.4'];

  getCurrentMenu(url: string): Menu {
    return this.menus.find((x) => x.type !== 'router' && url.indexOf(`/${environment.layout}/${x.router}`) === 0) as Menu;
  }

  constructor(private router: Router, private location: Location, private title: Title) {
    this.router.events.pipe(filter((x) => x instanceof NavigationEnd)).subscribe((x: NavigationEnd) => {
      // this.shrink = x.url.indexOf(`/${environment.layout}/docs`) == 0;
      // console.log(this.shrink);
      const route = this.getCurrentMenu(x.url);
      if (route) this.title.setTitle(`${route.label}${route.label !== 'NG-NEST' ? ' | NG-NEST' : ''}`);
    });
    const route = this.getCurrentMenu(this.location.path());
    if (route) {
      this.defaultActivatedId = route.id;
    }
  }
}
