import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController } from 'ionic-angular';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public appStatus = ''

  constructor(public navCtrl: NavController, private electron: ElectronService, public modalCtrl: ModalController, public toastCtrl: ToastController, public alertCtrl:AlertController) {
    if (this.electron.isElectronApp) {
      console.log('Running Electron:', this.electron);
    } else {
      console.log('Mode web');
    }

    this.electron.ipcRenderer.on('openUpdateModal', (event, message) => {
      this.presentConfirm(message)
    })

    this.electron.ipcRenderer.on('presentUpdateToast', (event, message) => {
      this.presentUpdateToast(message)
    })

    this.electron.ipcRenderer.send("update")

    this.appVersion = this.electron.remote.app.getVersion()
  }

  appVersion = null  

  presentConfirm(message) {
    let alert = this.alertCtrl.create({
      title: 'Download Complete',
      message: 'A restart is needed for changes to apply. Would you like to restart now?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.electron.ipcRenderer.send("quitAndInstall")
          }
        }
      ]
    });
    alert.present();
  }

  async presentUpdateToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
