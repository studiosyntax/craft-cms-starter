import { Howl } from "howler";

const volume = 0.3;

class Sound {
  #howl;
  #isPlaying = false;
  #isPaused = false;
  #element;
  #state;
  #index;
  #onStateChange;
  #onSoundChange;

  constructor(element, state, index, onStateChange, onSoundChange) {
    this.#element = element;
    this.#state = state;
    this.#index = index;
    this.#onStateChange = onStateChange;
    this.#onSoundChange = onSoundChange;

    this.#initHowl();
    this.#bindClickHandler();
  }

  #initHowl() {
    this.#howl = new Howl({
      src: [this.#element.getAttribute("data-sound") || ""],
      volume: volume,
      onend: () => {
        this.#isPlaying = false;
        this.#state.toggleNumber();
        this.#state.handleEnd();
        this.#onStateChange(null);
      },
      onpause: () => {
        this.#isPaused = true;
        this.#state.toggleIcon();
      },
      onplay: () => {
        if (this.#isPaused) {
          this.#state.toggleIcon();
          this.#isPlaying = true;
          this.#isPaused = false;
        } else {
          this.#state.toggleNumber();
          this.#state.toggleIcon();
          this.#isPlaying = true;
          this.#isPaused = false;
          this.#onStateChange(this.#index);
        }
      },
    });
  }

  #bindClickHandler() {
    this.#element.onclick = () => this.handleClick();
  }

  handleClick() {
    this.#onSoundChange(this);

    if (this.#isPaused) {
      this.play();
    } else {
      if (this.#isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  }

  play() {
    this.#howl.play();
  }

  pause() {
    this.#howl.pause();
  }

  stop() {
    this.#howl.stop();
    if (this.#isPlaying || this.#isPaused) {
      this.#state.handleEnd();
    }
  }

  reset() {
    this.#howl.stop();

    this.#isPlaying = false;
    this.#isPaused = false;

    this.#state.handleEnd();

    if (this.#element.classList.contains("active")) {
      this.#element.classList.remove("active");
    }
  }

  cleanup() {
    this.#element.onclick = null;
  }
}

export class Playlist {
  #sounds = [];
  #activeIndex = null;
  #states = [];
  #currentSound = null;

  constructor(element) {
    this.element = element;
    this.#initStates();
    this.#initSounds();
  }

  #initStates() {
    this.#states = Array.from(
      this.element.querySelectorAll("[data-playlist='state']")
    ).map((state) => {
      const stateElement = state;
      return {
        state: stateElement,
        toggleNumber: () => {
          const isHidden =
            stateElement.children[0].style.visibility === "hidden";
          stateElement.children[0].style.visibility = isHidden
            ? "visible"
            : "hidden";
          stateElement.children[1].style.visibility = isHidden
            ? "hidden"
            : "visible";
        },
        toggleIcon: () => {
          const icons = Array.from(stateElement.children[1].children);
          const isHidden = icons[0].style.visibility === "hidden";

          icons[0].style.visibility = isHidden ? "visible" : "hidden";
          icons[1].style.visibility = isHidden ? "hidden" : "visible";
        },
        handleEnd: () => {
          stateElement.children[0].style.visibility = "visible";
          stateElement.children[1].style.visibility = "hidden";
          stateElement.children[1].children[1].style.visibility = "hidden";
          stateElement.children[1].children[0].style.visibility = "hidden";
        },
      };
    });

    this.#states.forEach((state) => {
      state.state.children[1].children[1].style.visibility = "hidden";
      state.state.children[1].children[0].style.visibility = "hidden";
    });
  }

  #initSounds() {
    const soundElements = Array.from(
      this.element.querySelectorAll("[data-sound]")
    );

    soundElements.forEach((element, index) => {
      const sound = new Sound(
        element,
        this.#states[index],
        index,
        this.#setActive.bind(this),
        this.#handleSoundChange.bind(this)
      );

      this.#sounds.push(sound);
    });
  }

  #handleSoundChange(sound) {
    if (this.#currentSound && this.#currentSound !== sound) {
      this.#currentSound.reset();
    }
    this.#currentSound = sound;
  }

  #setActive(index) {
    if (this.#activeIndex === index) return;
    if (this.#activeIndex !== null) {
      const elements = Array.from(
        this.element.querySelectorAll("[data-sound]")
      );
      elements[this.#activeIndex].classList.remove("active");
    }
    if (index !== null) {
      const elements = Array.from(
        this.element.querySelectorAll("[data-sound]")
      );
      elements[index].classList.add("active");
    }
    this.#activeIndex = index;
  }

  transitionOut() {
    this.#sounds.forEach((sound) => sound.cleanup());
  }

  resetAll() {
    this.#sounds.forEach((sound) => sound.reset());
    this.#activeIndex = null;
    this.#currentSound = null;
  }
}

