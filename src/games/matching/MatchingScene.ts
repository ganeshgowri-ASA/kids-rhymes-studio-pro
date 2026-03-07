import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, getLabel, ANIMAL_EMOJIS } from '../config';

interface Card {
  id: number;
  emoji: string;
  pairId: number;
  revealed: boolean;
  matched: boolean;
  bg: Phaser.GameObjects.Rectangle;
  face: Phaser.GameObjects.Text;
  back: Phaser.GameObjects.Text;
}

export default class MatchingScene extends Phaser.Scene {
  private cards: Card[] = [];
  private flipped: Card[] = [];
  private canFlip = true;
  private score = 0;
  private moves = 0;
  private pairs = 0;
  private totalPairs = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private movesText!: Phaser.GameObjects.Text;
  private lang = 'en';
  private difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  private stars: Phaser.GameObjects.Text[] = [];

  constructor() { super({ key: 'MatchingScene' }); }

  init(data: { language?: string; difficulty?: string }) {
    this.lang = data.language || 'en';
    this.difficulty = (data.difficulty as 'easy' | 'medium' | 'hard') || 'easy';
    this.score = 0;
    this.moves = 0;
    this.pairs = 0;
    this.cards = [];
    this.flipped = [];
  }

  create() {
    this.cameras.main.setBackgroundColor('#f5fff5');

    this.add.rectangle(GAME_WIDTH / 2, 30, GAME_WIDTH, 60, 0xa5d6a7).setAlpha(0.3);
    this.scoreText = this.add.text(GAME_WIDTH - 20, 10, `${getLabel(this.lang, 'score')}: 0`, {
      fontSize: '20px', color: '#2e7d32', fontStyle: 'bold',
    }).setOrigin(1, 0);
    this.movesText = this.add.text(20, 10, 'Moves: 0', {
      fontSize: '20px', color: '#2e7d32', fontStyle: 'bold',
    });

    for (let i = 0; i < 3; i++) {
      const star = this.add.text(GAME_WIDTH / 2 - 50 + i * 35, 8, '⭐', { fontSize: '24px' }).setAlpha(0.2);
      this.stars.push(star);
    }

    this.setupGrid();
  }

  private getGridSize(): { cols: number; rows: number } {
    if (this.difficulty === 'easy') return { cols: 3, rows: 2 }; // 3 pairs
    if (this.difficulty === 'medium') return { cols: 4, rows: 3 }; // 6 pairs
    return { cols: 4, rows: 4 }; // 8 pairs
  }

  private setupGrid() {
    const { cols, rows } = this.getGridSize();
    this.totalPairs = (cols * rows) / 2;

    const emojis = Phaser.Utils.Array.Shuffle([...ANIMAL_EMOJIS]).slice(0, this.totalPairs);

    // Create pairs
    const pairData: { emoji: string; pairId: number }[] = [];
    emojis.forEach((emoji, i) => {
      pairData.push({ emoji, pairId: i });
      pairData.push({ emoji, pairId: i });
    });
    Phaser.Utils.Array.Shuffle(pairData);

    const cardW = Math.min(100, (GAME_WIDTH - 80) / cols);
    const cardH = Math.min(100, (GAME_HEIGHT - 140) / rows);
    const startX = (GAME_WIDTH - cols * (cardW + 10)) / 2 + cardW / 2;
    const startY = 90 + cardH / 2;

    pairData.forEach((data, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + 10);
      const y = startY + row * (cardH + 10);

      const bg = this.add.rectangle(x, y, cardW - 4, cardH - 4, 0x66bb6a, 1)
        .setStrokeStyle(2, 0x388e3c)
        .setInteractive({ useHandCursor: true });

      const back = this.add.text(x, y, '❓', {
        fontSize: `${Math.min(cardW, cardH) * 0.5}px`,
      }).setOrigin(0.5);

      const face = this.add.text(x, y, data.emoji, {
        fontSize: `${Math.min(cardW, cardH) * 0.6}px`,
      }).setOrigin(0.5).setVisible(false);

      const card: Card = {
        id: i, emoji: data.emoji, pairId: data.pairId,
        revealed: false, matched: false, bg, face, back,
      };

      bg.on('pointerdown', () => this.flipCard(card));
      this.cards.push(card);
    });
  }

  private flipCard(card: Card) {
    if (!this.canFlip || card.revealed || card.matched) return;
    if (this.flipped.length >= 2) return;

    card.revealed = true;
    card.back.setVisible(false);
    card.face.setVisible(true);
    card.bg.setFillStyle(0xffffff);

    this.tweens.add({ targets: [card.bg, card.face], scaleX: 1.05, scaleY: 1.05, duration: 100, yoyo: true });

    this.flipped.push(card);

    if (this.flipped.length === 2) {
      this.moves++;
      this.movesText.setText(`Moves: ${this.moves}`);
      this.canFlip = false;

      const [a, b] = this.flipped;
      if (a.pairId === b.pairId) {
        // Match!
        this.pairs++;
        this.score += 50;
        this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);

        a.matched = true;
        b.matched = true;

        this.tweens.add({
          targets: [a.bg, a.face, b.bg, b.face],
          alpha: 0.6, duration: 400,
        });

        // Sparkle effect
        [a, b].forEach((c) => {
          const sparkle = this.add.text(c.bg.x, c.bg.y, '✨', { fontSize: '32px' }).setOrigin(0.5);
          this.tweens.add({ targets: sparkle, y: c.bg.y - 40, alpha: 0, duration: 600, onComplete: () => sparkle.destroy() });
        });

        this.flipped = [];
        this.canFlip = true;

        if (this.pairs >= this.totalPairs) {
          this.time.delayedCall(600, () => this.showResults());
        }
      } else {
        // No match - flip back
        this.time.delayedCall(800, () => {
          a.revealed = false;
          b.revealed = false;
          a.back.setVisible(true);
          a.face.setVisible(false);
          a.bg.setFillStyle(0x66bb6a);
          b.back.setVisible(true);
          b.face.setVisible(false);
          b.bg.setFillStyle(0x66bb6a);
          this.flipped = [];
          this.canFlip = true;
        });
      }
    }
  }

  private showResults() {
    // Fewer moves = better score
    const optimalMoves = this.totalPairs;
    const efficiency = Math.max(0, 1 - (this.moves - optimalMoves) / (optimalMoves * 3));
    const bonus = Math.round(efficiency * 100);
    this.score += bonus;
    this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);

    const earnedStars = efficiency > 0.7 ? 3 : efficiency > 0.4 ? 2 : 1;

    for (let i = 0; i < earnedStars; i++) {
      this.stars[i].setAlpha(1);
      this.tweens.add({ targets: this.stars[i], scaleX: 1.5, scaleY: 1.5, yoyo: true, duration: 300, delay: i * 200 });
    }

    const done = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `${getLabel(this.lang, 'done')}\n${getLabel(this.lang, 'score')}: ${this.score}\nMoves: ${this.moves}`, {
      fontSize: '28px', color: '#2e7d32', fontStyle: 'bold', align: 'center',
    }).setOrigin(0.5);

    this.tweens.add({ targets: done, scaleX: 1.1, scaleY: 1.1, duration: 500, yoyo: true, repeat: 1 });

    this.game.events.emit('gameComplete', { game: 'matching', score: this.score, stars: earnedStars });
  }
}
