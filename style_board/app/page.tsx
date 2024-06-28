"use client";

import Image from "next/image";
import AddPost from "./components/addPosts";
import GetFeed from "./feed";
import { useEffect, useState } from "react";
import Login from "./pages/loginPage";


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
      
      <GetFeed />
      </>
    </main>
  );
}
