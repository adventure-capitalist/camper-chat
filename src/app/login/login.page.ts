import { Component, OnInit } from "@angular/core";
import {
  MenuController,
  LoadingController,
  NavController
} from "@ionic/angular";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  private loading;
  constructor(
    private menu: MenuController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.showLoading();

    this.authService.loggedIn.subscribe(status => {
      this.loading.dismiss();

      if (status) {
        this.menu.enable(true);
        this.navCtrl.navigateForward("/home");
      }
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  login() {
    this.showLoading();
    this.authService.login();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Authenticating..."
    });
    this.loading.present();
  }
}
