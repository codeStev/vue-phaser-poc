import { Scene } from "phaser";
import Brute from "./Brute";
import Enemy from "./Enemy";
import Gang_A from "./Gang_A";
import Gunner from "./Gunner";

export default class TrojanHorse extends Gang_A{

    init(): Enemy[] {
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

        //Phaser.Actions.SetXY(this.getChildren(),300,300,100)
        this.setVelocityX(200);
        this.moveLeftRight();
        return enemies
    }
   
    moveDown(gang : Gang_A, blockedLeft:boolean){
        setTimeout(function(){
            gang.setVelocityY(0)
            blockedLeft ? gang.setVelocityX(200) : gang.setVelocityX(-200)
        },100)
    }
  

    moveLeftRight(){
        //create basic formation
        const moveDown = this.moveDown      
        let collideCounter = 0
        
        this.scene.physics.world.on("worldbounds",function(body : Phaser.Physics.Arcade.Body, blockedUp : boolean, blockedDown : boolean, blockedLeft : boolean, blockedRight : boolean){
            const gang : Gang_A = (<Enemy>body.gameObject).gang
            if(blockedLeft ){
                gang.setVelocityX(200)
                collideCounter ++
            }
            else if (blockedRight){
                gang.setVelocityX(-200)
            }
            if(collideCounter == 2){
                (<Enemy>body.gameObject).gang.setVelocityX(0)
                gang.setVelocityY(300)
                moveDown(gang,blockedLeft)
                collideCounter = 0
                }
        })
    }
       
   

}