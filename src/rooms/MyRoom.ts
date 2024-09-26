import { Room, Client } from "@colyseus/core";
import { MyRoomState,Player,Item } from "./schema/MyRoomState";

const FLOOR_SIZE = 4;
const CELLS_NUMBER = 10;
export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;
  

  onCreate (options: any) {
    this.setState(new MyRoomState());

    for (let i=0;i<CELLS_NUMBER;i++){

      const item = new Item();  
      item.x = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);
      item.y = 1.031;
      item.z = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);

      this.state.items.set(String(i), item);
    }


    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

    this.onMessage("updatePosition", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x = data.x;
      player.y = data.y;
      player.z = data.z;
    }); 

    this.onMessage("updateName", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.name = data.name;
    });     
    
    this.onMessage("selectedItem", (client, data) => {
      console.log('selectedItem',data.itemID);
      this.state.items.delete(data.itemID);
    });   

  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // create Player instance
    const player = new Player();

    // place Player at a random position
    player.x = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);
    player.y = 1.031;
    player.z = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
}

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
