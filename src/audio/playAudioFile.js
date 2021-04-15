
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.audio('theme', [
        'assets/audio/music_zapsplat_game_music_action_retro_8_bit_repeating_016.mp3'
    ]);
}

function create ()
{
    var music = this.sound.add('theme');

    music.play();
}