import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pattern } from '../models/pattern';
import { Position } from '../models/position';
import { PatternLoaderService } from '../services/pattern-loader.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
  positions: Position[] = [];
  isInteractive: boolean = false;
  isPlaying: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private patternLoaderService: PatternLoaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'] ?? 'custom';
      if (id !== 'custom') {
        this.isInteractive = false;

        const pattern: Pattern = {
          name: 'Pattern Name',
          file: 'assets/patterns/' + id + '.json',
        };
        this.patternLoaderService
          .load(pattern)
          .subscribe((positions) => (this.positions = positions));

        this.isPlaying = true;
      } else {
        this.isInteractive = true;

        this.positions = [];

        this.isPlaying = false;
      }
    });
  }

  get buttonText() {
    return this.isPlaying ? 'pause' : 'play_arrow';
  }

  handleClick() {
    this.isPlaying = !this.isPlaying;
  }

  clearPositions() {
    if (this.isInteractive) {
      this.positions = [];
    }
  }
}
