import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromAuth from '../../../store/auth/auth.reducers';
import * as fromAfterLogin from "../../store/after-login.reducers";
import {Subscription} from "rxjs/Subscription";
import * as DashboardActions from "../../store/dashboard/dashboard.actions"
import * as fromChat from "../../store/chat/chat.reducers";
import {ChatService} from "../chat/chat.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
    /** Variable declaration */
    afterLoginState: Observable<fromAfterLogin.FeatureState>;
    authSubscription: Subscription;
    admin: any;
    agent: any;
    depertment: any;
    widgets: any;
    pendingChatCount: any;
    ongoingChatCount: any;
    closedChatCount: any;
    rejectedChatCount: any;
    authState: Observable<fromAuth.State>;
    chatState: Observable<fromChat.ChatState>;
    agentId: number;

  constructor( private store: Store<fromAfterLogin.AfterLoginFeatureState>, private chatService: ChatService ) { }

  ngOnInit() {
      this.authState = this.store.select('auth');       // auth user info
      this.authSubscription = this.store.select('auth')
          .subscribe(
              (data) => {
                  if(data.isAuthenticated !== false && data.isAdmin) {
                      this.store.dispatch(new DashboardActions.GetDashboardItemsCountAttempt({userId: data.userId}));
                  } else if (data.isAuthenticated !== false && data.isSuperAdmin) {
                       this.store.dispatch(new DashboardActions.GetDashboardItemsCountAttempt({userId: null}));
                  } else if(data.isAuthenticated !== false && data.isAgent){
                      this.store.dispatch(new DashboardActions.GetDashboardItemsCountAttempt({userId: data.userId}));
                      this.agentId = data.userId;
                      this.chatService.connect();
                      this.chatState = this.store.select('afterLogin').map(data => data.chat);
                  }
              }
          );

      this.store.select('afterLogin','dashboard').subscribe(
          (changes) => {
              if(changes.list[0] !== undefined ){
                  this.admin = changes.list[0][0].adminCount;
                  this.agent = changes.list[0][0].agentCount;
                  this.depertment = changes.list[0][0].departmentCount;
                  this.widgets = changes.list[0][0].widgetCount;
                  this.pendingChatCount = changes.list[0][0].pendingChatCount;
                  this.ongoingChatCount = changes.list[0][0].ongoingChatCount;
                  this.closedChatCount = changes.list[0][0].closedChatCount;
                  this.rejectedChatCount = changes.list[0][0].rejectedChatCount;
              }
          },(error) => {
              console.log(error);
          }
      );

      this.afterLoginState = this.store.select('afterLogin');
  }

    /** Show chats id status is 1*/
    showChats() {
        return this.store.select('afterLogin')
            .map(data => data.chat)
            .map(chats => chats.ongoing.filter(chat => chat.status == 1 ));
    }

    onSomeMsgAction(status: number,currentChatRoom: number) {
        console.log(status,currentChatRoom);
        switch(status) {
            case 2:
                this.chatService.takeAction({ agentId: this.agentId, status: status, chatRoomId: currentChatRoom });
                /** redirect to the ongoing chat page */
                location.href = '/chat/ongoing';
                break;
            case 3:
                this.chatService.takeAction({ agentId: this.agentId, status: status, chatRoomId: currentChatRoom });
                break;
            case 5:
                this.chatService.takeAction({ agentId: this.agentId, status: status, chatRoomId: currentChatRoom });
                break;
            default:
                console.log(status,currentChatRoom);
        }
    }


    ngOnDestroy (): void {
        this.authSubscription.unsubscribe();
    }

}