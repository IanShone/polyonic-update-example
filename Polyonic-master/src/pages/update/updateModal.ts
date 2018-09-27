import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: "updateModal.html"
})

export class UpdateModalPage {
  message
  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {
  
    this.message = (params.get("message"));
  
  }

  dismiss(restart) {
    if (restart===true){
      this.viewCtrl.dismiss('restart');
    }
    else{
      this.viewCtrl.dismiss();
    }
  }
}