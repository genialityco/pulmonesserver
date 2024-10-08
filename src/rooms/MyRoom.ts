import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player, Item } from "./schema/MyRoomState";

const FLOOR_SIZE = 4;
const INITIAL_CELLS_NUMBER = 100;
export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;
  cells_number = INITIAL_CELLS_NUMBER;

  //Agregamos CELLS_NUMBER numero de items para recoger en el juego al inicio
  resetItemsState() {
    //trackeamos la cantidad de elementos por separado para poder determinar cuando se gana
    //esperando los elementos de items uno a uno, no se puede calcular por lo que llegan de a uno
    this.state.itemsLength =  this.cells_number;
    for (let i = 0; i < this.cells_number; i++) {
      const item = new Item();
      item.x = -(FLOOR_SIZE / 2) + Math.random() * FLOOR_SIZE;
      item.y = 1.031;
      item.z = -(FLOOR_SIZE / 2) + Math.random() * FLOOR_SIZE;

      this.state.items.set(String(i), item);
    }
  }

  onCreate(options: any) {
    this.setState(new MyRoomState());

    console.log("reiniciando el estado");
    this.resetItemsState();

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
      if (data.rotx) player.rotx = data.rotx;
      if (data.roty) player.roty = data.roty;
      if (data.rotz) player.rotz = data.rotz;
    });

    this.onMessage("updateName", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.name = data.name;
    });

    this.onMessage("selectedItem", (client, data) => {
      console.log("selectedItem", data.itemID);

      console.log("arrancamos",this.state.items.size,"borro", this.state.items.delete(data.itemID), "cuantos quedan",this.state.items.size);
      //console.log("borro", this.state.items.delete(String(data.itemID)), this.state.items);
      //tenemos que trackear por separado la cantidad de elementos del mapa, de lo contrario coliseus no permite determinarlo
      this.state.itemsLength = this.state.items.size;
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // create Player instance
    const player = new Player();

    // place Player at a random position
    player.x = -(FLOOR_SIZE / 2) + Math.random() * FLOOR_SIZE;
    player.y = 1.031;
    player.z = -(FLOOR_SIZE / 2) + Math.random() * FLOOR_SIZE;

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    console.log("borro", this.state.players.delete(client.sessionId));
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
