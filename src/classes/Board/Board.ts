import { Character } from '../../types/Character';
import {Map} from "../../types/Map";
import {Line} from "../../types/Line";
import {drawCharacter} from "../../utils/drawCharacter";

export class Board {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  mapLines: Array<Line>;
  characters: Array<Character>;

  constructor(canvas: HTMLCanvasElement, map: Map, characters: Array<Character>) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.mapLines = [...map.horizontalLines, ...map.verticalLines];
    this.characters = characters;
  }

  private drawMap() {
    this.mapLines.forEach((line) => {
      this.context.beginPath();
      this.context.moveTo(line.start.x, line.start.y);
      this.context.lineTo(line.end.x, line.end.y);
      this.context.stroke();
    });
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMap();
    this.characters.forEach((character) => {
      drawCharacter(this.context, character.position, character.radius);
      character.updatePosition();
    })
  }
}
