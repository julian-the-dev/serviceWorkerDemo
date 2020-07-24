import { forkJoin, Observable, of } from "rxjs";
//@ts-ignore
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import { ImageData, ImageResult, ImagesLoader } from "./classes/imageLoader";
import { ProgressBarLoading } from "./classes/progressBar";
import { SpinnerLoading } from "./classes/spinnerLoading";

function importAll(r: any) {
  return r.keys().map(r);
}
importAll(require.context("./gallery", false, /\.(png|jpe?g|svg)$/));
importAll(require.context("./", true, /\.(sa|sc|c)ss$/));

if ("serviceWorker" in navigator) {
  runtime.register();
}

const imgSection = document.querySelector("#imgHere");
const progressPos = document.querySelector("#progressHere");
const offlinePos = document.querySelector("#offlineButton");
const imagesLoader = new ImagesLoader();
const spinnerLoading = new SpinnerLoading();
const progressBarLoading = new ProgressBarLoading();

window.onload = function () {
  displayImages(imagesLoader.getRandomImages());
};

function displayImages(callToImages: Observable<ImageData[]>) {
  spinnerLoading.addSpinner(imgSection);
  callToImages.subscribe((images: ImageData[]) => {
    progressBarLoading.init(progressPos, images.length);
    forkJoin(
      images.map((image) => imagesLoader.loadImage(image, progressBarLoading))
    ).subscribe((results: ImageResult[]) => {
      spinnerLoading.removeSpinner();
      progressBarLoading.remove();
      offlinePos.appendChild(getOfflineButton());
      offlinePos.appendChild(getEmptyCache());
      results.forEach((imageResult) =>
        imagesLoader.insertImageToHtml(imgSection, imageResult)
      );
    });
  });
}

function getButton(config: any, text: string, func: Function): Element {
  const buttonElem = document.createElement("a");
  Object.keys(config).forEach((key) => {
    buttonElem.setAttribute(key, config[key]);
  });
  buttonElem.innerText = text;
  buttonElem.addEventListener("click", (event) => {
    event.preventDefault();
    func();
  });
  return buttonElem;
}

function getOfflineButton(): Element {
  return getButton(
    {
      class: "btn btn-primary my-2",
    },
    "OFFLINE",
    offline
  );
}

function getEmptyCache(): Element {
  return getButton(
    {
      class: "btn btn-primary my-2",
      style: "margin-left: 5px",
    },
    "EMPTY CACHE",
    emptyCache
  );
}

function clearChildren(element: Element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function offline() {
  clearChildren(offlinePos);
  clearChildren(imgSection);
  const callToImages = imagesLoader.getCachedImages().map((item) => item.data);
  imagesLoader.resetCachedImages();
  // The changes of order is introduced by the random delay
  displayImages(of(callToImages));
}

function emptyCache() {
  caches.delete("v1").then((result) => {
      alert(result ? "The cache has been deleted !" : "No cache found!");
  });
}
