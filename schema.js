const fetch = require('node-fetch');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');

let data = fetch(
        'http://api.icndb.com/jokes/random/30'
    ).then(response => response.json())
    .then(response => data = response.value);

const JokeType = new GraphQLObjectType({
    name: 'Joke',
    description: 'A Joke object obtained from the Internet Chuck Norris Database Joke API.',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (data) => {
                // console.log('requested id');
                return data.id;
            }
        },
        text: {
            type: GraphQLString,
            resolve: (data) => {
                // console.log('requested joke');
                return data.joke;
            }
        },
        categories: {
            type: new GraphQLList(GraphQLString),
            resolve: (data) => {
                // console.log(data.categories);
                return data.categories;
            }
        }
    })  
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            joke: {
                type: JokeType,
                args: {
                    id: {
                        type: GraphQLInt 
                    }
                },
                resolve: (root, args) => {
                    let joke;

                    if (args.id) {
                        let filteredJokes = data.filter((item) => {return item.id === args.id});
                        
                        if (filteredJokes.length > 0) {
                            joke = filteredJokes[0];
                        }
                    } else {
                        joke = data[Math.floor(Math.random() * data.length)]
                    }

                    return joke;
                }
            }
        })
    })
})