import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Events, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Auth } from './services/auth';
import { Log } from './services/log';
import { State } from './services/state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  username: string = '';
  name: string = '';

  appPages = [
    { title: 'PROFILE.NAME', url: 'profile', icon: 'person' },
    { title: 'HOMEWORK.NAME', url: 'homework', icon: 'bookmarks' },
    { title: 'GRADES.NAME', url: 'grades', icon: 'checkmark-circle' },
    { title: 'EVENTS.NAME', url: 'events', icon: 'calendar' },
    { title: 'CAFETERIA.NAME', url: 'cafeteria', icon: 'card' },
    { title: 'STAFF.NAME', url: 'staff', icon: 'people' },
  ];
  loading: HTMLIonLoadingElement;

  constructor(
    private loadingCtrl: LoadingController,
    private events: Events,
    private storage: Storage,
    private auth: Auth,
    private state: State,
    private log: Log,
    private translate: TranslateService,
    private router: Router,
  ) {
    this.init();
  }

  async init() {
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();

    // load translations in background
    this.translate.getTranslation('en');
    this.translate.getTranslation('es');
    this.translate.getTranslation('ko');
    let preferedLang = navigator.language.slice(0, 2);
    if (preferedLang !== 'en' && preferedLang !== 'es') {
      preferedLang = 'en';
    }
    this.translate.setDefaultLang(preferedLang);
    this.events.subscribe('login', (user, login, link) =>
      this.login(user, login, link),
    );

    try {
      await this.storage.ready();
      const fromStorage = await this.state.load();
      await this.loading.dismiss();
      const state = fromStorage as any;
      if (state && state.USER && state.LOGIN) {
        this.login(state.USER.data, state.LOGIN.data);
      } else {
        this.logout();
      }
    } catch (e) {
      this.log.error(e);
    }
  }

  async login(user, login, link?) {
    this.username = user.username;
    this.name = login.person_name;
    this.translate.use(user.language);

    let url = link;
    if (!link) {
      url = location.hash.slice(2);
    }
    await this.router.navigate([url]);
  }

  async logout() {
    try {
      await this.loading.present();

      await this.router.navigate(['login']);

      await this.auth.logout();
      await this.loading.dismiss();
    } catch (e) {
      this.log.error(e);
    }
  }
}