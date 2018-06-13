import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Data ,Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as fromAfterLogin from '../../../store/after-login.reducers';
import * as ChatActions from '../../../store/chat/chat.actions';
import * as fromChat from '../../../store/chat/chat.reducers';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-chats-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.css']
})
export class ListAgentComponent implements OnInit {

  /** Variable declaration */
  chatState: Observable<fromChat.ChatState>;
  chatMode: boolean = false;
    order: string = 'info.name';
    reverse: boolean = false;
    sortedCollection: any[];
    page: number;
    term: any;
  /** Service injection */
  constructor(private store: Store<fromAfterLogin.AfterLoginFeatureState>,
              private activatedRoute: ActivatedRoute,
              private router: Router, private orderPipe: OrderPipe) {
      this.sortedCollection = orderPipe.transform(this.chatState, 'info.name');
  }

  /** Function to be executed when component initializes */
  ngOnInit() {
    this.page = 1;
    this.chatState = this.store.select('afterLogin')
        .map(data => data.chat);

    this.activatedRoute.data
        .subscribe(
            (data: Data) => {
              this.chatMode = data['chatMode'];
              this.store.dispatch(new ChatActions.GetAgentListAttempt());
            }
        );


  }

  /** Function to View Chats of Agent */
  onViewChat(id: number) {
    this.router.navigate([ 'chats/list-chat/', id ]);
  }

  /** Function to View Contact List of Agent */
  onViewContact(id: number) {
    this.router.navigate([ 'chats/contact-list/', id ]);
  }

    /**
     * Function for ordering the table
     * @param {string} value
     */
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

}
