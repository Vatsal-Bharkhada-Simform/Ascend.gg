export const resizeCanvas = (canvas: HTMLCanvasElement): { width: number; height: number } => {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  const width = rect.width * dpr;
  const height = rect.height * dpr;
  
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  
  return { width, height };
};

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
};
