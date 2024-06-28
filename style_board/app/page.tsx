"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Login from "./pages/loginPage";
import GetPosts from "./components/getPosts";
import AddPost from "./components/addPosts";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  useEffect(() => {
    // Check if the user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <main>
      {/* {isLoggedIn ? (
        <>
          <AddPost />
          <GetFeed />
        </>
      ) : (
        <>
          <Login />
        </>
      )} */}
      <>
      <AddPost />      
      <GetPosts/>

      </>
    </main>
  );
}
