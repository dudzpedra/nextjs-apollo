import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default function Categories({ teste }) {
    console.log(teste)
    return (
        <div>
            <h1>Categorias</h1>
        </div>
    )
}

export async function getStaticProps() {
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: "https://miniverso.sanp.cloud/graphql"
    })

    const GET_CATEGORIES = gql`
        query GetCategories {
            categories (filters: {
                name: {
                    eq: "shirt"
                }
            }) {
                items: {
                    created_at
                }
            }
        }
    `

    return {
        props: {
            teste: ["a", "b", "c"]
        }
    }
}