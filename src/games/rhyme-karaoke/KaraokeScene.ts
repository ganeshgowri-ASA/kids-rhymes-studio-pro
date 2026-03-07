import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, getLabel } from '../config';

const RHYMES: Record<string, { title: string; lines: string[]; bpm: number }[]> = {
  en: [
    { title: 'Twinkle Twinkle', lines: ['Twinkle twinkle', 'little star', 'How I wonder', 'what you are', 'Up above the', 'world so high', 'Like a diamond', 'in the sky'], bpm: 80 },
    { title: 'Baa Baa Black Sheep', lines: ['Baa baa', 'black sheep', 'Have you any', 'wool', 'Yes sir yes sir', 'three bags full'], bpm: 90 },
  ],
  hi: [
    { title: 'मछली जल की रानी', lines: ['मछली जल की', 'रानी है', 'जीवन उसका', 'पानी है', 'हाथ लगाओ', 'डर जाएगी', 'बाहर निकालो', 'मर जाएगी'], bpm: 85 },
  ],
  te: [
    { title: 'చందమామ రావే', lines: ['చందమామ రావే', 'జాబిల్లి రావే', 'కొండెక్కి రావే', 'గోగుపూలు తేవే'], bpm: 80 },
  ],
};

export default class KaraokeScene extends Phaser.Scene {
  private lines: string[] = [];
  private currentLine = 0;
  private score = 0;
  private lineTexts: Phaser.GameObjects.Text[] = [];
  private ball!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private lang = 'en';
  private bpm = 80;
  private timer?: Phaser.Time.TimerEvent;
  private stars: Phaser.GameObjects.Text[] = [];
  private tapCount = 0;
  private totalBeats = 0;

  constructor() { super({ key: 'KaraokeScene' }); }

  init(data: { language?: string }) {
    this.lang = data.language || 'en';
    this.score = 0;
    this.currentLine = 0;
    this.tapCount = 0;
    this.totalBeats = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#f5f0ff');

    this.add.rectangle(GAME_WIDTH / 2, 30, GAME_WIDTH, 60, 0xce93d8).setAlpha(0.3);
    this.scoreText = this.add.text(GAME_WIDTH - 20, 10, `${getLabel(this.lang, 'score')}: 0`, {
      fontSize: '20px', color: '#7b1fa2', fontStyle: 'bold',
    }).setOrigin(1, 0);

    for (let i = 0; i < 3; i++) {
      const star = this.add.text(20 + i * 35, 8, '⭐', { fontSize: '24px' }).setAlpha(0.2);
      this.stars.push(star);
    }

    // Pick rhyme
    const rhymes = RHYMES[this.lang] || RHYMES['en'];
    const rhyme = Phaser.Utils.Array.GetRandom(rhymes);
    this.lines = rhyme.lines;
    this.bpm = rhyme.bpm;

    this.titleText = this.add.text(GAME_WIDTH / 2, 80, `🎵 ${rhyme.title} 🎵`, {
      fontSize: '26px', color: '#7b1fa2', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Display all lines
    const startY = 140;
    const lineHeight = 45;
    this.lineTexts = [];
    this.lines.forEach((line, i) => {
      const text = this.add.text(GAME_WIDTH / 2, startY + i * lineHeight, line, {
        fontSize: '22px', color: '#999', fontStyle: 'bold',
      }).setOrigin(0.5);
      this.lineTexts.push(text);
    });

    // Bouncing ball
    this.ball = this.add.text(0, 0, '🎤', { fontSize: '32px' }).setOrigin(0.5);

    // Instruction
    const instr = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, 'Tap/click in rhythm with the lyrics!', {
      fontSize: '16px', color: '#888',
    }).setOrigin(0.5);

    // Start button
    const startBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, '▶ Start', {
      fontSize: '28px', color: '#7b1fa2', fontStyle: 'bold',
      backgroundColor: '#e1bee7', padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerdown', () => {
      startBtn.destroy();
      instr.setText('Tap in rhythm! 🎶');
      this.startKaraoke();
    });

    // Tap input for scoring
    this.input.on('pointerdown', () => {
      if (this.timer) {
        this.tapCount++;
        // Visual feedback
        const ripple = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 100, 20, 0xce93d8, 0.5);
        this.tweens.add({
          targets: ripple, scaleX: 3, scaleY: 3, alpha: 0, duration: 400,
          onComplete: () => ripple.destroy(),
        });
      }
    });
  }

  private startKaraoke() {
    this.currentLine = 0;
    this.highlightLine(0);

    const beatInterval = 60000 / this.bpm * 2; // Time per line
    this.totalBeats = this.lines.length;

    this.timer = this.time.addEvent({
      delay: beatInterval,
      repeat: this.lines.length - 1,
      callback: () => {
        this.currentLine++;
        if (this.currentLine < this.lines.length) {
          this.highlightLine(this.currentLine);
        }
        if (this.currentLine >= this.lines.length) {
          this.endKaraoke();
        }
      },
    });
  }

  private highlightLine(index: number) {
    this.lineTexts.forEach((t, i) => {
      if (i < index) {
        t.setColor('#ccc');
      } else if (i === index) {
        t.setColor('#7b1fa2');
        t.setFontSize(26);
        // Move ball
        this.tweens.add({
          targets: this.ball,
          x: t.x - t.width / 2 - 25,
          y: t.y,
          duration: 200,
          ease: 'Bounce.easeOut',
        });
        // Ball bounce across line
        this.tweens.add({
          targets: this.ball,
          x: t.x + t.width / 2 + 25,
          duration: (60000 / this.bpm) * 2 - 200,
          delay: 200,
          ease: 'Sine.easeInOut',
        });
      } else {
        t.setColor('#999');
        t.setFontSize(22);
      }
    });

    // Score per line (based on tapping)
    if (index > 0) {
      const lineScore = Math.min(20, this.tapCount * 5);
      this.score += lineScore;
      this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);
      this.tapCount = 0;
    }
  }

  private endKaraoke() {
    if (this.timer) {
      this.timer.destroy();
      this.timer = undefined;
    }

    // Final scoring
    const lineScore = Math.min(20, this.tapCount * 5);
    this.score += lineScore;
    this.scoreText.setText(`${getLabel(this.lang, 'score')}: ${this.score}`);

    const maxScore = this.lines.length * 20;
    const ratio = this.score / maxScore;
    const earnedStars = ratio > 0.7 ? 3 : ratio > 0.4 ? 2 : ratio > 0.1 ? 1 : 0;

    for (let i = 0; i < earnedStars; i++) {
      this.stars[i].setAlpha(1);
      this.tweens.add({ targets: this.stars[i], scaleX: 1.5, scaleY: 1.5, yoyo: true, duration: 300, delay: i * 200 });
    }

    this.ball.setVisible(false);
    const result = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, `🎵 ${getLabel(this.lang, 'done')} ${getLabel(this.lang, 'score')}: ${this.score}`, {
      fontSize: '28px', color: '#7b1fa2', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.tweens.add({ targets: result, scaleX: 1.1, scaleY: 1.1, yoyo: true, repeat: 2, duration: 300 });

    this.game.events.emit('gameComplete', { game: 'karaoke', score: this.score, stars: earnedStars });
  }
}
