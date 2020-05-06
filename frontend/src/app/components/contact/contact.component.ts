import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  public uiString: Map<String, String>;

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  map: google.maps.Map;
  lat = 48.188101;
  long = 16.340590;

  markers = [
    {
      position: new google.maps.LatLng(48.188101, 16.340590),
      map: this.map,
      title: "The Counsulting Company XX HQ"
    }
  ];

  coordinates = new google.maps.LatLng(this.lat, this.long);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 10
  };
  hqMarker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
    title: "Our headquarter - Open: Mon-Fri 8-16"
  });

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    this.hqMarker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: this.hqMarker.getTitle()
      });
      infoWindow.open(this.hqMarker.getMap(), this.hqMarker);
    });

    this.hqMarker.setMap(this.map);
  }

  constructor() { 
    this.uiString = AppComponent.uiStringFinal;
  }

  ngOnInit(): void {
  }

}
