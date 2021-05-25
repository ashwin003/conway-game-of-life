import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Position } from '../models/position';
import * as p5 from 'p5';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() initialPositions: Position[] = [];
  @Input() isInteractive: boolean = false;
  @Input() isPlaying: boolean = true;

  grid: number[][] = [];
  boxSize = 10;
  margin = 10;
  nRows = 1;
  nCols = 1;
  canvas: any;
  constructor() {}

  ngOnChanges(changes: { [propName: string]: any }) {
    const initialPositionsChanged = Object.keys(changes).includes('initialPositions');
    if (initialPositionsChanged || (this.isInteractive && this.isPlaying)) {
      this.grid = this.prepareGrid(
        this.nRows,
        this.nCols,
        this.initialPositions
      );
    }
  }

  ngOnInit(): void {
    const sketch = (s: any) => {
      const canvasContainer = document.querySelector('#gol-canvas');

      const width = this.getWidth(canvasContainer),
        height = this.getHeight(canvasContainer);
      this.nRows = Math.floor(height / this.boxSize);
      this.nCols = Math.floor(width / this.boxSize);

      // Box Status: 0 is dead, 1 is alive
      s.setup = () => {
        s.frameRate(10);
        this.grid = this.setupCanvas(s, width, height, this.initialPositions);
      };

      s.draw = () => {
        this.drawGrid(s, this.grid, this.boxSize);

        if(this.isPlaying) {
          this.grid = this.update(this.grid);
        }
      };

      s.mousePressed = () => {
        if (this.isInteractive) {
          const { mouseX, mouseY } = s;
          const i = Math.floor(mouseX / this.boxSize);
          const j = Math.floor(mouseY / this.boxSize);

          this.grid[i][j] = 1 - this.grid[i][j];

          const position = {x: i, y: j};

          if(this.grid[i][j] === 1) {
            this.initialPositions.push(position);
          } else {
            const index = this.initialPositions.findIndex(p => p.x === position.x && p.y === position.y);
            if(index !== -1) {
              this.initialPositions.splice(index, 1);
            }
          }
        }
      };
    };

    this.canvas = new p5(sketch);
  }

  getWidth(canvasContainer: Element | null): number {
    return canvasContainer?.clientWidth! - 2 * this.margin;
  }

  getHeight(canvasContainer: Element | null): number {
    return canvasContainer?.clientHeight! - 2 * this.margin;
  }

  setupCanvas(
    s: any,
    width: number,
    height: number,
    positions: Position[]
  ): number[][] {
    const pCanvas = s.createCanvas(width, height);
    pCanvas.parent('gol-canvas');
    s.background(15, 15, 16);

    return this.prepareGrid(this.nRows, this.nCols, positions);
  }

  prepareBlankGrid(nRows: number, nCols: number): number[][] {
    let grid: number[][] = [];

    for (let i = 0; i < nCols; i++) {
      let row = [];
      for (let j = 0; j < nRows; j++) {
        row.push(0);
      }
      grid.push(row);
    }

    return grid;
  }

  prepareGrid(nRows: number, nCols: number, positions: Position[]): number[][] {
    let grid: number[][] = this.prepareBlankGrid(nRows, nCols);

    for (let i = 0; i < nCols; i++) {
      let row = [];
      for (let j = 0; j < nRows; j++) {
        const isFilled =
          positions.findIndex((p) => p.x === i && p.y === j) !== -1;
        grid[i][j] = isFilled ? 1 : 0;
      }
    }

    return grid;
  }

  drawGrid(s: any, grid: number[][], boxSize: number) {
    grid.forEach((cols, i) => {
      cols.forEach((cell, j) => {
        this.createBox(s, i, j, boxSize, cell === 1);
      });
    });
  }

  update(grid: number[][]): number[][] {
    const liveCells = this.sum(grid);
    if (liveCells > 0) {
      return this.updateGrid(grid);
    } else {
      return grid;
    }
  }

  /*
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  */
  updateGrid(grid: number[][]): number[][] {
    const nCols = grid.length,
      nRows = grid[0].length;

    const newGrid = this.prepareBlankGrid(nRows, nCols);

    grid.forEach((cols, i) => {
      cols.forEach((cell, j) => {
        const neighbours = this.getNeighbours(grid, i, j).reduce(
          (a, b) => a + b,
          0
        );

        if (neighbours < 2 || neighbours > 3) {
          newGrid[i][j] = 0; // Death
        } else if (neighbours === 3) {
          newGrid[i][j] = 1; // Reporoduction
        } else {
          newGrid[i][j] = grid[i][j];
        }
      });
    });

    return newGrid;
  }

  createBox(s: any, i: number, j: number, boxSize: number, isFilled: boolean) {
    const x = i * boxSize,
      y = j * boxSize;
    s.stroke(255);
    s.strokeWeight(0.5);
    s.fill(isFilled ? 255 : 0);
    s.rect(x, y, boxSize, boxSize);
  }

  getNeighbours(grid: number[][], x: number, y: number): number[] {
    const cols = grid.length,
      rows = grid[0].length;

    let neighbours: Position[] = [
      { x: x - 1, y: y - 1 },
      { x: x, y: y - 1 },
      { x: x + 1, y: y - 1 },

      { x: x - 1, y: y },
      { x: x + 1, y: y },

      { x: x - 1, y: y + 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];

    let filteredNeighbours = neighbours.filter((n) => {
      const yCheck = n.y >= 0 && n.y < rows;
      const xCheck = n.x >= 0 && n.x < cols;

      return xCheck && yCheck;
    });

    return filteredNeighbours.map((n) => grid[n.x][n.y]);
  }

  sum(array: number[][]): number {
    return array
      .reduce(function (a, b) {
        return a.concat(b);
      }) // flatten array
      .reduce(function (a, b) {
        return a + b;
      }); // sum
  }

  transpose(matrix: any[][]) {
    return matrix.reduce(
      (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
      []
    );
  }
}
