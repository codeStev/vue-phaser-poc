import CharacterKeys from "@/gameLogic/CharacterKeys";
import { GameObjects, Scene } from "phaser";
import Enemy from "./Enemy";

export default abstract class Gang_A extends Phaser.Physics.Arcade.Group{
    bruteSpriteKey = CharacterKeys.BRUTE
    gunnerSpriteKey = CharacterKeys.GUNNER

    constructor(scene : Scene){
    super(scene.physics.world,scene)
    }
    
    abstract init():void
    
}