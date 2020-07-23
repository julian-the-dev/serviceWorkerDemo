import { forkJoin } from "rxjs";
//@ts-ignore
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import { ImageData, ImageResult, ImagesLoader } from "./classes/imageLoader";
import { SpinnerLoading } from "./classes/spinnerLoading";

function importAll(r: any) {
  return r.keys().map(r);
}
importAll(require.context("./gallery", false, /\.(png|jpe?g|svg)$/));
importAll(require.context("./", true, /\.(sa|sc|c)ss$/));

if ("serviceWorker" in navigator) {
  runtime.register().then();
}

const imgSection = document.querySelector("#imgHere");
const offlinePos = document.querySelector("#offlineButton");
const imagesLoader = new ImagesLoader();
const spinnerLoading = new SpinnerLoading();

window.onload = function () {
  spinnerLoading.addSpinner(imgSection);
  imagesLoader.getRandomImages().then((images: ImageData[]) => {
    forkJoin(images.map((image) => imagesLoader.loadImage(image))).subscribe(
      (results: ImageResult[]) => {
        spinnerLoading.removeSpinner();
        offlinePos.appendChild(getOfflineButton());
        results.forEach((imageResult) =>
          imagesLoader.insertImageToHtml(imgSection, imageResult)
        );
      }
    );
  });
};

function getOfflineButton(): Element {
  const offline = document.createElement("a");
  offline.setAttribute("class", "btn btn-primary my-2");
  offline.innerText = "OFFLINE";
  offline.addEventListener("click", (event) => {
    event.preventDefault();
    goOffline();
  });
  return offline;
}

function clearChildren(element: Element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function goOffline() {
  clearChildren(imgSection);
  spinnerLoading.addSpinner(imgSection);
  const cachedImages = imagesLoader.getCachedImages();

  forkJoin(
    cachedImages.map((cachedImage) => imagesLoader.loadImage(cachedImage.data))
  ).subscribe((results: ImageResult[]) => {
    spinnerLoading.removeSpinner();
    results.forEach((imageResult) =>
      imagesLoader.insertImageToHtml(imgSection, imageResult)
    );
  });
}
