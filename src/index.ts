import { SpinnerLoading } from './classes/spinnerLoading';
import "bootstrap/dist/css/bootstrap.min.css";
import { forkJoin } from "rxjs";
//@ts-ignore
import runtime from "serviceworker-webpack-plugin/lib/runtime";
import "./app.css";
import { ImageData, ImageResult, ImagesLoader } from "./classes/imageLoader";
function importAll(r: any) {
  return r.keys().map(r);
}
importAll(require.context("./gallery", false, /\.(png|jpe?g|svg)$/));

if ("serviceWorker" in navigator) {
  runtime.register().then();
}

const imgSection = document.querySelector("section");
const imagesLoader = new ImagesLoader();
const spinnerLoading = new SpinnerLoading();

window.onload = function () {
  spinnerLoading.addSpinner(imgSection);
  imagesLoader.getRandomImages().then((images: ImageData[]) => {
    forkJoin(images.map(image => imagesLoader.loadImage(image))).subscribe((results: ImageResult[]) => {
      spinnerLoading.removeSpinner();
      results.forEach(imageResult => imagesLoader.insertImageToHtml(imgSection, imageResult));
    });
  });
};
