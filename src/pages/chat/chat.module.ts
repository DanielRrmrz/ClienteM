import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";
import { RelativeTime } from "../../pipes/relative-time";
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji";

@NgModule({
  declarations: [Chat, RelativeTime],
  imports: [EmojiPickerComponentModule, IonicPageModule.forChild(Chat)],
  exports: [Chat],
  providers: [ChatServiceProvider, EmojiProvider]
})
export class ChatModule {}
