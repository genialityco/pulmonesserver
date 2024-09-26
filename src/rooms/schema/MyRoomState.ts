// MyRoomState.ts
import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("string") name: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") z: number;
    @type("number") rotx: number;
    @type("number") roty: number;
    @type("number") rotz: number;



}

export class Item extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
}



export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Item }) items = new MapSchema<Item>();
}