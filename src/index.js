import ReactDOM from 'react-dom/client'
import App from './App'
// Importing Tailwind css
import './index.css'

// Importing and settung up Apollo client for GraphQL
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: '/graphql',
  }),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
