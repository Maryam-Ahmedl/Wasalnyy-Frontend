import { Component, OnInit } from '@angular/core';
import { HeaderBar } from '../header-bar/header-bar';
import { ComplaintService } from '../../services/complaint.service';
import { ActivatedRoute } from '@angular/router';
import { ComplaintDto } from '../../models/complaint';
import { ComplaintCategory } from '../../enums/ComplaintCategory';
import { UserType } from '../../enums/userType';
import { AuthService } from '../../auth/auth-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-submit-complaint',
  imports: [HeaderBar,FormsModule],
  templateUrl: './submit-complaint.html',
  styles: ``,
})
export class SubmitComplaint implements OnInit {
  role:string='';
  complaintBody:ComplaintDto={   TripId: " ",
    Description: '',
    category:ComplaintCategory.Other,
    ComplainerType:UserType.Rider
  }
  errorState:boolean=false;
  errorMessage:string='';
  successState:boolean=false;
  timerCounter=5;
  complaintId='';

    constructor(private route:ActivatedRoute,private complaintService:ComplaintService,private authService:AuthService,
      private router:Router
    ){}
     
      categories = Object.entries(ComplaintCategory)
        .filter(([key, value]) => typeof value === 'number')
        .map(([key, value]) => ({ id: value as number, name: key }));
    
    
    ngOnInit() {
     this.role=this.authService.getRole()!;
     this.route.params.subscribe(params => {
        this.complaintBody.TripId= params['tripId']; 
        if(this.role==="Driver"){
          this.complaintBody.ComplainerType=UserType.Driver;
        }

      });
    }

    submitComplaint(){
      if(this.complaintBody.Description===''){
        this.errorState=true;
        this.errorMessage="Description field Required";
      }
      this.complaintService.submitComplaint(this.complaintBody).subscribe({next:(res:any)=>{
        console.log("complaint submitted");
        this.errorState=false;
        this.successState=true;
        this.complaintId=res.complaintId
        const myInterval=setInterval(()=>{
          if(this.timerCounter>1){
            this.timerCounter--;
          }
          else{
            this.router.navigate(['/dashboard']);
            clearInterval(myInterval);
          }
        },1000);
},error:err=>{
  console.error(err);
  this.errorState=true;
  this.errorMessage=err.error.message;

}})

    }

}
