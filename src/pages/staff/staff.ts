import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Loading,
  LoadingController
} from 'ionic-angular';

import { filter, first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromStaff from '../../store/staff';

import { Store as OldStore } from '../../providers/store';
import { Log } from '../../providers/log';

import { expand } from '../../components/animations';
import { IonicFormInput } from 'ionic-angular/util/form';

@IonicPage()
@Component({
  selector: 'page-staff',
  templateUrl: 'staff.html',
  animations: [ expand ]
})
export class Staff {
  public selected$;
  public list$;
  public showSearch$;
  public search$;
  private loading: Loading = this.loadingCtrl.create();

  constructor(
    private nav: NavController,
    private loadingCtrl: LoadingController,
    private oldStore: OldStore,
    private log: Log,
    private store$: Store<fromStaff.StaffState>,
  ){}

  async ionViewDidLoad(){
    await this.loading.present();

    this.selected$ = this.store$.select(fromStaff.getSelected);
    this.list$ = this.store$.select(fromStaff.getFilteredList);
    this.showSearch$ = this.store$.select(fromStaff.getShowSearch);
    this.search$ = this.store$.select(fromStaff.getSearchQuery);

    this.store$.dispatch(new fromStaff.Load());

    this.store$
      .select(fromStaff.getLoaded)
      .pipe(filter(loaded => loaded), first())
      .subscribe(() => this.loading.dismiss());
  }
  select(id){
    this.store$.dispatch(new fromStaff.SetSelected(id));
  }
  toggleSearch(){
    this.store$.dispatch(new fromStaff.ToggleSearch());
  }
  doSearch(event){
    this.store$.dispatch(new fromStaff.SetSearchQuery(event.target.value))
  }
}
