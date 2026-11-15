import Phaser from 'phaser';
import { BootScene } from './view/BootScene';
import './style.css';
new Phaser.Game({ type: Phaser.AUTO, parent: 'game', width: 640, height: 180,
  backgroundColor: '#172824', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: [BootScene] });
