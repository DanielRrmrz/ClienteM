import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Platform } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatServiceProvider, ChatMessage, UserInfo } from "../../providers/chat-service/chat-service";
import { RegisterUserProvider } from '../../providers/register-user/register-user';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class Chat {
  @ViewChild(Content) content: Content;
  @ViewChild("chat_input") messageInput: ElementRef;
  msgList: any;
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = "";
  showEmojiPicker = false;
  serviceID: any;
  userID: any;
  _user: any = {};
  repaID: any;
  imagenUser: any;
  name: any;
  nameRepa: any;
  playerIDRepartidor: any;
  mensajeP: string;

  constructor(
    navParams: NavParams,
    private chatService: ChatServiceProvider,
    private events: Events,
    public afireauth: AngularFireAuth,
    public _providerUser: RegisterUserProvider,
    public platform: Platform,
    public translateService: TranslateService
  ) {
    this.mensajeP = translateService.instant('MESSAGE.MESSAGE');
    // Get the navParams toUserId parameter
    this.toUser = {
      id: navParams.get("toUserId"),
      name: navParams.get("toUserName")
    };
    // Get mock user information
    this.chatService.getUserInfo().then(res => {
      this.user = res;
    });

    this.serviceID = navParams.get("serviceID");
    this.playerIDRepartidor = navParams.get("playerIDRepartidor");
    this.userID = navParams.get("userID");
    this.repaID = navParams.get("repaID");
  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe("chat:received");
  }

  ionViewDidEnter() {
    //get message list
    this.getMsg();

    //get user Info
    this.getUser(this.userID);
    this.getRepa(this.repaID);
    this.getRepartidorPhoto(this.userID);

    // Subscribe to received  new message events
    this.events.subscribe("chat:received", msg => {
      this.pushNewMsg(msg);
    });
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  getUser(idx) {
    return this._providerUser.getUser(idx).then(user => {
      this._user = user;
      console.log("Este es el usuaro: ", this._user);

      this.imagenUser = this._user.photo;
      this.name = this._user.username;
    });
  }

  getRepa(idx) {
    return this._providerUser.getUser(idx).then(user => {
      this._user = user;
      console.log("Este es el Repa: ", this._user);
      this.nameRepa = this._user.username;
    });
  }

  getRepartidorPhoto(idx) {
    this.afireauth.authState.subscribe(user => {
      if (user.uid == idx) {
        const repaPhoto = user.photoURL;
        console.log("esta es la foro del Repa : ", repaPhoto);
      }
    });
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService.getMsgList(this.serviceID).subscribe(res => {
      this.msgList = res;
      console.log("Mensajes: ", this.msgList);

      this.scrollToBottom();
    });
  }

  /**
   * @name sendMsg
   */
  sendMsg(imagenUser, name, repa) {
    if (!this.editorMsg.trim()) return;

    // Mock message
    const id = Date.now().toString();
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: localStorage.getItem("uid"),
      userName: name,
      userAvatar: imagenUser,
      toUserId: "",
      time: Date.now(),
      message: this.editorMsg,
      status: "pending",
      service: this.serviceID
    };

    this.pushNewMsg(newMsg);
    this.mensajeChat(this.playerIDRepartidor, repa, this.editorMsg);
    this.editorMsg = "";

    if (!this.showEmojiPicker) {
      this.focus();
    }

    this.chatService.sendMsg(newMsg).then(() => {
      let index = this.getMsgIndexById(id);
      if (index !== -1) {
        this.msgList[index].status = "success";
      }
    });

    this.chatService.saveMsg(newMsg);
  }

  mensajeChat(playerIDUser, username, msg) {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "d8805e05-35c0-4036-99a5-2b4b493262b2",
        include_player_ids: [playerIDUser],
        data: { estatus: "" },
        contents: {
          en: msg
        },
        headings: { en: username }
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function(successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function(failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    // Verify user relationships
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }
}
