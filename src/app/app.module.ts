import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthGuardService } from "./services/auth-guard.service";

import { Facebook } from "@ionic-native/facebook/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    Facebook,
    AuthGuardService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
