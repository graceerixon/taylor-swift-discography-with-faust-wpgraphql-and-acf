import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";

const GET_ALBUM_DETAILS = gql`
  query getAlbumDetails($albumSlug: ID!) {
    album(id: $albumSlug, idType: SLUG) {
      albums {
        albumTitle
        cover {
          mediaItemUrl
          altText
        }
        releaseDate
        trackList {
          ... on Song {
            id
            songs {
              songTitle
            }
            slug
          }
        }
      }
    }
  }
`;

export default function Album() {
  const { query = {} } = useRouter();
  const { albumSlug } = query;

  const { loading, error, data } = useQuery(GET_ALBUM_DETAILS, {
    variables: { albumSlug }
  });

  const albumData = data?.album?.albums;

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Layout>
      <Link href="/albums">
        <p className="backButton"> &#x2190; View All Albums</p>
      </Link>
      <h1 className="title">{albumData.albumTitle}</h1>
      <p className="details">Released on {albumData.releaseDate}</p>
      <img className="cover" src={albumData?.cover.mediaItemUrl} alt={albumData.cover.altText} />
      <h3 className="details">Track List</h3>
      <ol className="trackList">
        {albumData.trackList.map((song) => (
          <li className="listItem" key={song.id}>
            <Link href={`/songs/${song.slug}`}>
              <a>{song.songs.songTitle}</a>
            </Link>
          </li>
        ))}
      </ol>
    </Layout>
  );
}
