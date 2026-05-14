import gsap, { easeMenu, easeVideo } from "../gsap";
import { Dom } from "../dom";

export class HomeVideo {
  name = "homevideo";

  trigger = null;
  darken;
  close;
  video;
  ctrls;
  thumb;
  ctrl = null;

  #isOpen = false;
  #isPlaying = false;
  #isMuted = false;
  #a_ctrl = null;

  constructor(element) {
    this.element = element;
    this.video = this.element.querySelector("video");

    gsap.set(this.element, {
      yPercent: 130,
    });

    this.close = this.element.querySelector("[data-video='close']");

    this.darken = this.element.querySelector("[data-video='darken']");

    this.thumb = this.element.querySelector("[data-video='thumb']");

    this.buildControls();

    this.element.onclick = () => this.toggleOpen();
    this.close.onclick = (e) => {
      e.stopPropagation();
      this.toggleClose();
    };
  }

  buildControls() {
    this.ctrl = this.element.querySelector("[data-video='ctrl']");

    gsap.set(this.ctrl.children, {
      autoAlpha: 0,
      yPercent: 100,
    });

    gsap.set(this.ctrl, {
      autoAlpha: 1,
    });

    const ctrl = this.ctrl;

    this.ctrls = {
      play: ctrl.querySelector("[data-video='play']"),
      volume: ctrl.querySelector("[data-video='volume']"),
      progressbar: ctrl.querySelector("[data-video='progressbar']"),
      progress: ctrl.querySelector("[data-video='progress']"),
      time: ctrl.querySelector("[data-video='time']"),
      volumectrl: ctrl.querySelector("[data-video='volumectrl']"),
      volumescale: ctrl.querySelector("[data-video='volumescale']"),
      togglePlay: () => this.ctrls.play.classList.toggle("toggle"),
      toggleMute: () => this.ctrls.volume.classList.toggle("toggle"),
    };

    this.ctrls.play.onclick = () => {
      this.ctrls.togglePlay();
      if (this.#isPlaying) {
        this.video.pause();
      } else {
        this.video.play();
      }
      this.#isPlaying = !this.#isPlaying;
    };

    this.ctrls.volume.onclick = () => {
      this.ctrls.toggleMute();
      if (this.#isMuted) {
        this.video.muted = false;
      } else {
        this.video.muted = true;
      }
      this.#isMuted = !this.#isMuted;
    };

    this.ctrls.volumectrl.onclick = (e) => {
      const rect = this.ctrls.volumectrl.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const percentage = (1 - clickY / rect.height) * 100;

      this.ctrls.volumescale.style.height = `${percentage}%`;
      this.video.volume = percentage / 100;
    };

    let isDragging = false;

    const updateProgress = (clientX) => {
      const rect = this.ctrls.progressbar.getBoundingClientRect();
      const clickPosition = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickPosition / rect.width));
      this.video.currentTime = this.video.duration * ratio;
    };

    this.ctrls.progressbar.onmousedown = (e) => {
      isDragging = true;
      updateProgress(e.clientX);
    };

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        updateProgress(e.clientX);
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    this.ctrls.progressbar.ontouchstart = (e) => {
      e.preventDefault();
      isDragging = true;
      updateProgress(e.touches[0].clientX);
    };

    this.ctrls.progressbar.ontouchmove = (e) => {
      if (isDragging) {
        e.preventDefault();
        updateProgress(e.touches[0].clientX);
      }
    };

    this.ctrls.progressbar.ontouchend = () => {
      isDragging = false;
    };

    this.ctrls.progressbar.onclick = null;

    this.video.ontimeupdate = () => {
      const ratio = this.video.currentTime / this.video.duration;
      this.ctrls.progress.style.transform = `scaleX(${ratio})`;

      const minutes = Math.floor(this.video.currentTime / 60);
      const seconds = Math.floor(this.video.currentTime % 60);
      this.ctrls.time.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };
  }

  async toggleOpen() {
    if (this.#isOpen) return;
    this.#isOpen = true;
    this.#isPlaying = true;
    this.video.play();

    Dom.carousel.animateOut(0.4);

    gsap.to(this.thumb, {
      autoAlpha: 0,
      duration: 0.3,
      ease: "linear",
    });

    await gsap.to(this.element, {
      width: "100vw",
      height: "100svh",
      margin: "0",
      ease: easeVideo,
      duration: 1.3,
    });

    gsap.to(this.close, {
      autoAlpha: 1,
      duration: 0.2,
      ease: "expo.out",
    });

    if (this.#a_ctrl) this.#a_ctrl.kill();
    this.#a_ctrl = gsap.to(this.ctrl.children, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.9,
      stagger: 0.06,
      ease: "expo.out",
    });
  }

  toggleClose() {
    if (!this.#isOpen) return;
    this.#isOpen = false;
    this.#isPlaying = false;

    Dom.carousel.animateIn();

    this.video.pause();

    gsap.to(this.close, {
      autoAlpha: 0,
      duration: 0.2,
      ease: "expo.out",
    });

    if (this.#a_ctrl) this.#a_ctrl.kill();
    this.#a_ctrl = gsap.to(this.ctrl.children, {
      autoAlpha: 0,
      yPercent: 100,
      duration: 0.3,
      ease: "expo.out",
    });

    gsap.to(this.element, {
      width: "9rem",
      height: "5rem",
      margin: "1rem",
      ease: easeVideo,
      delay: 0.02,
    });

    gsap.to(this.thumb, {
      autoAlpha: 1,
      duration: 0.2,
      ease: "linear",
      delay: 0.6,
    });
  }

  animateIn(delay = 0) {
    gsap.to(this.element, {
      yPercent: 0,
      duration: 0.4,
      ease: easeMenu,
      delay: delay,
    });
  }

  async transitionOut() {
    gsap.to(this.element, {
      autoAlpha: 0,
      duration: 0.4,
    });
  }
}

