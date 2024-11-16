import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';

let tweets = [
  {
    id: '1',
    text: 'Nico',
  },
  {
    id: '2',
    text: 'Elon',
  },
];

let users = [
  {
    id: '1',
    firstName: 'Nico',
    lastName: 'las',
  },
  {
    id: '2',
    firstName: 'Elon',
    lastName: 'Mask',
  },
];

const typeDefs = gql`
  type Tweet {
    id: ID
    text: String
    author: User
  }
  type User {
    id: ID
    firstName: String
    lastName: String
    fullName: String
  }
  type Query {
    allTweets: [Tweet!]!
    allMovies: [Movie!]!
    movie(id: String!): Movie
    allUsers: [User]
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String!]!
    summary: String
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    allUsers() {
      return users;
    },
    allMovies() {
      return fetch('https://yts.mx/api/v2/list_movies.json').then((r) =>
        r.json().then((json) => json.data.movies)
      );
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`).then((r) =>
        r.json().then((json) => json.data.movie)
      );
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`server on ${url}`));
