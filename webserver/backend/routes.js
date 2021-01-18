'use strict'
const exGraphql = require('express-graphql')
const graphqlSchema = require('./schema/schema.js')
const path = require('path')
require('dotenv').config();
const { UserModel } = require("./data-models/User");
const jwt = require('jsonwebtoken');

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get('/', (req, res) => {
    // res.locals.name = 'Divvy React Challenge'
    res.sendFile('index.html')
  })

  app.use("/tokenIsValid", async (req, res) => {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);
    if (!verified) return res.json(false);

    const user = await UserModel.findById(verified.id);
    console.log(user);
    if (!user) return res.json(false);

    return res.json({
      id: verified.id,
      email: verified.email
    });
  })

  // GraphQL routes
  app.use(
    '/graphql',
    exGraphql({
      schema: graphqlSchema,
      graphiql: true,
      pretty: true
    })
  )

  app.use(/(?!\/graphql)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
}
