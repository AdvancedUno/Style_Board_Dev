import Image from "next/image";
import AddPost from "./components/addPosts";
import GetFeed from "./feed";


export default function Home() {

  return (
    <main>
      <AddPost/>
      <GetFeed/>
    </main>
  );
}
