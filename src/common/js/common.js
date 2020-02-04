// logic for global layout state, swipe events and swipe draw function


// Draw and animate functions logic
// Global state, 1 - active slide
const globalState = [1, 0, 0];
const flipDown = document.body.querySelector('.flipDown');
const stateBar = document.body.querySelector('.stateBar');
const viewWindow = document.body.querySelector('.viewWindow');
const pcSupport = document.body.querySelector('.pcSupport');
const defaultStateBarTop = getComputedStyle(stateBar).top.slice(0, -2);
const defaultFlipDownTop = getComputedStyle(flipDown).top.slice(0, -2);
const defaultPcSupportTop = getComputedStyle(pcSupport).top.slice(0, -2);
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

let scrollTopPosition;
let leftToScroll;
const draw = (progress) => {
  if (drawDirection === 'down') {
    viewWindow.scrollTop = scrollTopPosition + progress * leftToScroll;
    stateBar.style.top = `${+defaultStateBarTop + (previousActivePageNumber) * 768 + progress * 768}px`;
    flipDown.style.top = `${+defaultFlipDownTop + (previousActivePageNumber) * 768 + progress * 768}px`;
    pcSupport.style.top = `${+defaultPcSupportTop + (previousActivePageNumber) * 768 + progress * 768}px`;
  } else {
    viewWindow.scrollTop = scrollTopPosition - progress * leftToScroll;
    stateBar.style.top = `${+defaultStateBarTop + (previousActivePageNumber) * 768 - progress * 768}px`;
    flipDown.style.top = `${+defaultFlipDownTop + (previousActivePageNumber) * 768 - progress * 768}px`;
    pcSupport.style.top = `${+defaultPcSupportTop + (previousActivePageNumber) * 768 - progress * 768}px`;
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

// touchEnd and touchCancel events handler
const touchEndHandler = (event) => {
  if (event.touches.length !== 0 || drawingProcess) {
    return;
  }

  const deltaY = event.changedTouches[0].pageY - startY;
  const deltaX = event.changedTouches[0].pageX - startX;
  const timeOfTouch = performance.now() - beginingTimeOfSwipe;
  let currentActivePageNumber;

  if (deltaY < -200 && timeOfTouch < 500 && Math.abs(deltaX) < 100) {
    // Swipe to the top
    // Change global state and draw changes after swipe event triggering
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
      startX = 0;
      startY = 0;
      return;
    }

    startX = 0;
    startY = 0;
    // Block new swipe triggers for 1.6 seconds
    drawingProcess = true;
    setTimeout(() => {
      drawingProcess = false;
    }, 1600);

    scrollTopPosition = viewWindow.scrollTop;
    leftToScroll = Math.abs(currentActivePageNumber * 768 - scrollTopPosition);
    animate({
      timing: linear,
      draw,
      duration: 1500,
    });
  } else if (deltaY > 200 && timeOfTouch < 500 && Math.abs(deltaX) < 100) {
    // Swipe to the bottom
    // Change global state and draw changes after swipe event triggering
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
      startX = 0;
      startY = 0;
      return;
    }

    startX = 0;
    startY = 0;
    // Block new swipe triggers for 1.6 seconds
    drawingProcess = true;
    setTimeout(() => {
      drawingProcess = false;
    }, 1600);

    scrollTopPosition = viewWindow.scrollTop;
    leftToScroll = Math.abs(currentActivePageNumber * 768 - scrollTopPosition);
    animate({
      timing: linear,
      draw,
      duration: 1500,
    });
  }
};


main.addEventListener('touchend', touchEndHandler);
main.addEventListener('touchcancel', touchEndHandler);

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
main.addEventListener('touchmove', (event) => {
  event.preventDefault();
  const deltaY = startY - event.changedTouches[0].pageY;
  const deltaX = startX - event.changedTouches[0].pageX;

  // Scroll by Y axis
  // Scroll to the top (page moves to the bottom)
  if (viewWindow.scrollTop + windowHeight < (globalState.indexOf(1) + 1) * 768 && deltaY > 0) {
    const currentScrollTop = viewWindow.scrollTop + deltaY + windowHeight > (globalState.indexOf(1) + 1) * 768
      ? (globalState.indexOf(1) + 1) * 768 - windowHeight : viewWindow.scrollTop + deltaY;
    viewWindow.scrollTop = currentScrollTop;
  // Scroll to the bottom (page moves to the top)
  } else if (viewWindow.scrollTop > globalState.indexOf(1) * 768 && deltaY < 0) {
    const currentScrollTop = viewWindow.scrollTop + deltaY < globalState.indexOf(1) * 768
      ? globalState.indexOf(1) * 768 : viewWindow.scrollTop + deltaY;
    viewWindow.scrollTop = currentScrollTop;
  }

  // Scroll by X axis
  // Scroll to the left (page moves to the right)
  if (viewWindow.scrollLeft + windowWidth < 1024 && deltaX > 0) {
    const currentScrollLeft = viewWindow.scrollLeft + deltaX + windowWidth > 1024
      ? 1024 - windowWidth : viewWindow.scrollLeft + deltaX;
    viewWindow.scrollLeft = currentScrollLeft;
  // Scroll to the right (page moves to the left)
  } else if (viewWindow.scrollLeft > 0 && deltaX < 0) {
    const currentScrollLeft = viewWindow.scrollLeft + deltaX < 0
      ? 0 : viewWindow.scrollLeft + deltaX;
    viewWindow.scrollLeft = currentScrollLeft;
  }
});


// Support for PC (add click events)
const cancelButton = pcSupport.querySelector('.pcSupport__button_red');
const confirmButton = pcSupport.querySelector('.pcSupport__button_green');
const alert = pcSupport.querySelector('.pcSupport__alert');

const timerId = setTimeout(() => {
  pcSupport.style.opacity = '0';
  setTimeout(() => {
    pcSupport.remove();
  }, 1000);
}, 5000);

const clickDown = () => {
  if (drawingProcess) {
    return;
  }

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
    startX = 0;
    startY = 0;
    return;
  }

  startX = 0;
  startY = 0;
  // Block new swipe triggers for 1.6 seconds
  drawingProcess = true;
  setTimeout(() => {
    drawingProcess = false;
  }, 1600);

  scrollTopPosition = viewWindow.scrollTop;
  leftToScroll = Math.abs(currentActivePageNumber * 768 - scrollTopPosition);
  animate({
    timing: linear,
    draw,
    duration: 1500,
  });
};


const clickTop = () => {
  if (drawingProcess) {
    return;
  }

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
    startX = 0;
    startY = 0;
    return;
  }

  startX = 0;
  startY = 0;
  // Block new swipe triggers for 1.6 seconds
  drawingProcess = true;
  setTimeout(() => {
    drawingProcess = false;
  }, 1600);

  scrollTopPosition = viewWindow.scrollTop;
  leftToScroll = Math.abs(currentActivePageNumber * 768 - scrollTopPosition);
  animate({
    timing: linear,
    draw,
    duration: 1500,
  });
};

const cancelEvent = () => {
  clearTimeout(timerId);
  pcSupport.style.opacity = 0;
  setTimeout(() => {
    pcSupport.remove();
  }, 1000);
};
const confirmEvent = () => {
  clearTimeout(timerId);
  alert.style.opacity = '0';
  setTimeout(() => {
    alert.remove();
  }, 1000);

  cancelButton.removeEventListener('click', cancelEvent);
  confirmButton.removeEventListener('click', confirmEvent);

  cancelButton.addEventListener('click', clickDown);
  confirmButton.addEventListener('click', clickTop);
  cancelButton.style.backgroundColor = '#f78b1f';
  confirmButton.style.backgroundColor = '#f78b1f';
  cancelButton.style.color = '#3367ca';
  confirmButton.style.color = '#3367ca';

  alert.style.opacity = 0;
  setTimeout(() => {
    alert.remove();
  }, 1000);

  pcSupport.style.width = '120px';
  pcSupport.style.height = '50px';
};

cancelButton.addEventListener('click', cancelEvent);
confirmButton.addEventListener('click', confirmEvent);
