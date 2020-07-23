import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";
import { ImagesLoader } from "./classes/imageLoader";
import { galleryImages } from "./constants/gallery.const";

const imagesLoader = new ImagesLoader();
galleryImages.forEach((image) => {
  imagesLoader.loadImage(image.url).then((response) => console.log(response));
});
