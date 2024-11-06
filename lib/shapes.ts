import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
} from "@/types/type";

export const createRectangle = (pointer: PointerEvent) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createLine = (pointer: PointerEvent) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Line>
  );
};

export const createText = (pointer: PointerEvent, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4(),
  } as fabric.ITextOptions);
};

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);

    case "triangle":
      return createTriangle(pointer);

    case "circle":
      return createCircle(pointer);

    case "line":
      return createLine(pointer);

    case "text":
      return createText(pointer, "Tap to Type");
    case "button":
      return createEditableButton(pointer);
    default:
      return null;
  }
};

export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}: ImageUpload) => {
  const reader = new FileReader();

  reader.onload = () => {
    fabric.Image.fromURL(reader.result as string, (img) => {
      img.scaleToWidth(200);
      img.scaleToHeight(200);

      canvas.current.add(img);

      // @ts-ignore
      img.objectId = uuidv4();

      shapeRef.current = img;

      syncShapeInStorage(img);
      canvas.current.requestRenderAll();
    });
  };

  reader.readAsDataURL(file);
};

export const createShape = (
  canvas: fabric.Canvas,
  pointer: PointerEvent,
  shapeType: string
) => {
  if (shapeType === "freeform") {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(shapeType, pointer);
};

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  if (selectedElement.type === "group") {
    const [buttonRect, buttonText] = (
      selectedElement as fabric.Group
    ).getObjects();

    switch (property) {
      case "backgroundColor":
        (buttonRect as fabric.Rect).set("fill", value);
        break;
      case "textColor":
        (buttonText as fabric.Text).set("fill", value);
        break;
      case "borderRadius":
        (buttonRect as fabric.Rect).set({
          rx: parseInt(value),
          ry: parseInt(value),
        });
        break;
      case "buttonText":
        (buttonText as fabric.Text).set("text", value);
        break;
      default:
        selectedElement.set(property as keyof object, value);
    }
  } else {
    // Gestion existante pour les autres formes
    if (property === "width") {
      selectedElement.set("scaleX", 1);
      selectedElement.set("width", value);
    } else if (property === "height") {
      selectedElement.set("scaleY", 1);
      selectedElement.set("height", value);
    } else {
      selectedElement.set(property as keyof object, value);
    }
  }

  activeObjectRef.current = selectedElement;
  canvas.renderAll();
  syncShapeInStorage(selectedElement);
};

export const bringElement = ({
  canvas,
  direction,
  syncShapeInStorage,
}: ElementDirection) => {
  if (!canvas) return;

  // get the selected element. If there is no selected element or there are more than one selected element, return
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // bring the selected element to the front
  if (direction === "front") {
    canvas.bringToFront(selectedElement);
  } else if (direction === "back") {
    canvas.sendToBack(selectedElement);
  }

  // canvas.renderAll();
  syncShapeInStorage(selectedElement);

  // re-render all objects on the canvas
};

export const createEditableButton = (pointer: PointerEvent) => {
  const buttonRect = new fabric.Rect({
    width: 150,
    height: 50,
    fill: "#4CAF50",
    rx: 8,
    ry: 8,
  });

  const buttonText = new fabric.IText("Bouton", {
    fontSize: 20,
    fill: "#FFFFFF",
    textAlign: "center",
    originX: "center",
    originY: "center",
    fontFamily: "Arial",
    left: buttonRect.width! / 2,
    top: buttonRect.height! / 2,
  });

  const group = new fabric.Group([buttonRect, buttonText], {
    left: pointer.x,
    top: pointer.y,
    objectId: uuidv4(),
    subTargetCheck: true,
    selectable: true,
  } as fabric.IGroupOptions & { objectId: string });

  return group;
};
