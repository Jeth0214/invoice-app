import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'angular-dark-mode';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {

  darkMode$ = this.darkModeService.darkMode$;

  constructor(private darkModeService: DarkModeService) { }

  ngOnInit(): void {
  }

  onToggle(): void {
    this.darkModeService.toggle()
  }

}
