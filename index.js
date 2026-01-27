import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3002);

const characters = [];

const items = {
  table: {
    name: "Table",
    size: [2, 2],
  },
  chair: {
    name: "Chair",
    size: [2, 2],
  },
  couch: {
    name: "Couch",
    size: [1, 1],
  },
  car: {
    name: "Car",
    size: [2, 2],
  },
};

const map = {
  size: [20, 10],
  gridDivision: 2,
  items: [
    {
      ...items.chair,
      gridPosition: [12, 10],
    },
    {
      ...items.chair,
      gridPosition: [7, 10],
      rotation: 2,
    },
    {
      ...items.couch,
      gridPosition: [8, 4],
    },
  ],
};

const generateRandomPostion = () => {
  return [Math.random() * map.size[0], 0, Math.random() * map.size[1]];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("User Connected");

  characters.push({
    id: socket.id,
    position: generateRandomPostion(),
    helmetColor: generateRandomHexColor(),
    bodyColor: generateRandomHexColor(),
    feetColor: generateRandomHexColor(),
  });

  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  });

  io.emit("characters", characters);

  socket.on("move", (position) => {
    const character = characters.find(
      (character) => character.id === socket.id,
    );
    character.position = position;
    io.emit("characters", characters);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
    );

    io.emit("characters", characters);
  });
});
