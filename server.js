import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let boardDB = [
  { number: 1, writer: "철수", title: "제목1임", contents: "내용임" },
  { number: 2, writer: "유리", title: "제목2임", contents: "내용임" },
  { number: 3, writer: "훈이", title: "제목3임", contents: "내용임" },
  { number: 4, writer: "맹구", title: "제목4임", contents: "내용임" },
];

let users = [
  {
    id: "1",
    firstName: "Nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];

const typeDefs = gql`
  type BoardModel {
    number: Int
    writer: String
    title: String
    contents: String
  }
  type ResponseModel {
    success: Boolean
    message: String
  }
  input BoardInputModel {
    writer: String
    title: String
    contents: String
  }
  type User {
    id: ID
    firstName: String
    lastName: String
    fullName: String
  }
  type Query {
    allMovies: [Movie!]!
    movie(id: String!): Movie
    allUsers: [User]
    fetchBoards: [BoardModel]
    fetchBoard(number: Int): BoardModel
  }
  type Mutation {
    createBoard(boardInput: BoardInputModel): ResponseModel
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
    allUsers() {
      return users;
    },
    fetchBoards() {
      return boardDB;
    },
    fetchBoard(_, { number }) {
      const board = boardDB.find((board) => board.number === number);
      return board;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json").then((r) =>
        r.json().then((json) => json.data.movies)
      );
    },
    movie(_, { id }) {
      return fetch(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
      ).then((r) => r.json().then((json) => json.data.movie));
    },
  },
  Mutation: {
    createBoard: (_, { boardInput }) => {
      const { writer, title, contents } = boardInput;
      const isWritter = boardDB.some((board) => board.writer === writer);
      if (isWritter === true)
        return { success: false, message: "new board failed" };
      const newBoard = {
        number: boardDB.length + 1,
        writer,
        title,
        contents,
      };
      boardDB.push(newBoard);
      return { success: true, message: "new board success" };
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
