// mdb-auth.ts TS-Doc?

// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const full_uri = process.env.MONGODB_URI
const uri_arr = full_uri.split("?")
const uri = uri_arr[0]
const params = "?" + uri_arr[1]

const options = {};

let client;
let clientPromise: Promise<MongoClient>;

// let NexusMongoClient = Object.assign({}, new MongoClient(uri, options))
// Object.setPrototypeOf(NexusMongoClient, {})
//NexusMongoClient.prototype = MongoClient.prototype

//MongoClient.prototype = NexusMongoClient.prototype


// NexusMongoClient.loadDB = async (db) => {
//       console.log(`---- db:init:reconnect:load:${db} ----`)
//       const _options = {
//       ..._options,
//       authSource: db
//     }
//     _client = new this.contructor(uri, _options)
//     return await _client.connect()
// }

// class MyProtoype {
//   constructor() {
//     console.log(" body as constructor ")
//   }
// }

//MyProtoype.prototype.constructor = function contructor() { console.log("whatever") }

// function MyAugProto(init) {
//   console.log("2", init, this)
// }

// MyProtoype.prototype.myMethod = () => "whatever"

// MyAugProto.prototype = MyProtoype.prototype

//MyAugProto.constructor = (init) => { console.log("2", init) }


//MyProtoype = function MyProtoype(init) { console.log("1", init) }
// //MyProtoype.prototype 
// //MyProtoype.prototype.constructor = (init) => { console.log("2", init) }

//new MyAugProto("hello")


// const logProto = MyProtoype

//console.log("ORIG CONN", logProto, logProto.myMethod, new logProto.prototype.constructor, logProto.__constructor)
//console.log("CONN DEC", NexusMongoClient.constructor, typeof MongoClient.constructor)


// NexusMongoClient.prototype.constructor = function constructor(uri, options) {
//   console.log(`---- db:init:decorate:constucutor ----`)
//   // console.log("const this", this)
//   // const _MongoClient = MongoClient
//   // this.loadDB = async (db) => {
//   //     console.log(`---- db:init:reconnect:load:${db} ----`)
//   //     const _options = {
//   //     ..._options,
//   //     authSource: db
//   //   }
//   //   _client = new MongoClient(uri, _options)
//   //   return await _client.connect()
//   // }

//   // return _MongoClient.prototype.__constructor
// }

//new NexusMongoClient()



//console.log({ origCons: JSON.stringify(MongoClient.constructor), decCons: JSON.stringify(NexusMongoClient.constructor)})


// const NexusMongoClient: MongoClient = (uri, options) => {
//   console.log(`---- db:init:first-connect:load:${db} ----`)
//   let _client = MongoClient;
//   _client.connect.loadDB = 
//   return _client
// }



const genPromise = (name = "") => 
{
  const dest = uri + name + params

  console.log("! will connect to ", dest)
  if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(dest, options);
    // _client = new MongoClient(uri, options);

    //console.log("CONN INSTANCE", client, client.loadDB)
    // const _promise = await _client.connect();
    // _promise.setDb = _client.connect ;

    // console.log({ _promise })
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(dest, options);
  //console.log("CONN INSTANCE", client, client.loadDB)
  console.log("CONN INSTANCE", client)
  clientPromise = client.connect();
}

return clientPromise
}

genPromise()

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export const _setDb = async (db) => {
  return genPromise(db)
}
export default clientPromise;
