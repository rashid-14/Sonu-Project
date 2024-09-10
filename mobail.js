let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Handle mouse move
    document.addEventListener('mousemove', (e) => {
      this.handleMove(e.clientX, e.clientY);
    });

    // Handle touch move
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.handleMove(touch.clientX, touch.clientY);
    }, { passive: false });

    // Handle mouse down
    paper.addEventListener('mousedown', (e) => {
      this.handleStart(e.clientX, e.clientY, e.button);
    });

    // Handle touch start
    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.handleStart(touch.clientX, touch.clientY, 0); // Treat touch as left-click (button 0)
    }, { passive: false });

    // Handle mouse up
    window.addEventListener('mouseup', () => {
      this.handleEnd();
    });

    // Handle touch end
    window.addEventListener('touchend', () => {
      this.handleEnd();
    }, { passive: false });
  }

  handleMove(clientX, clientY) {
    if (!this.holdingPaper) return;
    
    if (!this.rotating) {
      this.mouseX = clientX;
      this.mouseY = clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    const dirX = clientX - this.mouseTouchX;
    const dirY = clientY - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  handleStart(clientX, clientY, button) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    paper.style.zIndex = highestZ;
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
