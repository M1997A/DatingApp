import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable({ providedIn: 'root' })
export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = "Unread";
    constructor(private userService: UserService, private router: Router,
        private alertify: AlertifyService, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber,
             this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this.alertify.errror('problem retrieving messages');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}