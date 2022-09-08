import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });

const museums = [
  {
    name: " Louvre Museum",
    city: "Paris",
  },
  {
    name: " The British Museum",
    city: "London",
  },
  {
    name: " Uffizi Gallery",
    city: "Florence",
  },
  {
    name: " Orsay Museum",
    city: "Paris",
  }
 
];

const works = [
  {
    name: "Mona lisa",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    museumId: 1,
  },
  {
    name: "The Venus of Milo",
    picture:
      "https://cdn.britannica.com/02/222202-050-40E1A83B/Statue-of-Venus-de-Milo-Louvre-Paris-France.jpg",
    museumId: 1,
  },
  {
    name: "Coronation Of A Virgin",
    picture: "https://images.metmuseum.org/CRDImages/ep/original/DT11343.jpg",
    museumId: 3,
  },
  {
    name: " A cornfield by Moonlight with Evening Star",
    picture:
      "https://upload.wikimedia.org/wikipedia/en/b/b1/Palmer._A_Cornfield_by_Moonlight_with_the_Evening_Star._Watercolour_with_bodycolour_and_pen_and_ink_c.1830..jpg",
    museumId: 4,
  },
  {
    name: "Garuda",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Garuda_-_British_Museum_-_Joy_of_Museums.jpg/1024px-Garuda_-_British_Museum_-_Joy_of_Museums.jpg",
    museumId: 4,
  }
]
const dropAllWorks = db.prepare(`
DROP TABLE IF  EXISTS works`);
dropAllWorks.run();

const dropMuseum = db.prepare(`
DROP TABLE IF EXISTS  museums
`);
dropMuseum.run();

const createMuseumsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    PRIMARY KEY(id)

);
`);

createMuseumsTable.run();

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (@name,@city);
`);
for (let museum of museums) {
  createMuseum.run(museum);
}

const createWorksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS works (
    id INTEGER  NOT NULL,
    name TEXT NOT NULL ,
    picture TEXT ,
    museumId INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (museumId) REFERENCES museums(id)
);
`);

createWorksTable.run()

const createWork = db.prepare(`
INSERT INTO works (name, picture, museumId) VALUES (@name, @picture, @museumId);
`);

for (let work of works) {
  createWork.run(work);
}
