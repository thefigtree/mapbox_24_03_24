import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Map from "@/components/map";
import StoryCard from "@/components/StoryCard";
import { Component } from "react";
import { getSortedPostsData } from "@/libs/posts";

const postsDirectory = "public/content/posts";

export async function getServerSideProps() {
  const postsData = await getSortedPostsData(postsDirectory);
  const today = new Date();
  const todayString = today.toJSON();

  // console.log(postsData.length)
  var minDistance = 200;
  var stopIndex = 0;

  function find_start_date(index, item, todayString) {
    const postDate = item.id;
    const todayDate = todayString;
    // console.log(postDate, todayDate)

    const postDateNum = postDate.substring(0, 2) + postDate.substring(3, 5);
    const todayDateNum = todayDate.substring(5, 7) + todayDate.substring(8, 10);
    const time_distance = parseInt(todayDateNum) - parseInt(postDateNum);

    if ((time_distance > 0) & (time_distance < minDistance)) {
      minDistance = time_distance;
      stopIndex = index;
    }
    console.log(postDateNum, todayDateNum, time_distance);
  }

  postsData.map((item, index) => find_start_date(index, item, todayString));

  var pastPosts = postsData.slice(0, stopIndex);
  var futurePosts = postsData.slice(stopIndex);
  const datedSortedPosts = futurePosts.concat(pastPosts);

  console.log(today, stopIndex, datedSortedPosts[0], datedSortedPosts.length);

  return {
    props: {
      datedSortedPosts,
    },
  };
}

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.flyTo = this.flyTo.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.state = {};
  }

  async flyTo(event) {
    const lng = event.target.dataset.lng;
    const lat = event.target.dataset.lat;

    const trigger = document.getElementById("trigger");
    trigger.setAttribute("data-lat", lat);
    trigger.setAttribute("data-lng", lng);
    trigger.click();
  }

  async zoomOut() {
    console.log("Zooming Out");
  }

  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Mapbox_24_03_24</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <Map
            width="65vw"
            height="100vh"
            data={this.props.datedSortedPosts}
            zoom="2"
            lng="126.7052"
            lat="37.4563"
          ></Map>
          <div className={styles.timeline}>
            {this.props.datedSortedPosts.map((item, index) => (
              <StoryCard
                key={index}
                item={item}
                flyTo={this.flyTo}
                zoomOut={this.zoomOut}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }
}
