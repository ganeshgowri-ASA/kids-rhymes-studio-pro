import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, getLabel } from '../config';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Simplified stroke paths for letters (relative coordinates 0-1)
const LETTER_PATHS: Record<string, number[][]> = {
  A: [[0.2,1],[0.5,0],[0.8,1],[0.35,0.6],[0.65,0.6]],
  B: [[0.25,1],[0.25,0],[0.6,0],[0.7,0.15],[0.6,0.3],[0.25,0.5],[0.65,0.5],[0.75,0.65],[0.65,0.85],[0.6,1],[0.25,1]],
  C: [[0.75,0.15],[0.5,0],[0.3,0.15],[0.2,0.5],[0.3,0.85],[0.5,1],[0.75,0.85]],
  O: [[0.5,0],[0.25,0.15],[0.2,0.5],[0.25,0.85],[0.5,1],[0.75,0.85],[0.8,0.5],[0.75,0.15],[0.5,0]],
};

export default class AlphabetScene extends Phaser.Scene {
  private currentIndex = 0;
  private tracePoints: Phaser.Math.Vector2[] = [];
  private userPoints: Phaser.Math.Vector2[] = [];
  private drawing = false;
  private graphics!: Phaser.GameObjects.Graphics;
  private userGraphics!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private letterText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private score = 0;
  private totalLetters = 5;
  private lang = 'en';
  private stars: Phaser.GameObjects.Text[] = [];

  constructor() { super({ key: 'AlphabetScene' }); }

  init(data: { language?: string }) {
    this.lang = data.language || 'en';
    this.score = 0;
    this.currentIndex = 0;
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor('#fff5f5');

    // Title bar
    this.add.rectangle(GAME_WIDTH / 2, 30, GAME_WIDTH, 60, 0xffa0b4).setAlpha(0.3);
    this.scoreText = this.add.text(GAME_WIDTH - 20, 15, `${getLabel(this.lang, 'score')}: 0`, {
      fontSize: '20px', color: '#e91e63', fontStyle: 'bold',
    }).setOrigin(1, 0);

    this.instructionText = this.add.text(GAME_WIDTH / 2, 550, 'Trace the dotted letter!', {
      fontSize: '18px', color: '#888',
    }).setOrigin(0.5);

    // Star display
    for (let i = 0; i < 3; i++) {
      const star = this.add.text(20 + i * 35, 12, '⭐', { fontSize: '24px' }).setAlpha(0.2);
      this.stars.push(star);
    }

    this.graphics = this.add.graphics();
    this.userGraphics = this.add.graphics();

    this.letterText = this.add.text(GAME_WIDTH / 2, 120, '', {
      fontSize: '28px', color: '#e91e63', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.showLetter();

    // Input
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.y > 140 && p.y < 520) {
        this.drawing = true;
        this.userPoints = [];
        this.userGraphics.clear();
      }
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.drawing && p.y > 140 && p.y < 520) {
        this.userPoints.push(new Phaser.Math.Vector2(p.x, p.y));
        this.drawUserTrace();
      }
    });
    this.input.on('pointerup', () => {
      if (this.drawing) {
        this.drawing = false;
        this.evaluateTrace();
      }
    });
  }

  private showLetter() {
    const letter = LETTERS[this.currentIndex % LETTERS.length];
    this.letterText.setText(`Trace: ${letter} (${this.currentIndex + 1}/${this.totalLetters})`);
    this.graphics.clear();
    this.userGraphics.clear();
    this.userPoints = [];

    // Draw large dotted letter in center
    const centerX = GAME_WIDTH / 2;
    const centerY = 340;
    const size = 200;

    // Draw guide letter (large, faint)
    this.add.text(centerX, centerY, letter, {
      fontSize: '180px', color: '#fce4ec', fontStyle: 'bold',
    }).setOrigin(0.5).setName('guideLetter');

    // Draw trace dots
    this.tracePoints = [];
    const path = LETTER_PATHS[letter];
    if (path) {
      const ox = centerX - size / 2;
      const oy = centerY - size / 2;
      this.graphics.lineStyle(3, 0xe91e63, 0.3);
      for (let i = 0; i < path.length; i++) {
        const px = ox + path[i][0] * size;
        const py = oy + path[i][1] * size;
        this.tracePoints.push(new Phaser.Math.Vector2(px, py));
        this.graphics.fillStyle(0xe91e63, 0.4);
        this.graphics.fillCircle(px, py, 6);
      }
    } else {
      // For letters without paths, place dots in letter shape
      const points = 12;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const px = centerX + Math.cos(angle) * 80;
        const py = centerY + Math.sin(angle) * 80;
        this.tracePoints.push(new Phaser.Math.Vector2(px, py));
        this.graphics.fillStyle(0xe91e63, 0.4);
        this.graphics.fillCircle(px, py, 6);
      }
    }
  }

  private drawUserTrace() {
    this.userGraphics.clear();
    if (this.userPoints.length < 2) return;
    this.userGraphics.lineStyle(6, 0x4caf50, 0.8);
    this.userGraphics.beginPath();
    this.userGraphics.moveTo(this.userPoints[0].x, this.userPoints[0].y);
    for (let i = 1; i < this.userPoints.length; i++) {
      this.userGraphics.lineTo(this.userPoints[i].x, this.userPoints[i].y);
    }
    this.userGraphics.strokePath();
  }

  private evaluateTrace() {
    if (this.userPoints.length < 5) return;

    // Calculate accuracy: how many trace points are close to user's path
    let hits = 0;
    for (const tp of this.tracePoints) {
      for (const up of this.userPoints) {
        if (Phaser.Math.Distance.Between(tp.x, tp.y, up.x, up.y) < 30) {
          hits++;
          break;
        }
      }
    }
    const accuracy = this.tracePoints.length > 0 ? hits / this.tracePoints.length : 0.5;
    const points = Math.round(accuracy * 100);
    this.score += points;
    this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);

    // Show feedback
    const fb = accuracy > 0.7 ? getLabel(this.lang, 'perfect') : accuracy > 0.4 ? getLabel(this.lang, 'great') : getLabel(this.lang, 'tryAgain');
    const color = accuracy > 0.7 ? '#4caf50' : accuracy > 0.4 ? '#ff9800' : '#f44336';
    const feedback = this.add.text(GAME_WIDTH / 2, 500, `${fb} +${points}`, {
      fontSize: '24px', color, fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback, alpha: 0, y: 470, duration: 1000,
      onComplete: () => feedback.destroy(),
    });

    this.currentIndex++;
    if (this.currentIndex >= this.totalLetters) {
      this.time.delayedCall(1200, () => this.showResults());
    } else {
      // Remove old guide letter
      const old = this.children.getByName('guideLetter');
      if (old) old.destroy();
      this.time.delayedCall(800, () => this.showLetter());
    }
  }

  private showResults() {
    const maxScore = this.totalLetters * 100;
    const ratio = this.score / maxScore;
    const earnedStars = ratio > 0.8 ? 3 : ratio > 0.5 ? 2 : ratio > 0.2 ? 1 : 0;

    // Update star display
    for (let i = 0; i < earnedStars; i++) {
      this.stars[i].setAlpha(1);
      this.tweens.add({ targets: this.stars[i], scaleX: 1.5, scaleY: 1.5, yoyo: true, duration: 300, delay: i * 200 });
    }

    this.instructionText.setText(`${getLabel(this.lang, 'done')} ${getLabel(this.lang, 'score')}: ${this.score}`);

    // Emit completion event
    this.game.events.emit('gameComplete', { game: 'alphabet', score: this.score, stars: earnedStars });
  }
}
