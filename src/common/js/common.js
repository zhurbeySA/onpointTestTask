// logic for global layout state, swipe events and swipe draw function


// Draw and animate functions logic
// Global state, 1 - active slide
const globalState = [1, 0, 0];
const flipDown = document.body.querySelector('.flipDown');
const stateBar = document.body.querySelector('.stateBar');
const viewWindow = document.body.querySelector('.viewWindow');
const defaultStateBarTop = getComputedStyle(stateBar).top.slice(0, -2);
const defaultflipDownTop = getComputedStyle(flipDown).top.slice(0, -2);
let drawDirection;
let previousActivePageNumber;

// all elements which will be animated when the swipe event will trigger
const swipeAnimationElements = [...document.body.querySelectorAll('.swipeAnimation')];

const animate = ({
  timing,
  draw,
  duration,
}) => {
  const start = performance.now();

  const subAnimate = (time) => {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // current animation state
    const progress = timing(timeFraction);
    draw(progress); // отрисовать её

    if (timeFraction < 1) {
      requestAnimationFrame(subAnimate);
    }
  };

  requestAnimationFrame(subAnimate);
};

// Linear timing function
const linear = (timeFraction) => timeFraction;

const draw = (progress) => {
  if (drawDirection === 'down') {
    viewWindow.scrollTop = (previousActivePageNumber) * 768 + progress * 768;
    stateBar.style.top = `${+defaultStateBarTop + (previousActivePageNumber) * 768 + progress * 768}px`;
    flipDown.style.top = `${+defaultflipDownTop + (previousActivePageNumber) * 768 + progress * 768}px`;
  } else {
    viewWindow.scrollTop = (previousActivePageNumber) * 768 - progress * 768;
    stateBar.style.top = `${+defaultStateBarTop + (previousActivePageNumber) * 768 - progress * 768}px`;
    flipDown.style.top = `${+defaultflipDownTop + (previousActivePageNumber) * 768 - progress * 768}px`;
  }
};


// Swipe logic
let beginingTimeOfSwipe;
let drawingProcess;
let startX;
let startY;
const main = document.body.querySelector('main');

main.addEventListener('touchstart', (event) => {
  if (event.touches.length !== 1 || drawingProcess) {
    return;
  }

  // first touch coordinates
  startX = event.changedTouches[0].pageX;
  startY = event.changedTouches[0].pageY;
  beginingTimeOfSwipe = performance.now();
});

main.addEventListener('touchend', (event) => {
  if (event.touches.length !== 0 || drawingProcess) {
    return;
  }

  const deltaY = event.changedTouches[0].pageY - startY;
  const deltaX = event.changedTouches[0].pageX - startX;
  const timeOfTouch = performance.now() - beginingTimeOfSwipe;

  if (deltaY < -200 && timeOfTouch < 500 && Math.abs(deltaX) < 100) {
    // Swipe to the top
    // Change global state and draw changes after swipe event triggering
    let currentActivePageNumber;
    previousActivePageNumber = globalState.indexOf(1);
    if (previousActivePageNumber !== 2) {
      // swap two elements in array
      globalState[previousActivePageNumber] = 0;
      globalState[previousActivePageNumber + 1] = 1;
      drawDirection = 'down';
      currentActivePageNumber = previousActivePageNumber + 1;

      const slideStateNumberElements = document.body.querySelectorAll('.stateBar__slideNumber');
      slideStateNumberElements[previousActivePageNumber].classList.remove('stateBar__slideNumber_active');
      slideStateNumberElements[currentActivePageNumber].classList.add('stateBar__slideNumber_active');

      swipeAnimationElements[currentActivePageNumber].style.animation = 'swipeDown 1.5s linear 1';
      swipeAnimationElements[previousActivePageNumber].style.animation = 'swipeTop 1.5s linear 1';

      [
        swipeAnimationElements[currentActivePageNumber],
        swipeAnimationElements[previousActivePageNumber],
      ].forEach((item) => {
        const { parentNode } = item;
        parentNode.removeChild(item);
        parentNode.append(item);
      });

      if (currentActivePageNumber === 2) {
        flipDown.style.opacity = 0;
      }
    } else {
      return;
    }

    // Block new swipe triggers for 1.6 seconds
    drawingProcess = true;
    setTimeout(() => {
      drawingProcess = false;
    }, 1600);

    animate({
      timing: linear,
      draw,
      duration: 1500,
    });
  } else if (deltaY > 200 && timeOfTouch < 500 && Math.abs(deltaX) < 100) {
    // Swipe to the bottom
    // Change global state and draw changes after swipe event triggering
    let currentActivePageNumber;
    previousActivePageNumber = globalState.findIndex((arg) => arg === 1);
    if (previousActivePageNumber !== 0) {
      // swap two elements in array
      globalState[previousActivePageNumber] = 0;
      globalState[previousActivePageNumber - 1] = 1;
      drawDirection = 'top';
      currentActivePageNumber = previousActivePageNumber - 1;

      const slideStateNumberElements = document.body.querySelectorAll('.stateBar__slideNumber');
      slideStateNumberElements[previousActivePageNumber].classList.remove('stateBar__slideNumber_active');
      slideStateNumberElements[currentActivePageNumber].classList.add('stateBar__slideNumber_active');

      swipeAnimationElements[currentActivePageNumber].style.animation = 'swipeTop 1.5s linear 1';
      swipeAnimationElements[previousActivePageNumber].style.animation = 'swipeDown 1.5s linear 1';

      [
        swipeAnimationElements[currentActivePageNumber],
        swipeAnimationElements[previousActivePageNumber],
      ].forEach((item) => {
        const { parentNode } = item;
        parentNode.removeChild(item);
        parentNode.append(item);
      });

      if (currentActivePageNumber === 1) {
        flipDown.style.opacity = 1;
      }
    } else {
      return;
    }

    // Block new swipe triggers for 1.6 seconds
    drawingProcess = true;
    setTimeout(() => {
      drawingProcess = false;
    }, 1600);

    animate({
      timing: linear,
      draw,
      duration: 1500,
    });
  }
});
