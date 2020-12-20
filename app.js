const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const { buildSchema } = require('graphql');
const { assertValidExecutionArguments } = require('graphql/execution/execute');
const mongoose = require('mongoose');
const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

const user = require('./models/user');
const { create } = require('./models/event');
const app = express();
const isAuth = require('./middleware/is-auth');


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
  })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hd38z.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true }
).then(
    () =>{
        app.listen(8000);
    }
)
.catch(err =>{
    console.log(err);
})
;

