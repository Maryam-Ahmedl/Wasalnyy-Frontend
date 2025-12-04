import { Component, OnInit } from '@angular/core';
import { HeaderBar } from '../header-bar/header-bar';
import { ComplaintService } from '../../services/complaint.service';
import { DatePipe } from '@angular/common';
import { ComplaintStatus } from '../../enums/complaint-status';

@Component({
  selector: 'app-complaint-history',
  imports: [HeaderBar,DatePipe],
  templateUrl: './complaint-history.html',
  styles: ``,
})
export class ComplaintHistory implements OnInit{
  
  complaintList:any[]=[];
  statusLabels:any  = {
    Pending: ComplaintStatus.Pending,
    UnderReview: ComplaintStatus.UnderReview,
    Resolved: ComplaintStatus.Resolved,
    Dismissed: ComplaintStatus.Dismissed,
    UserBanned: ComplaintStatus.UserBanned
  };

  constructor(private complaintService:ComplaintService){}
   
  ngOnInit(): void {
    this.complaintService.getOldComplaints().subscribe({next:(res:any)=>{
      this.complaintList=res;
      this.complaintList = this.complaintList.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log(this.complaintList);
    },error:err=>console.error(err)});
  }

  getStatusLabel(complaint:any) {
   
  switch (complaint.status) {
    case 0:
      return ComplaintStatus.Pending;
    case 1:
      return ComplaintStatus.UnderReview;
    case 2:
      return ComplaintStatus.Resolved;
    case 3:
      return ComplaintStatus.Dismissed;
    default:
      return ComplaintStatus.UserBanned;
  }

  }


  
}
