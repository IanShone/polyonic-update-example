import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { ElectronService } from 'ngx-electron';

import { UpdateModalPage } from '../update/updateModal';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  updateStatus="Nothing happening here, Boss..."

  constructor(public navCtrl: NavController, private electron: ElectronService, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    if (this.electron.isElectronApp) {
      console.log('Running Electron:', this.electron);
    } else {
      console.log('Mode web');
    }

    this.electron.ipcRenderer.on('openUpdateModal', (event, message) => {
      this.openUpdateModal(message)
    })

    this.electron.ipcRenderer.on('presentUpdateToast', (event, message) => {
      this.presentUpdateToast(message)
    })

    this.electron.ipcRenderer.send("update")

    this.appVersion = this.electron.remote.app.getVersion()
  }

  appVersion = null  

  openUpdateModal(message) {
    let modal = this.modalCtrl.create(UpdateModalPage, {message: message},);
    modal.present();
    modal.onDidDismiss(data => {
      if(data==="restart"){
        this.electron.ipcRenderer.send("quitAndInstall")
      }
    });
  }

  async presentUpdateToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
