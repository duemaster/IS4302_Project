import { Component } from '@angular/core';

import {ServiceDetailPage} from '../serviceDetail/serviceDetail';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ServiceDetailPage;

  constructor() {

  }
}
