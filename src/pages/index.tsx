import type { NextPage } from "next";
import Head from "next/head";
import AuthForm from "@/components/auth/AuthForm";
import { useState } from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Next.js boilerplate</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <AuthForm />
      </div>
    </>
  );
};

export default Home;
