import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageService } from './services/image.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HttpClientModule],
  providers: [ImageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'darts';

  constructor(private imageService: ImageService) { }

  public ngOnInit() {
    this.imageService.preloadImages();
  }
}