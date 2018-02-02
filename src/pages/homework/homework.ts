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

import { Store as OldStore } from '../../providers/store';
import { Auth } from '../../providers/auth';
import { Log } from '../../providers/log';

import { expand } from '../../components/animations';

import { Store } from '@ngrx/store';
import * as fromHomework from '../../store/homework';
import { withLatestFrom, first, filter } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-homework',
  templateUrl: 'homework.html',
  animations: [expand]
})
export class Homework {
  homework: Array<{ calc_class: string, calc_date: string, lsn_date: string, lsn_hw: string, lsn_id: string }> = [];
  classes: any[];
  public classes$: Store<Array<string>>;
  filteredHw: any[] = [];
  public homework$: Store<Array<fromHomework.Lesson>>;
  selectedClass: string = 'all-classes';
  public selectedClass$: Store<string>;
  public hideChecked$: Store<boolean>;
  loading: Loading = this.loadingCtrl.create();

  constructor(
    private translate: TranslateService,
    private alert: AlertController,
    private loadingCtrl: LoadingController,

    private store: OldStore,
    private log: Log,
    private store$: Store<fromHomework.HomeworkState>,
  ) { }

  async ionViewDidLoad() {
    await this.loading.present();
    this.hideChecked$ = this.store$.select(fromHomework.getHideChecked);
    this.selectedClass$ = this.store$.select(fromHomework.getSelectedClass);
    this.homework$ = this.store$.select(fromHomework.getHomeworkList);
    this.classes$ = this.store$.select(fromHomework.getClassList);
    this.store$.dispatch(new fromHomework.Load());
    this.store$
      .select(fromHomework.getLoaded)
      .pipe(filter(loaded => loaded), first())
      .subscribe(() => this.loading.dismiss());
  }

  public popover(e) {
    this.classes$
      .pipe(withLatestFrom(
        this.selectedClass$,
        this.translate.get('HOMEWORK.ALL_CLASSES'),
        this.translate.get('HOMEWORK.TITLE'),
        this.translate.get('GLOBAL.CANCEL'),
        this.translate.get('GLOBAL.OK'),
      ), first())
      .subscribe(([list, selectedClass, allClasses, pageTitle, cancel, ok]) => {
        const inputs = list.map(name => ({
          type: 'radio',
          label: name,
          value: name,
        })).concat({
          type: 'radio',
          label: allClasses,
          value: null,
        }).map(button => ({
          ...button,
          checked: button.value === selectedClass
        }));

        return this.alert.create({
          title: pageTitle,
          inputs,
          buttons: [
            cancel,
            {
              text: ok,
              handler: name => this.store$.dispatch(new fromHomework.SetSelectedClass(name)),
            }
          ],
        }).present();
      });
  }

  public check(item) {
    this.store$.dispatch(new fromHomework.ToggleLesson(item));
  }

  public refresh(refresher: Refresher) {
    this.store$.dispatch(new fromHomework.Load(true));
    refresher.complete();
  }

  public toggleHideChecked(event) {
    this.store$.dispatch(new fromHomework.ToggleHideChecked(event.checked));
  }
}
