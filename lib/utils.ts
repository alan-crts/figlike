import jsPDF from "jspdf";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

const adjectives = [
  "Happy",
  "Creative",
  "Energetic",
  "Lively",
  "Dynamic",
  "Radiant",
  "Joyful",
  "Vibrant",
  "Cheerful",
  "Sunny",
  "Sparkling",
  "Bright",
  "Shining",
];

const animals = [
  "Dolphin",
  "Tiger",
  "Elephant",
  "Penguin",
  "Kangaroo",
  "Panther",
  "Lion",
  "Cheetah",
  "Giraffe",
  "Hippopotamus",
  "Monkey",
  "Panda",
  "Crocodile",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomName(): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAdjective} ${randomAnimal}`;
}

export const getShapeInfo = (shapeType: string) => {
  switch (shapeType) {
    case "rect":
      return {
        icon: "/assets/rectangle.svg",
        name: "Rectangle",
      };

    case "circle":
      return {
        icon: "/assets/circle.svg",
        name: "Circle",
      };

    case "triangle":
      return {
        icon: "/assets/triangle.svg",
        name: "Triangle",
      };

    case "line":
      return {
        icon: "/assets/line.svg",
        name: "Line",
      };

    case "i-text":
      return {
        icon: "/assets/text.svg",
        name: "Text",
      };

    case "image":
      return {
        icon: "/assets/image.svg",
        name: "Image",
      };

    case "freeform":
      return {
        icon: "/assets/freeform.svg",
        name: "Free Drawing",
      };

    default:
      return {
        icon: "/assets/rectangle.svg",
        name: shapeType,
      };
  }
};

export const exportToPdf = () => {
  const canvas = document.querySelector("canvas");

  if (!canvas) return;

  // use jspdf
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  // get the canvas data url
  const data = canvas.toDataURL();

  // add the image to the pdf
  doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);

  // download the pdf
  doc.save("canvas.pdf");
};

export const exportToHtml = () => {

  const canvas = document.querySelector("canvas");

  
  const body = document.querySelector("body");

  // Global regex matches app:// followed by any characters except /
  let pattern = /app:\/\/[^\/]*/g;

  // Generate HTML & CSS. Remove any app:// prefixes from URLs.
  let html = `
  <!DOCTYPE HTML>
  <html lang="en-US">
    <head>
      <meta charset="utf-8" />
      <title>Maquette</title>
      <style>
        body { background-color: ${getComputedStyle(body as Element).backgroundColor}; }
      </style>
    </head>
    <body>
      ${canvas?.outerHTML}
      <script>
        function draw() {
          const canvas = document.querySelector("canvas");

          //copy canvas by DataUrl
          var sourceImageData = "${canvas?.toDataURL("image/png")}";
          var canvasContext = canvas.getContext('2d');

          var destinationImage = new Image;
          destinationImage.onload = function(){
            canvasContext.drawImage(destinationImage,0,0);
          };
          destinationImage.src = sourceImageData;
        }

        window.addEventListener("load", draw);
      </script>
    </body>
  </html>
`.replaceAll(pattern, "");

  const file = new Blob([html], { type: 'text/plain' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "canvas.html";
  link.click();
  URL.revokeObjectURL(link.href);

}
