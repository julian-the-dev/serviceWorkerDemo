import { ProgressBarLoading } from "./progressBar";
import { from, Observable, iif } from "rxjs";
import { map, delay } from "rxjs/operators";

export type ImageData = {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
};

export type ImageResult = {
  data: ImageData;
  result: Blob;
};

export class ImagesLoader {
  private cachedImages: ImageResult[] = [];
  public getRandomImages(): Observable<ImageData[]> {
    return from(
      window
        .fetch("https://picsum.photos/v2/list?page=1&limit=10")
        .then((res) => res.json())
    );
  }

  public loadImage(
    imageData: ImageData,
    progressBarLoading?: ProgressBarLoading
  ): Observable<ImageResult> {
    return from(
      window.fetch(imageData.download_url).then((result) => {
        return result.blob();
      })
    ).pipe(
      // add delay to add time to see the progress bar
      delay(Math.random() * 2000),
      map((blob) => {
        const data = { data: imageData, result: blob as Blob };
        this.cachedImages.push(data);
        if (progressBarLoading) {
          progressBarLoading.increment();
        }
        return data;
      })
    );
  }

  public getCachedImages(): ImageResult[] {
    return this.cachedImages;
  }

  public resetCachedImages(): void {
    this.cachedImages = [];
  }

  public insertImageToHtml(element: Element, imageResult: ImageResult): void {
    const div = document.createElement("div");
    div.setAttribute("class", "col-md-4");
    const myImage = document.createElement("img");
    myImage.setAttribute("style", "width: 100%");
    const imageURL = window.URL.createObjectURL(imageResult.result);
    myImage.src = imageURL;
    myImage.setAttribute("alt", imageResult.data.author);
    element.appendChild(div);
    div.appendChild(myImage);
  }
}
