


export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const radian = (rotation * Math.PI) / 180;
    const { width, height } = pixelCrop;
  
    canvas.width = width;
    canvas.height = height;
  
    ctx.translate(width / 2, height / 2);
    ctx.rotate(radian);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
  
    return canvas.toDataURL("image/jpeg");
  }
  
  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
  