const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authMiddleware = require('./middlewares/auth');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const borrowRoutes = require('./routes/borrow');
const graphqlSchema = require('./GraphQL/schema');
const graphqlResolvers = require('./GraphQL/resolvers');
const { graphqlHTTP } = require('express-graphql');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(authMiddleware); 
app.get('/', (req, res) => {
  res.send('✅ Backend (Nalanda Library managemnt) is running successfully!');
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', borrowRoutes);

app.use('/graphql', graphqlHTTP((req) => ({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
  context: { user: req.user } 
})));

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
