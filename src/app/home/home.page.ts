import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { IonContent, IonList, NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Message } from "../interfaces/message";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) contentArea: IonContent;
  @ViewChild(IonList, { static: true, read: ElementRef })
  chatList: ElementRef;

  public chatMessage: string = "";
  public messages: Message[] = [];
  private mutationObserver: MutationObserver;

  private loggedInSubscription: Subscription;
  private messagesSubscription: Subscription;
  private detachListener: Function;

  constructor(
    public dataService: DataService,
    public authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.mutationObserver = new MutationObserver(mutations => {
      this.contentArea.scrollToBottom(200);
    });
    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });
    this.loggedInSubscription = this.authService.loggedIn.subscribe(
      async status => {
        if (status) {
          this.detachListener = this.dataService.watchMessages();
          this.messagesSubscription = this.dataService.messages.subscribe(
            messages => {
              messages.reverse();
              messages.forEach(message => {
                this.messages.push(message);
              });
            }
          );
        } else {
          this.navCtrl.navigateBack("/login");
        }
      }
    );
  }

  ngOnDestroy() {
    this.loggedInSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
    this.detachListener();
  }

  async sendMessage() {
    if (this.chatMessage.length > 0) {
      await this.dataService.addMessage(this.chatMessage);
      this.chatMessage = "";
    }
  }
}
