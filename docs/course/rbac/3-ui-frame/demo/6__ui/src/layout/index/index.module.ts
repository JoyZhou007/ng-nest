import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { ContentComponent } from './content/content.component';
import { CrumbComponent } from './crumb/crumb.component';
import { HeaderComponent } from './header/header.component';
import { SiderComponent } from './sider/sider.component';
import { TabsComponent } from './tabs/tabs.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    IndexComponent,
    ContentComponent,
    CrumbComponent,
    HeaderComponent,
    SiderComponent,
    TabsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: IndexComponent,
        children: [
          // 如果路由为空就指向 home
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          // 首页
          {
            path: 'home',
            loadChildren: () =>
              import('../../main/home/home.module').then((x) => x.HomeModule),
          },
          // 仪表盘
          {
            path: 'dashboard',
            loadChildren: () =>
              import('../../main/dashboard/dashboard.module').then(
                (x) => x.DashboardModule
              ),
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class IndexModule {}
