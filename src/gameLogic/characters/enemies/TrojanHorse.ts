import { Scene } from "phaser";
import Brute from "./Brute";
import Enemy from "./Enemy";
import Gang_A from "./Gang_A";
import Gunner from "./Gunner";

export default class TrojanHorse extends Gang_A{
   
    init(): Enemy[] {
       const enemies : Enemy[] = <Enemy[]> this.createMultiple({
            classType: Brute,
            frameQuantity : 6,
            key : [this.bruteSpriteKey],
            visible: true,
            active : true      })
        this.runChildUpdate = true
        enemies.push(...<Enemy[]> this.createMultiple({
            classType: Gunner,
            frameQuantity : 6,
            key : [this.gunnerSpriteKey],
            visible: true,
            active : true,
        }))
        Phaser.Actions.SetXY(this.getChildren(),300,300,100)
        return enemies
    }
   
 
       
   

}