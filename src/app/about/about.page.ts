import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.page.html",
  styleUrls: ["./about.page.scss"]
})
export class AboutPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.loggedIn.subscribe(status => {
      if (!status) {
        this.navCtrl.navigateBack("/login");
      }
    });
  }
}
