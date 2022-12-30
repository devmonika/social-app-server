const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());







const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5guxah.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try{ 
        const postCollection = client.db('socialUserDb').collection('post');
        const usersCollection = client.db('socialUserDb').collection('users');
        //get post

        app.get('/post', async(req, res) =>{
            const query = {}
            const cursor = postCollection.find(query);
            const post = await cursor.toArray();
            // console.log(services);
            res.send(post);
          });

        //add post

        app.post('/post', async(req, res) =>{
            const addpost = req.body;
            const result = await postCollection.insertOne(addpost);
            res.send(result);
        });

        //save user                    

         app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        
        // get users 
        app.get('/users', async(req, res)=>{
            const query = {};
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })

        //user info

        app.get('/user', async(req, res) =>{
            // console.log(req.query.email);
            let query = {};
            
            if(req.query.email){
              query = {
                email:req.query.email
              }
            }
            // console.log(query)
            const cursor = usersCollection.find(query);
            const user = await cursor.toArray();
            // console.log(user);
            res.send(user);
            // console.log(user)
          });
       

        //update info

        app.patch('/user/:id', async(req, res) =>{
          const id = req.params.id;
          const user = req.body;
          const query ={ _id:ObjectId(id)};
          const updatedDoc ={
            $set:{
              user: user.user
            
            }
            
          }
          console.log(user)
          const result = await usersCollection.updateOne(query, updatedDoc);
          res.send(result);
          console.log(result)
        });



         // app.get('/users/:id', async(req, res) =>{
        //     const id = req.params.id;
        //     const query = {_id:ObjectId(id)};
        //     const users = await usersCollection.findOne(query);
        //     res.send(users)
        //   });
     }
    finally{

    }
}
run().catch(err=>console.error(err));








app.get('/', (req, res) => {
    res.send('data')
  });

app.listen(port, () =>{
    console.log('social server running')
  })