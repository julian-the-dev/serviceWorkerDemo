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
  public getRandomImages(): Promise<ImageData[]> {
    return window
      .fetch("https://picsum.photos/v2/list?page=1&limit=10")
      .then((res) => res.json());
  }

  public loadImage(imageData: ImageData): Observable<ImageResult> {
    return from(window.fetch(imageData.download_url).then(result => result.blob())).pipe(
      map((blob) => {
        console.log(blob);
        return { data: imageData, result: blob as Blob };
      })
    );
  }

  public insertImageToHtml(
    element: HTMLElement,
    imageResult: ImageResult
  ): void {
    const myImage = document.createElement("img");
    const myFigure = document.createElement("figure");
    const myCaption = document.createElement("caption");
    const imageURL = window.URL.createObjectURL(imageResult.result);

    myImage.src = imageURL;
    myImage.setAttribute("alt", imageResult.data.author);
    myCaption.innerHTML = "<strong>" + imageResult.data.id + "</strong>";

    element.appendChild(myFigure);
    myFigure.appendChild(myImage);
    myFigure.appendChild(myCaption);
  }
}
