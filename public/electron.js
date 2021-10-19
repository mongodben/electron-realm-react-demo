const electron = require("electron");
const path = require("path");
const Realm = require("realm");
const { ObjectId } = require("bson");
const faker = require('faker');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  // and load the index.html of the app.
  console.log(__dirname);
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const realmApp = new Realm.App({ id: "notes_app-tlrov" }); // create a new instance of the Realm.App
  try{ 

 
  await realmApp.logIn(Realm.Credentials.anonymous());
  const DogSchema = {
    name: 'Dog',
    properties: {
      _id: 'objectId',
      name: 'string',
      age: 'int',
    },
    primaryKey: '_id',
  };

  const config = {
    schema: [DogSchema],
    path: 'my.realm',
    sync: {
      user: realmApp.currentUser,
      partitionValue: 'myPartition',
    },
  };

  // open a synced realm
  const realm = await Realm.open(config);


  const dogs = realm.objects('Dog');
  console.log(`Main: Number of Dog objects: ${dogs.length}`);

  realm.write(() => {
    realm.create('Dog', {
      _id: new ObjectId(),
      name: faker.name.findName(),
      age: faker.datatype.number(),
    });
  });
   } catch (err) {
     console.error("electron error", err)
   }

  createWindow();
});
