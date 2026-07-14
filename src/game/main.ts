import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale, Types } from 'phaser';

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#080b10',

    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },

    scene: [
        MainGame
    ]
};

const StartGame = (parent: string) => {
    return new Game({
        ...config,
        parent
    });
};

export default StartGame;