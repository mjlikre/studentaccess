import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  AlertController,
  Loading,
  LoadingController,
  Refresher,
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Store } from '../../providers/store';
import { Log } from '../../providers/log';

import { expand } from '../../components/animations';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [ expand ]
})
export class Profile {
  loading: Loading = this.loadingCtrl.create();
  schedules: any[] = [];
  selectedSchedule = {
    type: '',
    schedule: []
  };
  lang: string;

  missing: any[] = [];
  showMissing: boolean = false;

  birth: string = '';
  studentName: string = '';
  grade: string = '';
  familyCredit: number = 0.00;
  studentCredit: number = 0.00;
  personImage: string = './assets/placeholder.jpg';

  attendance: any[] = [];
  discipline: any[] = [];

  constructor(
    private nav: NavController,
    private alert: AlertController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private store: Store,
    private log: Log,
  ){}
  async ionViewDidLoad(){
    await this.loading.present();
    await this.get();
    this.loading.dismiss();
  }

  async get( refresh = false ){
    try {
      let login = await this.store.get('LOGIN', undefined, refresh) || {};
      this.birth = ( login.birthdate || '' ).replace(/-/ig, ' ');
      this.studentName = login.person_name;
      this.grade = login.grade;
      this.familyCredit = parseFloat( login.credit_family || '0' );
      this.studentCredit = parseFloat( login.credit_student || '0' );

      let missing = await this.store.get('MISSING', undefined, refresh) || {};
      this.missing = missing.missing || [];

      let schedules = await this.store.get('SCHEDULES');
      this.lang = this.translate.currentLang;
      this.schedules = schedules;
      this.selectedSchedule = schedules[0] || {};

      let img = await this.store.get('IMAGE');
      this.personImage = img ? `data:image/jpeg;base64,${img}` : './assets/placeholder.jpg';

      let records = await this.store.get('RECORDS', undefined, refresh);
      this.attendance = records.attendance;
      this.discipline = records.discipline;
    } catch(err){
      this.log.error(err);
    }
  }

  async refresh( refresher: Refresher ){
    await this.get(true);
    refresher.complete();
  }

  toggleSchedule(){
    let inputs = this.schedules.map( el => ({
      type: 'radio',
      label: el[this.lang],
      value: el.type,
      checked: el.type === this.selectedSchedule.type
    }) );

    this.alert.create({
      title: this.translate.instant('PROFILE.SELECT_SCHEDULE'),
      buttons: [
        this.translate.instant('GLOBAL.CANCEL'),
        {
          text: this.translate.instant('GLOBAL.OK'),
          handler: type => {
            this.selectedSchedule = this.schedules.find( schedule => schedule.type === type );
          }
        }
      ],
      inputs
    }).present();
  }

  toggleMissing(){
    this.showMissing = !this.showMissing;
  }
  goSelected( opts ){
    this.nav.push('Records', opts);
  }
  goGrades(){
    this.nav.setRoot('Grades');
  }

}
