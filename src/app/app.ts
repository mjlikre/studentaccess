import { Component, ViewChild } from '@angular/core';
import { Nav, LoadingController, Events, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Auth } from '../providers/auth';
import { State } from '../providers/state';
import { Log } from '../providers/log';

import * as fromRoot from '../store';

@Component({
  templateUrl: 'app.html'
})
export class StudentAccess {
  @ViewChild(Nav) nav: Nav;
  public loading: Loading;
  public rootPage: string = 'Profile';
  public username: string = '';
  public name: string = '';

  public pages: Array<any>;
  public activePage: string;

  constructor(
    public loadingCtrl: LoadingController,
    public events: Events,
    public storage: Storage,

    public auth: Auth,
    public state: State,
    public log: Log,
    public translate: TranslateService,

    private store$: Store<fromRoot.RootState>,
  ) {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    this.loading.present();

    // set date
    const date = new Date();
    let month = ('0' + (date.getMonth() + 1).toString()).slice(-2);
    let day = ('0' + date.getDate().toString()).slice(-2);
    let year = date.getFullYear().toString();
    store$.dispatch(new fromRoot.SetToday(`${year}-${month}-${day}`));

    // load translations in background
    translate.getTranslation('en');
    translate.getTranslation('es');
    translate.getTranslation('ko');
    let preferedLang = navigator.language.slice(0, 2);
    if (preferedLang !== 'en' && preferedLang !== 'es') {
      preferedLang = 'en';
    }
    translate.setDefaultLang(preferedLang);
    this.events.subscribe('login', (user, login, link) => this.login(user, login, link));

    this.storage.ready()
      .then(() => this.state.load())
      .then(fromStorage => {
        this.loading.dismiss();
        let state = fromStorage as any;
        if (state && state.USER && state.LOGIN) {
          this.login(state.USER.data, state.LOGIN.data);
        } else {
          this.logout();
        }
      })
      .catch(this.log.warn);

    this.pages = [
      { title: 'PROFILE.NAME', component: 'Profile', icon: 'person' },
      { title: 'HOMEWORK.NAME', component: 'Homework', icon: 'bookmarks' },
      { title: 'GRADES.NAME', component: 'Grades', icon: 'checkmark-circle' },
      { title: 'EVENTS.NAME', component: 'Events', icon: 'calendar' },
      { title: 'CAFETERIA.NAME', component: 'Cafeteria', icon: 'card' },
      { title: 'STAFF.NAME', component: 'Staff', icon: 'people' }
    ];
  }
  login(user, login, link?) {
    this.username = user.username;
    this.name = login.person_name;
    this.translate.use(user.language);
    if (link) {
      this.openPage(link);
    } else {
      let hash = location.hash.slice(2);
      this.activePage = hash.charAt(0).toUpperCase() + hash.slice(1);
    }
  }
  openPage(page) {
    this.activePage = page;
    this.nav.setRoot(page);
    this.log.debug('openPage: ', page, 'active Page: ', (this.nav.getActive() || {} as any).name);
  }
  logout() {
    this.loading = this.loadingCtrl.create();
    this.loading.present()
      .then(() => this.nav.setRoot('Login'))
      .then(() => this.auth.logout())
      .then(() => this.loading.dismiss())
      .catch(this.log.warn);
  }

}
