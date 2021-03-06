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
        if (!email || !password || !confirm) {
          throw new Error('email, password and confirm must all be filled in')
        }

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
          id: res._id,
          email: res.email
        }, process.env.JWT_SECRET, { expiresIn: '1h'})

        return {
          ...res._doc,
          id: res._id,
          token
        }
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve (parentValue, { email, password }) {
        if (!email || !password) {
          throw new Error('email and password are required to log in')
        }

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
          throw new Error('No user with that email');
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
          throw new Error('Incorrect password.');
        }

        const token = jwt.sign({
          id: existingUser._id,
          email: existingUser.email
        }, process.env.JWT_SECRET, { expiresIn: '1h'})

        return {
          id: existingUser._id,
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
        amount: { type: GraphQLFloat },
        date: { type: GraphQLString }
      },
      /* eslint-disable-next-line camelcase */
      resolve (parentValue, { user_id, description, merchant_id, debit, credit, amount, date }) {
        console.log(`amount: ${amount}`)
        if (!amount || !description || (!credit && !debit)) {
          throw new Error('Not all fields have been entered.')
        }
        return (new TransactionModel({ user_id, description, merchant_id, debit, credit, amount, date })).save()
      }
    },
    editTransaction: {
      type: TransactionType,
      args: {
        id: { type: GraphQLString },
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat },
        date: { type: GraphQLString }
      },
      resolve (parentVale, { id, user_id, description, merchant_id, debit, credit, amount, date }) {
        if (!amount || !description || (!credit && !debit)) {
          throw new Error('Not all fields have been entered.')
        }
        
        return TransactionModel.updateOne({_id: id}, { user_id, description, merchant_id, debit, credit, amount, date })
      }
    }
  }
})

module.exports = mutation
