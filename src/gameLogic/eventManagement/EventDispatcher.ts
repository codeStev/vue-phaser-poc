import Phaser from 'phaser'

export default class EventDispatcher extends Phaser.Events.EventEmitter{
    private static instance:EventDispatcher
    private constructor(){
        super()
    }
    public static getInstance():EventDispatcher{
        if(this.instance == undefined){
            this.instance = new EventDispatcher();
        }
        console.log(this.instance)
        return this.instance
    }
}