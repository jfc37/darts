import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, of, tap } from 'rxjs';

interface CachedImage {
  url: string;
  blob: Blob;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private _cacheUrls: string[] = [];
  private _cachedImages: CachedImage[] = [];

  constructor(private http: HttpClient) { }

  public preloadImages(): void {
    const allImages = [
      "img/andy.jpg",
      "img/chris.jpg",
      "img/rich.jpg",
      "img/joe.jpg",
      'img/question-mark.jpg'
    ];
    this.getImages(allImages).subscribe();
  }

  getImage(url: string) {
    const index = this._cachedImages.findIndex(image => image.url === url);
    if (index > -1) {
      const image = this._cachedImages[index];
      return of(URL.createObjectURL(image.blob));
    }
    return this.http.get(url, { responseType: `blob` }).pipe(
      tap(blob => this.checkAndCacheImage(url, blob)),
      map(blob => URL.createObjectURL(blob)),
    );
  }

  public getImages(urls: string[]) {
    return forkJoin(urls.map(x => this.getImage(x)));
  }

  checkAndCacheImage(url: string, blob: Blob) {
    this._cachedImages.push({ url, blob });
  }

  set cacheUrls(urls: string[]) {
    this._cacheUrls = [...urls];
  }
  get cacheUrls(): string[] {
    return this._cacheUrls;
  }
  set cachedImages(image: CachedImage) {
    this._cachedImages.push(image);
  }
}
