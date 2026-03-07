import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, getLabel } from '../config';

interface PuzzlePiece {
  row: number;
  col: number;
  bg: Phaser.GameObjects.Rectangle;
  emoji: Phaser.GameObjects.Text;
  targetX: number;
  targetY: number;
  placed: boolean;
}

export default class PuzzleScene extends Phaser.Scene {
  private pieces: PuzzlePiece[] = [];
  private score = 0;
  private placedCount = 0;
  private totalPieces = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private elapsed = 0;
  private timerEvent?: Phaser.Time.TimerEvent;
  private lang = 'en';
  private difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  private stars: Phaser.GameObjects.Text[] = [];
  private dragPiece: PuzzlePiece | null = null;

  constructor() { super({ key: 'PuzzleScene' }); }

  init(data: { language?: string; difficulty?: string }) {
    this.lang = data.language || 'en';
    this.difficulty = (data.difficulty as 'easy' | 'medium' | 'hard') || 'easy';
    this.score = 0;
    this.placedCount = 0;
    this.elapsed = 0;
    this.pieces = [];
  }

  create() {
    this.cameras.main.setBackgroundColor('#fffdf5');

    this.add.rectangle(GAME_WIDTH / 2, 30, GAME_WIDTH, 60, 0xffcc80).setAlpha(0.3);
    this.scoreText = this.add.text(GAME_WIDTH - 20, 10, `${getLabel(this.lang, 'score')}: 0`, {
      fontSize: '20px', color: '#e65100', fontStyle: 'bold',
    }).setOrigin(1, 0);
    this.timerText = this.add.text(GAME_WIDTH / 2, 10, `${getLabel(this.lang, 'time')}: 0s`, {
      fontSize: '20px', color: '#e65100', fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    for (let i = 0; i < 3; i++) {
      const star = this.add.text(20 + i * 35, 8, '⭐', { fontSize: '24px' }).setAlpha(0.2);
      this.stars.push(star);
    }

    this.buildPuzzle();

    // Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000, loop: true,
      callback: () => {
        this.elapsed++;
        this.timerText.setText(`${getLabel(this.lang, 'time')}: ${this.elapsed}s`);
      },
    });
  }

  private getGridSize(): number {
    if (this.difficulty === 'easy') return 3;
    if (this.difficulty === 'medium') return 4;
    return 5;
  }

  private buildPuzzle() {
    const gridSize = this.getGridSize();
    this.totalPieces = gridSize * gridSize;

    // Create an image using emoji grid
    const PICTURE_EMOJIS = [
      ['🌳', '☀️', '🌈', '⭐', '🌙'],
      ['🏠', '🌻', '🦋', '🐦', '☁️'],
      ['🌷', '🐶', '🐱', '🐰', '🌺'],
      ['🍎', '🍊', '🍋', '🍇', '🍓'],
      ['🎈', '🎀', '🎵', '🎁', '🎪'],
    ];

    const puzzleSize = Math.min(350, GAME_HEIGHT - 160);
    const cellSize = puzzleSize / gridSize;
    const puzzleX = GAME_WIDTH / 2 - puzzleSize / 2;
    const puzzleY = 80;

    // Draw target grid (outline)
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(2, 0xffb74d, 0.5);
    for (let r = 0; r <= gridSize; r++) {
      gridGraphics.moveTo(puzzleX, puzzleY + r * cellSize);
      gridGraphics.lineTo(puzzleX + puzzleSize, puzzleY + r * cellSize);
    }
    for (let c = 0; c <= gridSize; c++) {
      gridGraphics.moveTo(puzzleX + c * cellSize, puzzleY);
      gridGraphics.lineTo(puzzleX + c * cellSize, puzzleY + puzzleSize);
    }
    gridGraphics.strokePath();

    // Create pieces and scatter them
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const targetX = puzzleX + c * cellSize + cellSize / 2;
        const targetY = puzzleY + r * cellSize + cellSize / 2;
        const emoji = PICTURE_EMOJIS[r % 5][c % 5];

        // Place pieces in scramble area (bottom)
        const scrambleX = Phaser.Math.Between(60, GAME_WIDTH - 60);
        const scrambleY = Phaser.Math.Between(puzzleY + puzzleSize + 40, GAME_HEIGHT - 40);

        const bg = this.add.rectangle(scrambleX, scrambleY, cellSize - 4, cellSize - 4, 0xffe0b2)
          .setStrokeStyle(2, 0xffb74d)
          .setInteractive({ useHandCursor: true, draggable: true });

        const emojiText = this.add.text(scrambleX, scrambleY, emoji, {
          fontSize: `${cellSize * 0.6}px`,
        }).setOrigin(0.5);

        const piece: PuzzlePiece = { row: r, col: c, bg, emoji: emojiText, targetX, targetY, placed: false };
        this.pieces.push(piece);

        // Draw hint emoji in grid (faint)
        this.add.text(targetX, targetY, emoji, {
          fontSize: `${cellSize * 0.4}px`,
        }).setOrigin(0.5).setAlpha(0.15);

        // Drag events
        bg.on('dragstart', () => { this.dragPiece = piece; });
        bg.on('drag', (_p: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          if (piece.placed) return;
          bg.setPosition(dragX, dragY);
          emojiText.setPosition(dragX, dragY);
        });
        bg.on('dragend', () => {
          if (piece.placed) return;
          this.checkSnap(piece);
          this.dragPiece = null;
        });
      }
    }
  }

  private checkSnap(piece: PuzzlePiece) {
    const dist = Phaser.Math.Distance.Between(piece.bg.x, piece.bg.y, piece.targetX, piece.targetY);
    const gridSize = this.getGridSize();
    const snapThreshold = (Math.min(350, GAME_HEIGHT - 160) / gridSize) * 0.5;

    if (dist < snapThreshold) {
      // Snap to position
      piece.bg.setPosition(piece.targetX, piece.targetY);
      piece.emoji.setPosition(piece.targetX, piece.targetY);
      piece.bg.setFillStyle(0xc8e6c9);
      piece.bg.setStrokeStyle(2, 0x4caf50);
      piece.placed = true;
      piece.bg.disableInteractive();
      this.placedCount++;
      this.score += 10;
      this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);

      // Sparkle
      const sparkle = this.add.text(piece.targetX, piece.targetY, '✨', { fontSize: '24px' }).setOrigin(0.5);
      this.tweens.add({ targets: sparkle, y: piece.targetY - 30, alpha: 0, duration: 500, onComplete: () => sparkle.destroy() });

      if (this.placedCount >= this.totalPieces) {
        this.time.delayedCall(300, () => this.showResults());
      }
    }
  }

  private showResults() {
    if (this.timerEvent) this.timerEvent.destroy();

    // Time-based bonus
    const timeLimit = this.totalPieces * 8;
    const timeBonus = Math.max(0, Math.round((1 - this.elapsed / timeLimit) * 100));
    this.score += timeBonus;
    this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);

    const earnedStars = this.elapsed < timeLimit * 0.5 ? 3 : this.elapsed < timeLimit * 0.8 ? 2 : 1;

    for (let i = 0; i < earnedStars; i++) {
      this.stars[i].setAlpha(1);
      this.tweens.add({ targets: this.stars[i], scaleX: 1.5, scaleY: 1.5, yoyo: true, duration: 300, delay: i * 200 });
    }

    // Celebration
    for (let i = 0; i < 10; i++) {
      const confetti = this.add.text(Phaser.Math.Between(50, GAME_WIDTH - 50), -20,
        Phaser.Utils.Array.GetRandom(['🎉', '🎊', '⭐', '✨', '🎈']), { fontSize: '28px' });
      this.tweens.add({
        targets: confetti, y: GAME_HEIGHT + 30,
        duration: Phaser.Math.Between(1500, 2500), delay: i * 100,
        onComplete: () => confetti.destroy(),
      });
    }

    const result = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2,
      `${getLabel(this.lang, 'done')}\n${getLabel(this.lang, 'score')}: ${this.score}\n${getLabel(this.lang, 'time')}: ${this.elapsed}s`, {
        fontSize: '28px', color: '#e65100', fontStyle: 'bold', align: 'center',
        backgroundColor: '#fff8e1', padding: { x: 20, y: 15 },
      }).setOrigin(0.5);
    this.tweens.add({ targets: result, scaleX: 1.1, scaleY: 1.1, yoyo: true, repeat: 1, duration: 400 });

    this.game.events.emit('gameComplete', { game: 'puzzle', score: this.score, stars: earnedStars });
  }
}
