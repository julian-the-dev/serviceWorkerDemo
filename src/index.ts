function importAll(r: any) {
  return r.keys().map(r);
}
importAll(require.context("./gallery", false, /\.(png|jpe?g|svg)$/));
import "bootstrap/dist/css/bootstrap.min.css";
//@ts-ignore
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import "./app.css";
import { ImageData, ImagesLoader } from "./classes/imageLoader";
import { ServiceWorker } from "./classes/serviceWorker";


if ('serviceWorker' in navigator) {
  runtime.register().then();
}

const imgSection = document.querySelector("section");
const serviceWorker = new ServiceWorker();
const imagesLoader = new ImagesLoader();

imagesLoader.getRandomImages().then((images: ImageData[]) => {
  images.forEach((image) => {
    imagesLoader.loadImage(image).then((response) => {
      console.log(response);
      imagesLoader.insertImageToHtml(imgSection, response);
    });
  });
});
