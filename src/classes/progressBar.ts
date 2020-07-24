export class ProgressBarLoading {
  public numberOfElements: number = 0;
  public progress: number = 0;
  public progressDiv: Element;
  public progressBar: Element;

  init(element: Element, numberOfElements: number) {
    this.numberOfElements = numberOfElements;
    this.progressDiv = document.createElement("div");
    this.progressDiv.setAttribute("class", "progress");
    this.progressBar = document.createElement("div");
    this.progressBar.setAttribute("class", "progress-bar");
    this.progressBar.setAttribute("role", "progressbar");
    this.progressBar.setAttribute("style", "width: 0%");
    this.progressBar.setAttribute("aria-valuenow", this.progress.toString());
    this.progressBar.setAttribute("aria-valuemin", "0");
    this.progressBar.setAttribute("aria-valuemax", "100");
    this.progressDiv.appendChild(this.progressBar);
    element.appendChild(this.progressDiv);
  }

  increment() {
    this.progress++;
    this.progressBar.setAttribute("aria-valuenow", this.progress.toString());
    this.progressBar.setAttribute(
      "style",
      "width: " +
        ((this.progress / this.numberOfElements) * 100).toFixed(2) +
        "%"
    );
  }

  remove() {
    this.progressDiv.remove();
    this.progress = 0;
    this.numberOfElements = 0;
  }
}
