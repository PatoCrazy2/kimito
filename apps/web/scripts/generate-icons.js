const sharp = require("sharp");
const path = require("path");

const svgPath = path.join(__dirname, "../public/logo.svg");
const publicDir = path.join(__dirname, "../public");

// Generar icono 192x192
sharp(svgPath)
  .resize(192, 192)
  .png()
  .toFile(path.join(publicDir, "icon-192.png"))
  .then(() => console.log("icon-192.png generado!"))
  .catch((err) => console.error("Error al generar icon-192.png:", err));

// Generar icono 512x512
sharp(svgPath)
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, "icon-512.png"))
  .then(() => console.log("icon-512.png generado!"))
  .catch((err) => console.error("Error al generar icon-512.png:", err));

// Generar icono 512x512 maskable (con fondo crema y márgenes del 10% para Android)
sharp(svgPath)
  .resize(384, 384)
  .extend({
    top: 64,
    bottom: 64,
    left: 64,
    right: 64,
    background: "#FAF9F6",
  })
  .png()
  .toFile(path.join(publicDir, "icon-512-maskable.png"))
  .then(() => console.log("icon-512-maskable.png generado!"))
  .catch((err) => console.error("Error al generar icon-512-maskable.png:", err));
