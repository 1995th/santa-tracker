export function createMarkerElement(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'santa-marker';
  
  const img = document.createElement('img');
  img.src = 'https://static.tiktokemoji.com/202411/09/wch3Esw3.webp';
  img.style.width = '60px';
  img.style.height = '60px';
  img.style.objectFit = 'contain';
  
  el.appendChild(img);
  el.style.width = '60px';
  el.style.height = '60px';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.zIndex = '9999';
  el.style.cursor = 'pointer';
  el.style.transition = 'transform 0.3s ease';
  
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.2)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
  });

  return el;
}