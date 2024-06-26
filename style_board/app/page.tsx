import Image from "next/image";
import AddPost from "./components/addPosts";
import GetPosts from "./components/getPosts";


export default function Home() {
  return (
    <main>
      <AddPost/>
      <GetPosts/>
    </main>
  );
}
