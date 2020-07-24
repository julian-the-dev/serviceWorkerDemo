export class SpinnerLoading {
  private id: string = "spinner";
  private spinnerElement: HTMLElement;

  addSpinner(element: Element) {
    this.spinnerElement = document.createElement("div");
    this.spinnerElement.setAttribute(
      "style",
      "background-color: transparent;height: 500px;font-size: 40px;text-align: center;padding-top: 200px;"
    );
    this.spinnerElement.setAttribute("class", "col-lg-12");
    const spinnerLogo = document.createElement('div');
    spinnerLogo.setAttribute('role', 'status');
    spinnerLogo.setAttribute('class', 'spinner-border');
    this.spinnerElement.appendChild(spinnerLogo);
    element.appendChild(this.spinnerElement);
  }
  removeSpinner() {
    this.spinnerElement.remove();
  }
}
