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

  public loadImage(imageData: ImageData): Promise<ImageResult> {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open("GET", imageData.download_url);
      request.responseType = "blob";

      request.onload = function () {
        if (request.status == 200) {
          resolve({ data: imageData, result: request.response });
        } else {
          reject(
            Error(
              "Image didn't load successfully; error code:" + request.statusText
            )
          );
        }
      };

      request.onerror = function () {
        reject(Error("There was a network error."));
      };

      // Send the request
      request.send();
    });
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
