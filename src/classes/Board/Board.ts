import {Character} from "../../types/Character";
import {drawCharacter} from "../../utils/drawCharacter";

export class Board {
  canvas: HTMLCanvasElement;
  characters: Array<Character>;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, characters: Array<Character>) {
    this.canvas = canvas;
    this.characters = characters;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.characters.forEach((character) => {
      drawCharacter(this.context, character.position, character.radius);
      character.updatePosition();
    })
  }
}
