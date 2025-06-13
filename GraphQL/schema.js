const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String!
    copies: Int!
  }

  type Borrow {
    id: ID!
    userId: ID!
    bookId: ID!
    borrowDate: String!
    returnDate: String
    book: Book
  }

  type Token {
    token: String!
  }

  type AvailabilityReport {
    totalUniqueBooks: Int!
    borrowedUniqueBooks: Int!
    availableUniqueBooks: Int!
    totalBooks: Int!
    borrowedBooks: Int!
    availableBooks: Int!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input BookInput {
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String!
    copies: Int!
  }

  type Query {
    books(genre: String, author: String): [Book]
    borrowHistory: [Borrow]
    mostBorrowedBooks: [Book]
    activeMembers: [User]
    bookAvailability: AvailabilityReport
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): Token
    login(email: String!, password: String!): Token
    addBook(input: BookInput!): Book
    updateBook(id: ID!, input: BookInput!): Book
    deleteBook(id: ID!): String
    borrowBook(bookId: ID!): Borrow
    returnBook(bookId: ID!): String
  }
`);

module.exports = schema;
