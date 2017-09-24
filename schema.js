/*
* Main part of the project
*/

const axios = require('axios');

// Get GraphQL exports
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const BASE_URL = 'http://localhost:3000';

// customer type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

/*
* object type sets the type of data for the application
* in this case we are setting 'root query' (necessary)
*/
const RootQuery = new GraphQLObjectType({
  /*
  * - all Object types require a name
  * - API endpoint specification is done with args & resolve
  */
  name: 'RootQueryType',
  fields: {
    // GET customer by id
    customer: {
      type: CustomerType,
      // API GET args: in this case 'id'
      args: {
        id: { type: GraphQLString }
      },
      // what to do when endpoint is called
      resolve(parentValue, args) {
        return axios.get(`${BASE_URL}/customers/` + args.id).then(res => res.data);
      }
    },
    // GET all customers (list)
    customers: {
      // Does not require args because it is not called to GET a specific object
      type: new GraphQLList(CustomerType),
      resolve() {
        return axios.get(`${BASE_URL}/customers`).then(res => res.data);
      }
    }
  }
});

// Mutations - add, edit, and delete data
const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        // GraphQLNonNull - required fields
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios
          .post(`${BASE_URL}/customers`, {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        // GraphQLNonNull - required fields
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios
          .delete(`${BASE_URL}/customers/` + args.id, {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        // GraphQLNonNull - required fields
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return axios.patch(`${BASE_URL}/customers/` + args.id, args).then(res => res.data);
      }
    }
  }
});

// set baseline query
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
