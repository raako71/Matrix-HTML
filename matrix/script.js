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
  const hspace = 0.3;
  const vspace = 0.9;
  // Glyph dimensions
  const glyphW = fsize * hspace;
  const glyphH = fsize * vspace;

  const numDrops = Math.floor(width / glyphW);

  // Unused (horizontal) canvas space
  const unused = width - numDrops * glyphW + fsize * (hspace - 1);
  
  // Initialize raindrops and colors
  const drops = [];
  const dropColors = [];
  const colors = {
      base: ['#E6BF79', '#B6EBF7', 'rgb(214 214 214)', '#FFF9C2'],
      accent: ['rgb(255 244 145)', 'rgb(119 234 244)','rgb(106 251 181)'],
    };
  
  const getRandomColor = () => {
    const rand = Math.random();
    if (rand < 0.71) {
      return colors.base[Math.floor(Math.random() * colors.base.length)];
    } else {
      return colors.accent[Math.floor(Math.random() * colors.accent.length)];
    }
  };

  for (let i = 0; i < numDrops; i++) {
    const pos = randInt(0, height / glyphH) * glyphH;
    drops.push(-pos);
    dropColors.push(getRandomColor()); // Assign a random color to each column
  }

  function resetShadow() {
    ctx.shadowColor = "";
    ctx.shadowBlur = 0;
  }

  const fps = 35;
  const fpsInterval = 5000 / fps;
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
    ctx.fillStyle = `rgba(35, 35, 35, ${opacity})`; // Example: Blue background with opacity
    ctx.fillRect(0, 0, width, height);

    ctx.font = font;

    drops.forEach((y, i) => {
      const index = Math.floor(Math.random() * alpha.length);
      const char = alpha.charAt(index);
      const x = unused / 2 + i * glyphW;

      // Draw character with the color for this column
      ctx.fillStyle = dropColors[i];
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
