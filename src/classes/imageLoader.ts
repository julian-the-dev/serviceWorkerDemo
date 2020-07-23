export type ImageData = {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
};

export class ImagesLoader {
  public getRandomImages(): Promise<ImageData[]> {
    return window
      .fetch("https://picsum.photos/v2/list?page=1&limit=10")
      .then((res) => res.json());
  }

  public loadImage(url: string): Promise<any> {
    return new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();
      request.open("GET", url);
      request.responseType = "blob";

      request.onload = function () {
        if (request.status == 200) {
          resolve(request.response);
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

      request.send();
    });
  }

  public insertImageToHtml(element: any, image: any): void {
    const myImage = document.createElement("img");
    const myFigure = document.createElement("figure");
    const myCaption = document.createElement("caption");
    const imageURL = window.URL.createObjectURL(image[0]);

    myImage.src = imageURL;
    myImage.setAttribute("alt", image[1].alt);
    myCaption.innerHTML =
      "<strong>" +
      image[1].alt.name +
      "</strong>: Taken by " +
      image[1].alt.credit;

    element.appendChild(myFigure);
    myFigure.appendChild(myImage);
    myFigure.appendChild(myCaption);
  }
}
