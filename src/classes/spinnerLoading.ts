export class SpinnerLoading {
  private id: string = "spinner";
  private spinnerElement: HTMLElement;

  addSpinner(element: HTMLElement) {
    this.spinnerElement = document.createElement("div");
    this.spinnerElement.setAttribute("id", this.id);
    this.spinnerElement.setAttribute("style", "background-color: orange;height: 500px;font-size: 40px;");
    this.spinnerElement.innerText = "Loading";
    element.appendChild(this.spinnerElement);
  }
  removeSpinner() {
    this.spinnerElement.remove();
  }
}
