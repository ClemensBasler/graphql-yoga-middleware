const { GraphQLServer } = require('graphql-yoga')
const { defaultFieldResolver } = require("graphql");
const { SchemaDirectiveVisitor } = require("graphql-tools");


class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === "string") {
        return result.toUpperCase();
      }
      return result;
    };
  }
}

const typeDefs = `
directive @upper on FIELD_DEFINITION

type Query {
  hello: String @upper
}`;

const resolvers = {
  Query: {
    hello: () => `Hello Guys`,
  }
}

// Server
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req }),
  schemaDirectives: {
    upper: UpperCaseDirective // make sure the key is 'constraint'
  },
})

server.start(() => console.log('Server is running on http://localhost:4000'))
