import logo from './logo.svg';
import './App.css';
import Realm from "realm";
import React from 'react';
import {ObjectId} from "bson";
import faker from "faker";

async function run() {
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
    path: 'my.realm',
    schema: [DogSchema],
    /* 
       enable sync history, using "sync:true" (this allows changes to "my.realm" file
       to be synced by the realm opened in the main process)
    */
    sync: true, 
  };

  try{
    const realm =  new Realm(config);
    const dogs = realm.objects('Dog');
    console.log(`Renderer: Number of Dog objects: ${dogs.length}`);
  
    await realm.write(() => {
      realm.create('Dog', {
        _id: new ObjectId(),
        name: faker.name.findName(),
        age: faker.datatype.number(),
      });
    });
  } catch (err){
    console.error(err);
  }

}
run().catch((err) => {
  console.error('Failed to open realm:', err);
});

function App() {
  React.useEffect(()=>{
    run();
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
