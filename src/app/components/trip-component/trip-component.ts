import { Component ,EventEmitter,Input ,OnInit,Output} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth-service';
import { TripStatus } from '../../enums/tripStatus';

@Component({
  selector: 'app-trip-component',
  imports: [CurrencyPipe],
  templateUrl: './trip-component.html',
  styles: ``,
})
export class TripComponent implements OnInit {

  role:string|null=null;
  @Input() activeTrip:any|null;
  @Output() confirmTripRequest=new EventEmitter<any>();
  @Output() acceptTrip=new EventEmitter<any>();
  @Output() startTrip=new EventEmitter<any>();
  @Output() endTrip=new EventEmitter<any>();
  @Output() cancelTrip=new EventEmitter<any>();
  
   constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.role=this.authService.getRole()
  }
  confirmRequest(){
        this.confirmTripRequest.emit(this.activeTrip.id);
  }
  accepttrip(){
        this.acceptTrip.emit(this.activeTrip.id);
  }
  starttrip(){
    this.startTrip.emit(this.activeTrip.id);
  }
  endtrip(){
    this.endTrip.emit(this.activeTrip.id);
  }
  canceltrip(){
    this.cancelTrip.emit(this.activeTrip.id);
  }
}
