import { Scene } from 'phaser';
import Kamikaze from '../characters/enemies/Kamikaze';
import TrojanHorse from '../characters/enemies/TrojanHorse';

const gangTypes: any[] = [];
gangTypes.push(TrojanHorse);
gangTypes.push(Kamikaze);

//returns a new Object of a random type from gangTypes
function getRandomGangType(scene: Scene) {
  const random = Math.floor(Math.random() * gangTypes.length);
  return new gangTypes[random](scene);
}
export default getRandomGangType;
