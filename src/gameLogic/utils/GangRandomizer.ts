import { Scene } from "phaser";
import TrojanHorse from "../characters/enemies/TrojanHorse";

const gangTypes : any[] = []
gangTypes.push(TrojanHorse)

function getRandomGangType(scene :Scene){
    const random = Math.floor(Math.random()*gangTypes.length)
    return new gangTypes[random](scene);
}
export default getRandomGangType