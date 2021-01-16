const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = graphql
const { UserModel } = require('../data-models/User')
const { TransactionModel } = require('../data-models/Transaction')
const UserType = require('./user-type')
const TransactionType = require('./transaction-type')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        confirm: { type: GraphQLString },
        dob: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
      },
      /* eslint-disable-next-line camelcase */
      async resolve (parentValue, { email, password, confirm, dob, firstName, lastName }) {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
          throw new Error('User already exists!');
        }
        
        if (password !== confirm) {
          throw new Error('Passwords are inconsistent!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
          email,
          password: hashedPassword,
          dob,
          firstName,
          lastName
        }, (err) => { if (err) throw err });

        const res = await user.save();
        
        const token = jwt.sign({
          id: res.id,
          email: res.email
        }, process.env.JWT_SECRET, { expiresIn: '1h'})

        return {
          ...res._doc,
          id: res._id,
          token
        }
      }
    },
    addTransaction: {
      type: TransactionType,
      args: {
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat }
      },
      /* eslint-disable-next-line camelcase */
      resolve (parentValue, { user_id, description, merchant_id, debit, credit, amount }) {
        return (new TransactionModel({ user_id, description, merchant_id, debit, credit, amount })).save()
      }
    }
  }
})

module.exports = mutation
