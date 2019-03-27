import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';

import { AgmCoreModule } from '@agm/core';
import { MapService } from './map.service';
@NgModule({
  declarations: [MapComponent],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDFGWsxFb8FqPscVSVww93kdlUbdyBUrOM'
      // apiKey: 'AIzaSyBpd58imJ4igvFwbHKqTyynIdZJqbDO7o0'
    })
  ],
  providers: [MapService],
  exports: [MapComponent]
})
export class MapModule {}
