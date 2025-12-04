import {
  Output,
  Component,
  AfterViewInit,
  OnInit,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges  ,
  ViewChild,        // ✅ ADD THIS
  ElementRef 
} from '@angular/core';

import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth-service';
import { Coordinates } from '../../models/trip-request.dto';

@Component({
  selector: 'app-map',
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css']
})
export class MapComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() firstPoint: Coordinates | null = null;
  @Input() secondPoint: Coordinates | null = null;

  @Output() locationEvent = new EventEmitter();
    @ViewChild('mapContainer', { static: false }) 
  mapContainer!: ElementRef;

  role: string | null = null;

  map!: L.Map;

  firstPointMarker?: L.Marker|null;
  secondPointMarker?: L.Marker|null;
  routeLayer?: L.Polyline | null;

   carIcon = L.icon({
  iconUrl: 'car.png',
  iconSize: [40, 40], 
  iconAnchor: [20, 20],               
  popupAnchor: [0, -20]               
});

   pinIcon = L.icon({
  iconUrl: 'pin.png',
  iconSize: [40, 40], 
  iconAnchor: [20, 20],               
  popupAnchor: [0, -20]               
});
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.role = this.authService.getRole();
  }

  ngAfterViewInit() {
    this.initMap();
    if(!this.firstPoint&&!this.secondPoint) this.clearMap();

  if (this.firstPoint) this.renderFirstPoint();
  if (this.secondPoint) this.renderSecondPoint();
  this.tryDrawRoute();

    if (this.role === 'Driver') {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const Lat = e.latlng.lat;
        const Lng = e.latlng.lng;

        this.locationEvent.emit({ Lat, Lng });

        this.firstPointMarker?.remove();
        this.firstPointMarker = L.marker([Lat, Lng]).addTo(this.map);

        this.firstPoint = { Lat, Lng };

        this.tryDrawRoute();
      });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
     if (!this.map) return;
  if (changes['firstPoint']) {
    this.renderFirstPoint();
  }
  if (changes['secondPoint']) {
    this.renderSecondPoint();
  }
  this.tryDrawRoute();
}


  private initMap() {
  this.map = L.map(this.mapContainer.nativeElement)
    .setView([30.0444, 31.2357], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);
}

private renderFirstPoint() {
  this.firstPointMarker?.remove();

  if (!this.firstPoint || this.firstPoint.Lat == null || this.firstPoint.Lng == null)
    return;

  const lat = Number(this.firstPoint.Lat);
  const lon = Number(this.firstPoint.Lng);

  if (isNaN(lat) || isNaN(lon)) return;


  this.firstPointMarker = L.marker([lat, lon], { icon: this.carIcon }).addTo(this.map);
}

  private renderSecondPoint() {
    this.secondPointMarker?.remove();


     if (!this.secondPoint || this.secondPoint.Lat == null || this.secondPoint.Lng == null)
    return;

    const lat = Number(this.secondPoint.Lat);
    const lon = Number(this.secondPoint.Lng);
  
    
     if (isNaN(lat) || isNaN(lon)) return;


    this.secondPointMarker = L.marker([lat, lon],{icon:this.pinIcon}).addTo(this.map);
  }

  private tryDrawRoute() {
    if (this.firstPoint && this.secondPoint) {
      try{

        this.drawRoute();
      }
      catch(error){
        console.error("error from draw route",error);
      }
      
    } else {
      this.clearRoute();
    }
  }


  private drawRoute() {
    if (!this.firstPoint || !this.secondPoint) return;
    
    const url = `https://router.project-osrm.org/route/v1/driving/${this.firstPoint.Lng},${this.firstPoint.Lat};${this.secondPoint.Lng},${this.secondPoint.Lat}?overview=full&geometries=geojson`;

    this.http.get<any>(url).subscribe({
      next: res => {
        const coords = res.routes[0].geometry.coordinates;
        const latlngs = coords.map((c: any) => [c[1], c[0]]);

        this.routeLayer?.remove();
        this.routeLayer = L.polyline(latlngs, { weight: 5, color: '#000000' })
          .addTo(this.map);

        this.map.fitBounds(this.routeLayer.getBounds());
      },
      error: err => console.error('Routing error', err)
    });
  }
private clearRoute(){
   if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
}
  private clearMap() {
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
    if(this.firstPointMarker) {
      this.map.removeLayer(this.firstPointMarker);
      this.firstPointMarker=null;
    }
    if(this.secondPointMarker) {
      this.map.removeLayer(this.secondPointMarker);
      this.secondPointMarker=null;
    }
  }
}
