import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
  public getRandomImages(): Promise<ImageData[]> {
    return window
      .fetch("https://picsum.photos/v2/list?page=1&limit=10")
      .then((res) => res.json());
  }

  public loadImage(imageData: ImageData): Observable<ImageResult> {
    return from(
      window.fetch(imageData.download_url).then((result) => {console.log(result);return result.blob();})
    ).pipe(
      map((blob) => {
        const data = { data: imageData, result: blob as Blob };
        console.log(data);
        this.cachedImages.push(data);
        return data;
      })
    );
  }

  public getCachedImages(): ImageResult[] {
    return this.cachedImages;
  }

  public insertImageToHtml(
    element: Element,
    imageResult: ImageResult
  ): void {
    const div = document.createElement("div");
    div.setAttribute("class", "col-md-4");
    const myImage = document.createElement("img")
    myImage.setAttribute("style", "width: 100%");
    const imageURL = window.URL.createObjectURL(imageResult.result);
    myImage.src = imageURL;
    myImage.setAttribute("alt", imageResult.data.author);
    element.appendChild(div);
    div.appendChild(myImage);
  }
}
