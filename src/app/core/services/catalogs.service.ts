import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CatalogItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {
  private apiUrl = `${environment.apiUrl}/catalogs`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${this.apiUrl}/categories`);
  }

  getSampleTypes(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${this.apiUrl}/sample-types`);
  }

  getMeasurementUnits(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${this.apiUrl}/units`);
  }

  getTechniques(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${this.apiUrl}/techniques`);
  }
}
