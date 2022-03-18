import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  AlertController,
} from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
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
