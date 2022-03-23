import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  AlertController,
  ActionSheetController,
} from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
      })
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'destructive',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          console.log('BOOKED!');
        }
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  // async onBookPlace() {
  //   let modal = await this.modalCtrl.create({
  //     component: CreateBookingComponent,
  //     componentProps: { selectedPlace: this.place }, //gets passed in as the INPUT property
  //     keyboardClose: true,
  //     swipeToClose: true,
  //   });
  //   await (await modal).present();
  //   const { data, role } = await (await modal).onWillDismiss(); //onDidDismiss()
  //   if (role === 'confirm') {
  //     this.presentAlert(
  //       `Message passed back<br/><br/>${data.message}<br/><br/>Role '${role}' passed back`
  //     );
  //   } else {
  //     this.presentAlert(`Cancel clicked!<br/><br/>Role '${role}' passed back`);
  //   }
  // }

  // async presentAlert(message: string) {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Alert',
  //     message: message,
  //     buttons: ['Ok'],
  //   });
  //   await alert.present();
  // }
}
