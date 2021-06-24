import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pattern } from '../models/pattern';
import { Position } from '../models/position';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatternLoaderService {

  constructor(private httpClient: HttpClient) { }

  loadJson(pattern: Pattern): Observable<Position[]> {
    return this.httpClient.get<Position[]>(pattern.file + '.json');
  }

  loadCsv(pattern: Pattern): Observable<Position[]> {
    const headers = new HttpHeaders({
      Accept: 'text/csv',
    });
    const options = { headers, responseType: 'text' as any  };
    return this.httpClient.get(pattern.file + '.csv', options).pipe(
      map(d => {
        const sVal =new String(d);
        const rows = sVal.split('\r\n');
        const cells = rows.map((r) => r.split(','));
        return cells.map(c => {
          const x = c[0];
          const y = c[1];

          return { x: parseInt(x), y: parseInt(y) };
        });
      })
    );
  }
}
