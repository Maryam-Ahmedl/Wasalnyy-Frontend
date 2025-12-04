import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../auth/auth-service';
import { environment } from '../../enviroments/enviroment';
import { TripInfoService } from './trip-info.service';
import { AccountDataService } from './account-data.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrServiceTs {
  hubUrl: string = environment.hubUrl;
  userRole:string="";
  private hubConnection!: signalR.HubConnection;
  public connectionStarted = false;
  constructor(private authService: AuthService,private tripInfoService:TripInfoService,private accountDataService:AccountDataService) {
    this.userRole=this.authService.getRole()!;
   }
  
  startConnection(): Promise<void> {
    return new Promise((resolve, reject) => {


      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          accessTokenFactory: () => this.authService.getToken()!})
        .build();

//        .withAutomaticReconnect()
          this.hubConnection.on("pendingTrip", (trip) => {
            console.log("pending",trip);
            this.tripInfoService.updateTrip(trip);
            this.tripInfoService.setInTrip(true);
            if(trip.tripStatus==="Accepted"){
            
              const driverId=trip.driverId;
              if(this.userRole==="Rider"){
                        this.accountDataService.getDriverData(driverId).subscribe({next:res=>{
              this.tripInfoService.updateDriver(res)
            }
          ,error:err=>{console.error(err)}
          })

              }
    
            }
            
          });
          this.hubConnection.on('tripRequested',trip=>{
            this.tripInfoService.updateTrip(trip)})

          this.hubConnection.on('tripConfirmed',trip=>{
            this.tripInfoService.updateTrip(trip)})
          
              this.hubConnection.on('tripCanceled',trip=>{
             this.tripInfoService.updateTrip(trip);
             this.tripInfoService.setInTrip(false);
            this.tripInfoService.clearDriver();
            this.tripInfoService.clearListOfAvailableTrips();
              })
              this.hubConnection.on("tripUnAvilable",tripId=>{
                this.tripInfoService.removeTripFromListOfAvailableTrips(tripId);
              })
            
            
          this.hubConnection.on('tripStarted', trip => {
            this.tripInfoService.updateTrip(trip)
          });
          this.hubConnection.on('tripLocationUpdated', coords =>{
            this.tripInfoService.updateTripCoords(coords)});

          this.hubConnection.on('tripEnded', trip =>{
            this.tripInfoService.updateTrip(trip);
            this.tripInfoService.setInTrip(false);
            this.tripInfoService.clearDriver();
            this.tripInfoService.clearListOfAvailableTrips();
          });      
          this. hubConnection.on('tripAccepeted', driver=> {
            this.tripInfoService.updateDriver(driver)}
          
          );
          this. hubConnection.on('yourDriverLocationUpdated', coords=>this.tripInfoService.updateDriverCoords(coords));
          
         this.hubConnection.on("availableTripsInZone", (trip) =>{
          
          this.tripInfoService.updateListOfAvailableTrips(trip);
          setTimeout(()=>{
            this.tripInfoService.removeTripFromListOfAvailableTrips(trip.id);
          },10000)
        });
          


      this.hubConnection
        .start()
        .then(() => {

          
          console.log('SignalR Connected');
          this.connectionStarted = true;
             resolve();
        })
        .catch((err) => {
          console.error('Error while starting SignalR:', err);
          reject(err);
        });
    });
  }

  endConnection(): Promise<void> {
     return new Promise((resolve, reject) => {
          if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() =>{ 
          console.log('SignalR Disconnected');
          this.connectionStarted = false;
          resolve();
        }
      
      )
        .catch((err) => {
          console.log('Error while disconnecting SignalR:', err); 
          reject(err);
        });
    }


     })

  }
}
