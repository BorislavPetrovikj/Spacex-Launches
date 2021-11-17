import styles from "../styles/Home.module.css";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

const Rocket = ({ launches }) => {
  let { id } = useParams();
  console.log(id)
  return (
    <div className={styles.grid}>
      {launches.map((launch) => {
        return (
          <a
            key={launch.id}
            href={launch.links.video_link}
            className={styles.card}
          >
            <img
              className={styles.image}
              alt="image not available"
              src={launch.links.mission_patch}
            />
            <h3>{launch.mission_name}</h3>
            <span>
              <strong>Rocket:</strong> {launch.rocket.rocket.id}{" "}
            </span>
            <br></br>
            <span>
              <strong>Launch Date:</strong>{" "}
              {new Date(launch.launch_date_local).toLocaleDateString("en-US")}
            </span>
            <br></br>
            <span>
              <strong>Location:</strong> {launch.launch_site.site_name_long}{" "}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default Rocket;

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      {
        launchesPast(limit: 10, offset: 30) {
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
            rocket_type
            rocket_name
            rocket {
              id
            }
          }
        }
      }
    `,
  });
  return {
    props: {
      launches: data.launchesPast,
    },
  };
}
