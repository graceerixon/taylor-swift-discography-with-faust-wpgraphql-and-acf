import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";

const GET_SONG_DETAILS = gql`
  query getSongDetails($songSlug: ID!) {
    song(id: $songSlug, idType: SLUG) {
      songs {
        songTitle
        lyrics
        length
        genre {
          name
        }
      }
    }
  }
`;

export default function Song() {
  const { query = {} } = useRouter();
  const { songSlug } = query;

  const { loading, error, data } = useQuery(GET_SONG_DETAILS, {
    variables: { songSlug }
  });

  const songData = data?.song?.songs;

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Layout>
      <Link href="/albums">
        <p className="backButton"> &#x2190; View All Albums</p>
      </Link>
      <h1 className="title">{songData.songTitle}</h1>
      <p className="details">Song Length: {songData.length}</p>
      <p className="details">
        Genre:&nbsp;
        {songData
          .genre.map((genre) => genre.name)
          .join(", ")}
      </p>
      <h3 className="details">Lyrics</h3>
      <div className="details lyrics">{songData.lyrics}</div>
    </Layout>);
}
