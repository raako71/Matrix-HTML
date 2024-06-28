function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function setUp() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to match the viewport size
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  // Handle high DPI
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  const ratio = dpr / bsr;

  // Set canvas internal size to handle high DPI
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  // Set CSS styles to ensure canvas fills the viewport
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  // Scale the drawing context to match the ratio
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  // Store canvas and context globally if needed
  window.canvas = canvas;
  window.ctx = ctx;

  // Store width and height in window object for global access
  window.innerWidth = width;
  window.innerHeight = height;
}




function rain() {
	
  const width = window.innerWidth;
  const height = window.innerHeight;
  const alpha = "0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ";

  const fsize = 10;
  const font = `${fsize}pt 'Hack', 'Ubuntu Light', monospace`;
  const opacity = 0.05;

  // Spacing between glyphs
  const hspace = 1.1;
  const vspace = 1.3;
  // Glyph dimensions
  const glyphW = fsize * hspace;
  const glyphH = fsize * vspace;

  const numDrops = Math.floor(width / glyphW);

  // Unused (horizontal) canvas space
  const unused = width - numDrops * glyphW + fsize * (hspace - 1);
  
  // Initialize raindrops
  const drops = [];
  for (let i = 0; i < numDrops; i++) {
    const pos = randInt(0, height / glyphH) * glyphH;
    drops.push(-pos);
  }

  function resetShadow() {
    ctx.shadowColor = "";
    ctx.shadowBlur = 0;
  }

const colors = {
  blue: ['#EDFAFD', '#DAF5FB', '#C8F0F9', '#B6EBF7', '#A3E6F5', '#91E1F3'],
  yellow: ['#FFFFFF', '#FFFDEB', '#FFFBD6', '#FFF9C2', '#FFF7AD', '#FFF599'],
  grey: ['#FFFFFF', '#F5F5F5', '#EBEBEB', '#E0E0E0', '#D6D6D6']
};

const getRandomColor = () => {
  const rand = Math.random();
  if (rand < 0.6) {
    return colors.blue[Math.floor(Math.random() * colors.blue.length)];
  } else if (rand < 0.8) {
    return colors.yellow[Math.floor(Math.random() * colors.yellow.length)];
  } else {
    return colors.grey[Math.floor(Math.random() * colors.grey.length)];
  }
};

const color = (x, y) => {
  return getRandomColor();
};
/*
  const R = () => randInt(100, 250);
  const color = (x, y) => {
    const r = R() * y / height * 1.2 | 0;
    const g = R() | 0;
    const b = R() * ((height - y) * 2 / x) / (height/width) * 0.4 | 0;
    return `rgb(${0}, ${g}, ${0})`;
  };
 */
  
  const fps = 35;
  const fpsInterval = 2000 / fps;
  let then = Date.now();
  
  (loop = () => {
    requestAnimationFrame(loop);
    
    // Enforce fps
    const now = Date.now();
    const elapsed = now - then;
    if (elapsed <= fpsInterval) return;
    then = now - (elapsed % fpsInterval);

    // Redraw background
    resetShadow();
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.fillRect(0, 0, width, height);

    ctx.font = font;

    drops.map((y, i) => {
      const index = Math.floor(Math.random() * alpha.length);
      const char = alpha.charAt(index);
      const x = unused / 2 + i * glyphW;

      // Draw character
      ctx.fillStyle = color(x, y);
      ctx.fillText(char, x, y);

      // Reset if raindrop is some distance past bottom of screen
      const randHeight = randInt(height, height * 1.667);
      drops[i] = y > randHeight ? 0 : y + glyphH;
    });
  })();
}

(() => {
  setUp();
  rain();
})();