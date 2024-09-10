let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.paper = null; // To reference the paper element
  }

  init(paper) {
    this.paper = paper;

    // Handle mouse move
    document.addEventListener('mousemove', (e) => this.handleMove(e.clientX, e.clientY));

    // Handle touch move
    document.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Prevent scrolling while dragging
      const touch = e.touches[0];
      this.handleMove(touch.clientX, touch.clientY);
    }, { passive: false });

    // Handle mouse down
    paper.addEventListener('mousedown', (e) => this.handleStart(e.clientX, e.clientY, e.button));

    // Handle touch start
    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.handleStart(touch.clientX, touch.clientY, 0); // Treat touch as left-click
    }, { passive: false });

    // Handle mouse up
    window.addEventListener('mouseup', () => this.handleEnd());

    // Handle touch end
    window.addEventListener('touchend', () => this.handleEnd());
  }

  handleMove(clientX, clientY) {
    if (!this.holdingPaper) return;

    this.mouseX = clientX;
    this.mouseY = clientY;

    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;

    if (!this.rotating) {
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
    }

    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    // Apply the movement and rotation to the paper element
    this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  handleStart(clientX, clientY, button) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.paper.style.zIndex = highestZ;
    highestZ += 1;

    this.mouseTouchX = clientX;
    this.mouseTouchY = clientY;
    this.prevMouseX = clientX;
    this.prevMouseY = clientY;

    if (button === 2) {
      this.rotating = true;
    }
  }

  handleEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

// Initialize papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
