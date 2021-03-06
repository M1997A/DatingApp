import { Component, OnInit } from "@angular/core";
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
selector: 'app-member-list',
templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit
{
    
    pagination: Pagination;
    users: User[];
    user: User = JSON.parse(localStorage.getItem('user'));
    genderList = [{value: "male", display: "Males"}, {value: "female", display: "Females"}];
    userParams: any = {};
    constructor(private userService: UserService, private alertifyService: AlertifyService,
        private route: ActivatedRoute) {}
    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.users = data['users'].result;
            this.pagination = data['users'].pagination;
        });
        this.userParams.gender = this.user.gender === "female" ? "male" : "female";
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.userParams.orderBy = 'lastActive';
    }
    pageChanged(event: any): void {
        this.pagination.currentPage = event.page;
        this.loadUsers();
      }
    resetFilters()
    {
        this.userParams.gender = this.user.gender === "female" ? "male" : "female";
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.loadUsers();
    }
    loadUsers() {
        this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
        .subscribe((res:PaginatedResult<User[]>) => {
            this.users = res.result;
            this.pagination = res.pagination;
        }, error => {
            this.alertifyService.errror(error);
        });
    }
}