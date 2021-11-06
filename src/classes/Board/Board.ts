import {Character} from "../../types/Character";
import {drawCharacter} from "../../utils/drawCharacter";

export class Board {
  canvas: HTMLCanvasElement;
  bounds: { upper: number; right: number; lower: number; left: number; };
  characters: Array<Character>;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, characters: Array<Character>) {
    this.canvas = canvas;
    this.characters = characters;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.bounds = { upper: 0, right: this.canvas.width, lower: this.canvas.height, left: 0 }
  }

  private isCharacterWithinBounds = (character:  Character) => {
    const characterNextPosition = character.getNextPosition();
    return (
      characterNextPosition.y > this.bounds.upper + character.radius &&
      characterNextPosition.x < this.bounds.right- character.radius &&
      characterNextPosition.y < this.bounds.lower - character.radius &&
      characterNextPosition.x > this.bounds.left + character.radius
    );
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.characters.forEach((character) => {
      drawCharacter(this.context, character.position, character.radius);
      if (this.isCharacterWithinBounds(character)) {
        character.updatePosition();
      }
    })
  }
}
