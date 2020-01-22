import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import firebase from "@firebase/app";
import "@firebase/firestore";

import { AuthService } from "./auth.service";
import { Message } from "../interfaces/message";
import {
  FirebaseFirestore,
  DocumentReference
} from "@firebase/firestore-types";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private db: FirebaseFirestore;
  public messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>(
    []
  );

  constructor(private zone: NgZone, private authService: AuthService) {}

  init(): void {
    this.db = firebase.firestore();
  }

  watchMessages(): Function {
    this.messages.next([]);

    return this.db
      .collection("messages")
      .orderBy("created", "desc")
      .limit(50)
      .onSnapshot(querySnapshot => {
        let messages = [];

        querySnapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            messages.push({
              ...change.doc.data()
            });
          }
        });
        this.zone.run(() => {
          this.messages.next(messages);
        });
      });
  }

  async addMessage(message: string): Promise<DocumentReference> {
    return await this.db.collection("messages").add({
      uid: this.authService.user.uid,
      displayName: this.authService.user.displayName,
      displayPicture: this.authService.user.displayPicture,
      message: message,
      created: Date.now()
    });
  }
}
