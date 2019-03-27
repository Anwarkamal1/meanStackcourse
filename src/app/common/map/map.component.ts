import { Component, OnInit, Input } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  // lat: number = 51.678418;
  // lng: number = 7.090007;
  // @Input() location: string;
  // constructor(private mapService: MapService) {}
  // ngOnInit() {}
  // mapReadyHandler() {
  //   this.mapService.geocodeLocation(this.location).subscribe(coordinates => {
  //     this.lat = coordinates.lat;
  //     this.lng = coordinates.lng;
  //     console.log(coordinates);
  //   }, err => {
  //     console.log('err', err);
  //   });
  // }
  ngOnInit(){}
}
