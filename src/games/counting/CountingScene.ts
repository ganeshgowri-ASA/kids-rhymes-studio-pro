import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, getLabel, getNumberWord, FRUIT_EMOJIS } from '../config';

export default class CountingScene extends Phaser.Scene {
  private score = 0;
  private level = 1;
  private targetCount = 0;
  private tappedCount = 0;
  private objects: Phaser.GameObjects.Text[] = [];
  private scoreText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private promptText!: Phaser.GameObjects.Text;
  private countText!: Phaser.GameObjects.Text;
  private lang = 'en';
  private difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  private rounds = 0;
  private maxRounds = 5;
  private stars: Phaser.GameObjects.Text[] = [];

  constructor() { super({ key: 'CountingScene' }); }

  init(data: { language?: string; difficulty?: string }) {
    this.lang = data.language || 'en';
    this.difficulty = (data.difficulty as 'easy' | 'medium' | 'hard') || 'easy';
    this.score = 0;
    this.level = 1;
    this.rounds = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#f0f4ff');

    this.add.rectangle(GAME_WIDTH / 2, 30, GAME_WIDTH, 60, 0x90caf9).setAlpha(0.3);
    this.scoreText = this.add.text(GAME_WIDTH - 20, 10, `${getLabel(this.lang, 'score')}: 0`, {
      fontSize: '20px', color: '#1565c0', fontStyle: 'bold',
    }).setOrigin(1, 0);

    this.levelText = this.add.text(20, 10, `${getLabel(this.lang, 'level')}: 1`, {
      fontSize: '20px', color: '#1565c0', fontStyle: 'bold',
    });

    for (let i = 0; i < 3; i++) {
      const star = this.add.text(GAME_WIDTH / 2 - 50 + i * 35, 8, '⭐', { fontSize: '24px' }).setAlpha(0.2);
      this.stars.push(star);
    }

    this.promptText = this.add.text(GAME_WIDTH / 2, 80, '', {
      fontSize: '24px', color: '#333', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.countText = this.add.text(GAME_WIDTH / 2, 550, '', {
      fontSize: '28px', color: '#4caf50', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.spawnRound();
  }

  private getMaxNumber(): number {
    if (this.difficulty === 'easy') return 5;
    if (this.difficulty === 'medium') return 10;
    return 20;
  }

  private spawnRound() {
    // Clear previous objects
    this.objects.forEach((o) => o.destroy());
    this.objects = [];
    this.tappedCount = 0;

    const max = this.getMaxNumber();
    this.targetCount = Phaser.Math.Between(1, Math.min(max, 5 + this.level * 2));
    const emoji = Phaser.Utils.Array.GetRandom(FRUIT_EMOJIS);
    const word = getNumberWord(this.lang, this.targetCount);

    this.promptText.setText(`Count ${this.targetCount} (${word}) ${emoji}`);
    this.countText.setText(`Tapped: 0 / ${this.targetCount}`);

    // Add some distractors
    const totalObjects = this.targetCount + Phaser.Math.Between(2, 5);
    const emojis = [emoji];
    // Add distractor emojis
    while (emojis.length < 3) {
      const e = Phaser.Utils.Array.GetRandom(FRUIT_EMOJIS);
      if (!emojis.includes(e)) emojis.push(e);
    }

    for (let i = 0; i < totalObjects; i++) {
      const isTarget = i < this.targetCount;
      const e = isTarget ? emoji : Phaser.Utils.Array.GetRandom(emojis.slice(1));
      const x = Phaser.Math.Between(80, GAME_WIDTH - 80);
      const y = Phaser.Math.Between(130, 500);

      const obj = this.add.text(x, y, e, { fontSize: '48px' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setData('isTarget', isTarget)
        .setData('tapped', false);

      // Gentle float animation
      this.tweens.add({
        targets: obj, y: y + Phaser.Math.Between(-10, 10),
        duration: Phaser.Math.Between(1500, 2500), yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });

      obj.on('pointerdown', () => this.onTap(obj));
      this.objects.push(obj);
    }

    // Shuffle positions to mix targets and distractors
    Phaser.Utils.Array.Shuffle(this.objects);
  }

  private onTap(obj: Phaser.GameObjects.Text) {
    if (obj.getData('tapped')) return;

    if (obj.getData('isTarget')) {
      obj.setData('tapped', true);
      this.tappedCount++;
      this.countText.setText(`Tapped: ${this.tappedCount} / ${this.targetCount}`);

      // Shrink animation
      this.tweens.add({
        targets: obj, scaleX: 1.3, scaleY: 1.3, duration: 150, yoyo: true,
      });
      obj.setAlpha(0.5);

      // Add floating number
      const numText = this.add.text(obj.x, obj.y - 30, `${this.tappedCount}`, {
        fontSize: '20px', color: '#4caf50', fontStyle: 'bold',
      }).setOrigin(0.5);
      this.tweens.add({ targets: numText, y: obj.y - 60, alpha: 0, duration: 800, onComplete: () => numText.destroy() });

      if (this.tappedCount >= this.targetCount) {
        this.roundComplete(true);
      }
    } else {
      // Wrong object - shake
      this.tweens.add({
        targets: obj, x: obj.x + 10, duration: 50, yoyo: true, repeat: 3,
      });
      this.score = Math.max(0, this.score - 5);
      this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);
    }
  }

  private roundComplete(success: boolean) {
    this.rounds++;
    if (success) {
      this.score += this.targetCount * 10;
      this.level++;
      this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);
      this.levelText.setText(`${getLabel(this.lang, 'level')}: ${this.level}`);

      // Confetti
      for (let i = 0; i < 15; i++) {
        const confetti = this.add.text(
          Phaser.Math.Between(100, GAME_WIDTH - 100), -20,
          Phaser.Utils.Array.GetRandom(['🎉', '🎊', '⭐', '✨']),
          { fontSize: '28px' }
        );
        this.tweens.add({
          targets: confetti, y: GAME_HEIGHT + 30, x: confetti.x + Phaser.Math.Between(-80, 80),
          duration: Phaser.Math.Between(1000, 2000), delay: i * 50,
          onComplete: () => confetti.destroy(),
        });
      }
    }

    const feedback = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, success ? getLabel(this.lang, 'great') : getLabel(this.lang, 'tryAgain'), {
      fontSize: '36px', color: success ? '#4caf50' : '#f44336', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.tweens.add({ targets: feedback, scaleX: 1.3, scaleY: 1.3, alpha: 0, duration: 1200, onComplete: () => feedback.destroy() });

    if (this.rounds >= this.maxRounds) {
      this.time.delayedCall(1500, () => this.showResults());
    } else {
      this.time.delayedCall(1500, () => this.spawnRound());
    }
  }

  private showResults() {
    const maxScore = this.maxRounds * 50;
    const ratio = this.score / maxScore;
    const earnedStars = ratio > 0.8 ? 3 : ratio > 0.5 ? 2 : ratio > 0.2 ? 1 : 0;

    for (let i = 0; i < earnedStars; i++) {
      this.stars[i].setAlpha(1);
      this.tweens.add({ targets: this.stars[i], scaleX: 1.5, scaleY: 1.5, yoyo: true, duration: 300, delay: i * 200 });
    }

    this.promptText.setText(`${getLabel(this.lang, 'done')} ${getLabel(this.lang, 'score')}: ${this.score}`);
    this.game.events.emit('gameComplete', { game: 'counting', score: this.score, stars: earnedStars });
  }
}
