import { Character } from '../../types/Character';
import {Direction} from "../../types/Direction";
import {Line} from "../../types/Line";
import {drawCharacter} from "../../utils/drawCharacter";

export class Board {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  bounds: { upper: number; right: number; lower: number; left: number; };
  playerCharacter: Character;
  characters: Array<Character>;
  lines: Array<Line>
  horizontalLines: Array<Line>;
  verticalLines: Array<Line>;

  constructor(canvas: HTMLCanvasElement, playerCharacter: Character, lines: Array<Line>) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.bounds = { upper: 0, right: this.canvas.width, lower: this.canvas.height, left: 0 }
    this.playerCharacter = playerCharacter;
    this.characters = [playerCharacter];
    this.lines = lines;
    this.horizontalLines = lines.filter((line) => line.start.y === line.end.y);
    this.verticalLines = lines.filter((line) => line.start.x === line.end.x);
  }

  private willCharacterBeWithinBounds = (character:  Character, direction?: Direction) => {
    let isWithinBounds = false;
    const characterHitboxFromNextPosition = character.getHitboxFromNextPosition(direction);
    switch (direction || character.direction) {
      case 'up':
        if (
            characterHitboxFromNextPosition.top > this.bounds.upper &&
            (this.horizontalLines.every((line) => {
              return (
                line.start.y !== characterHitboxFromNextPosition.top
                || (characterHitboxFromNextPosition.right < line.start.x)
                || (characterHitboxFromNextPosition.left > line.end.x)
                )
              }))
          ) {
          isWithinBounds = true;
        }
        break;
      case 'right':
        if (
          characterHitboxFromNextPosition.right < this.bounds.right &&
          (this.verticalLines.every((line) => {
            return (
              line.start.x !== characterHitboxFromNextPosition.right
              || (characterHitboxFromNextPosition.bottom < line.start.y)
              || (characterHitboxFromNextPosition.top > line.end.y)
            )
          }))
        ) {
          isWithinBounds = true;
        }
        break;
      case 'down':
        if (
          characterHitboxFromNextPosition.bottom < this.bounds.lower &&
          (this.horizontalLines.every((line) => {
            return (
              line.start.y !== characterHitboxFromNextPosition.bottom
              || (characterHitboxFromNextPosition.right < line.start.x)
              || (characterHitboxFromNextPosition.left > line.end.x)
            )
          }))
        ) {
          isWithinBounds = true;
        }
        break;
      case 'left':
        if (
          characterHitboxFromNextPosition.left > this.bounds.left &&
          (this.verticalLines.every((line) => {
            return (
              line.start.x !== characterHitboxFromNextPosition.left
              || (characterHitboxFromNextPosition.bottom < line.start.y)
              || (characterHitboxFromNextPosition.top > line.end.y)
            )
          }))
        ) {
          isWithinBounds = true;
        }
        break;
      default:
        // do nothing;
        break;
    }
    return isWithinBounds;
  }

  private drawLines() {
    this.lines.forEach((line) => {
      this.context.beginPath();
      this.context.moveTo(line.start.x, line.start.y);
      this.context.lineTo(line.end.x, line.end.y);
      this.context.stroke();
    })
  }

  public updateCharacterDirection = (character: Character, newDirection: Direction) => {
    if (this.willCharacterBeWithinBounds(character, newDirection)) character.setDirection(newDirection);
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.characters.forEach((character) => {
      drawCharacter(this.context, character.position, character.radius);
      this.drawLines();
      if (this.willCharacterBeWithinBounds(character)) {
        character.updatePosition();
      }
    })
  }
}
