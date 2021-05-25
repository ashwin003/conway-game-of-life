import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pattern } from '../models/pattern';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root'
})
export class PatternLoaderService {

  constructor(private httpClient: HttpClient) { }

  load(pattern: Pattern): Observable<Position[]> {
    return this.httpClient.get<Position[]>(pattern.file);
  }
}
