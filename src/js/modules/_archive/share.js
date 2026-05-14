export class Share {
  constructor(element) {
    this.element = element;

    this.element.onclick = () => {
      navigator.share({
        title: "Share",
        text: "Share",
        url: window.location.href,
      });
    };
  }

  transitionOut() {
    this.element.onclick = null;
  }
}

