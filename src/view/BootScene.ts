import Phaser from 'phaser';
export class BootScene extends Phaser.Scene {
  create() {
    const status = document.querySelector('#status');
    if (status) status.textContent = `Phaser ${Phaser.VERSION} 已初始化 · ${this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`;
  }
}
