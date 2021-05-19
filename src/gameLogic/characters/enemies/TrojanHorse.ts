import { Scene } from "phaser";
import Brute from "./Brute";
import Enemy from "./Enemy";
import Gang_A from "./Gang_A";
import Gunner from "./Gunner";

export default class TrojanHorse extends Gang_A{
    collideCounter = 0

    prepareChildren(): Enemy[] {
        const enemies : Enemy[] = [];
    
        const brutes : Enemy[] = <Enemy[]> this.createMultiple({
            classType: Brute,
            frameQuantity : 10,
            key : [this.bruteSpriteKey],
            visible: true,
            active : true      
        })

        this.runChildUpdate = true

        const gunners : Enemy[] = <Enemy[]>this.createMultiple({
            classType: Gunner,
            frameQuantity : 10,
            key : [this.gunnerSpriteKey],
            visible: true,
            active : true,
        })

        Phaser.Actions.SetXY(gunners, 300, 200, 100)
        Phaser.Actions.SetXY(brutes, 300, 300, 100)

        enemies.push(...brutes)
        enemies.push(...gunners)
        enemies.forEach(enemy => {
            this.scene.physics.world.enableBody(enemy, Phaser.Physics.Arcade.DYNAMIC_BODY)
            enemy.body.setCollideWorldBounds(true)
            enemy.body.onWorldBounds = true	
            enemy.gang = this
        });

        this.setVelocityX(200);
        this.scene.physics.world.on('worldbounds',this.moveLeftRight)
        return enemies
    }
   
    reset(){
        this.scene.physics.world.removeListener('worldbounds')
    }

    moveDown(gang : Gang_A, blockedLeft:boolean){
        setTimeout(function(){
            gang.setVelocityY(0)
            blockedLeft ? gang.setVelocityX(200) : gang.setVelocityX(-200)
        },100)
    }
  
    //callback for the worldbounds event in TrojanHorse. NOT called in this context, but in scene
    moveLeftRight(body : Phaser.Physics.Arcade.Body, blockedUp : boolean, blockedDown : boolean, blockedLeft : boolean, blockedRight : boolean){        
            const gang : TrojanHorse = <TrojanHorse>(<Enemy>body.gameObject).gang
            if(blockedLeft ){
                gang.setVelocityX(200)
                gang.collideCounter ++
            }
            else if (blockedRight){
                gang.setVelocityX(-200)
            }
            if(gang.collideCounter == 2){
                gang.setVelocityX(0);
                gang.setVelocityY(300);
                (<TrojanHorse>gang).moveDown(gang,blockedLeft);
                gang.collideCounter = 0;
                }
       
    }
       
   

}