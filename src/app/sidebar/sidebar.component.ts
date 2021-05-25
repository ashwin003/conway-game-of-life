import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  available_patterns = [
    { name: 'Glider', file: 'glider' },
    { name: 'Blinker', file: 'blinker' },
    { name: 'Acorn', file: 'acorn' },
    { name: 'F-Pentomino', file: 'f-pentomino' },
    { name: 'Gospel Glider Gun', file: 'gosper-glider-gun' },
    { name: 'Simkin Glider Gun', file: 'simkin-glider-gun' },
    { name: 'Space Rake', file: 'space-rake' },
    { name: 'P60 Glider Shuttle', file: 'p60-glider-shuttle' },
    { name: 'Pinwheel', file: 'pinwheel' },
    { name: 'Custom', file: 'custom' }
  ];

}
