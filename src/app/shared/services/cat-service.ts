import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICat } from '../models/icat';
import { map, Observable } from 'rxjs';
import { ICatAPIResponse } from '../models/icat-api-response';
import { ICatInfo } from '../models/icat-info';

@Injectable({
  providedIn: 'root',
})
export class CatService {
  private readonly http = inject(HttpClient);

  getAllCats(): Observable<ICat[]> {
    return this.http.get<ICatAPIResponse<ICat[]>>('api/list').pipe(
      map(response => response.data)
    );
  }

  getCatById(id: string): Observable<ICat> {
    return this.http.get<ICat>(`api/cats/${id}`);
  }

  createCat(cat: ICatInfo): Observable<ICat> {
    const JSON_HEADERS = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<ICat>('/api/create', cat);
  }

  updateCat(catId: string | undefined, cat: ICatInfo): Observable<ICat> {
    return this.http.put<ICat>(`api/update?id=${catId}`, cat);
  }

  deleteCat(id: string): Observable<ICat> {
    return this.http.delete<ICat>(`api/delete?id=${id}`);
  }
}
