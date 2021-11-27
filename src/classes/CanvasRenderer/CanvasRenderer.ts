import { RenderableBarrier } from "../../types/RenderableBarrier";
import { drawBarrier } from "../../utils/drawBarrier";
import { drawCircle } from "../../utils/drawCircle";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { Pellet } from "../Pellet/Pellet";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";

export class CanvasRenderer {
  cellSizeInPixels: number;
  canvasWidth: number;
  canvasHeight: number;
  contexts: {
    static: CanvasRenderingContext2D;
    dynamic: CanvasRenderingContext2D;
  };
  barriers: Array<RenderableBarrier>;

  constructor({ width, height }: { width: number; height: number; }, barriers: Array<RenderableBarrier>) {
    this.cellSizeInPixels = 20;
    this.barriers = barriers;
    this.canvasHeight = height * this.cellSizeInPixels;
    this.canvasWidth = width * this.cellSizeInPixels;
    const staticCanvas = document.createElement('canvas');
    const dynamicCanvas = document.createElement('canvas');
    const canvases = [staticCanvas, dynamicCanvas];
    canvases.forEach((canvas) => {
      canvas.style.position = 'absolute';
      canvas.style.top = '50%';
      canvas.style.left = '50%';
      canvas.style.transform = 'translate(-50%, -50%)';
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
    });
      
    document.body.appendChild(staticCanvas);
    document.body.appendChild(dynamicCanvas);

    this.contexts = {
      static: staticCanvas.getContext('2d') as CanvasRenderingContext2D,
      dynamic: dynamicCanvas.getContext('2d') as CanvasRenderingContext2D,
    };
    this.barriers.forEach((barrier) => drawBarrier(barrier.position, barrier.variant, this.contexts.static, this.cellSizeInPixels))
  }

  private clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  public update(pelletsToDraw: Array<Pellet>, playerCharacter: PlayerCharacter, nonPlayerCharacters: Array<NonPlayerCharacter>) {
    this.clearCanvas(this.contexts.dynamic);
    pelletsToDraw.forEach((pellet) => drawCircle(this.contexts.dynamic, pellet.getPosition(), pellet.getSize(), this.cellSizeInPixels));
    drawCircle(this.contexts.dynamic, playerCharacter.position, playerCharacter.getSize(), this.cellSizeInPixels);
    nonPlayerCharacters.forEach((character) => drawCircle(this.contexts.dynamic, character.getPosition(), character.getSize(), this.cellSizeInPixels));
  }

  // maybe barriers should be redrawn if a certain game mode is active and the color of the barriers needs to change
}