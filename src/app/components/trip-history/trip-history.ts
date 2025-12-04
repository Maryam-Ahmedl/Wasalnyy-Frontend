import { Component, OnInit } from '@angular/core';
import { HeaderBar } from '../header-bar/header-bar';
import { TripHistoryService } from '../../services/trip-history.service';
import { TripsHistoryDto } from '../../models/tripHistoryDto';
import { MapComponent } from '../map-component/map-component';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-history',
  imports: [HeaderBar,MapComponent,CurrencyPipe,DatePipe],
  templateUrl: './trip-history.html',
  styleUrl: `./trip-history.css`,
})
export class TripHistory implements OnInit{
 tripHistoryArr:any[]=[]
 requestBody:TripsHistoryDto={
 orderBy:"RequestedDate",
  descending:false,
  pageNumber:1,
  pageSize:10,
 }
  firstPage:boolean=true;
 lastPage:boolean=false;

 
  constructor(private tripHistoryService:TripHistoryService,private router:Router){}
ngOnInit(): void {
  this.tripHistoryService.requestTripHistory(this.requestBody).subscribe({next:(res:any)=>{
    this.tripHistoryArr=res.trips;
    if(this.tripHistoryArr.length<10){
    }
  },error:err=>{console.error(err);

  }})
}
getPreviousPage(){
  let value=this.requestBody.pageNumber;
  value--;
  this.requestBody.pageNumber=value;
      this.tripHistoryService.requestTripHistory(this.requestBody).subscribe({next:(res:any)=>{
        this.tripHistoryArr=res.trips;
        if(this.requestBody.pageNumber===1){
          this.firstPage=true;
        }
        this.lastPage=false;
        window.scrollTo(0, 0);
  },error:err=>{console.error(err);

  }})

}
getNextPage(){
let counter=this.requestBody.pageNumber;
counter++;
  this.requestBody.pageNumber=counter;
  console.log(this.requestBody);
    this.tripHistoryService.requestTripHistory(this.requestBody).subscribe({next:(res:any)=>{
        this.firstPage=false;
        this.lastPage=true;
         this.tripHistoryArr=res.trips;
        window.scrollTo(0, 0);
  },error:err=>{console.error(err);

  }})
}
onFilterChange(event:any){
    const orderByString = event.target.value;
  this.requestBody.orderBy=orderByString;
      this.tripHistoryService.requestTripHistory(this.requestBody).subscribe({next:(res:any)=>{
         this.tripHistoryArr=res.trips;
        window.scrollTo(0, 0);

  },error:err=>{console.error(err);

  }})

}
submitComplaint(tripId:string){
  this.router.navigate(['submit-complaint',tripId])
}
goToComplaints(){
  this.router.navigate(['view-complaints']);
}

}
