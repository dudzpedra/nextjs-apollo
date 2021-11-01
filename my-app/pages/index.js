import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default function Home({ launches, miniverso }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextjs Apollo GraphQL</title>
        <meta name="description" content="Nextjs GraphQL App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Space-X Launches</h1>
        <p>Latest launches from SpaceX</p>

        <h2>{miniverso.default_title}</h2>
        <h2>{miniverso.base_link_url}</h2>

        <div className={styles.grid}>
          {launches.map((launch) => {
            return (
              <a
                key={launch.id}
                href={launch.links.video_link}
                className={styles.card}
                target="_blank"
                rel="noreferrer"
              >
                <h3>{launch.mission_name}</h3>
                <p>
                  <strong>Launch Date:</strong>{" "}
                  {new Date(launch.launch_date_local).toLocaleDateString(
                    "en-US"
                  )}
                </p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache(),
  });

  const client2 = new ApolloClient({
    uri: "https://miniverso.sanp.cloud/graphql",
    cache: new InMemoryCache(),
  });

  const READ_STORE = gql`
    query ReadStore {
      storeConfig {
        base_link_url
        default_title
      }
    }
  `;

  const storeInfo  = await client2.query({
    query: READ_STORE,
  });

  console.log(storeInfo.data.storeConfig)

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `,
  });

  return {
    props: {
      launches: data.launchesPast,
      miniverso: storeInfo.data.storeConfig
    },
  };
}
