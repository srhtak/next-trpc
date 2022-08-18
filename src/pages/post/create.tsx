import React, { useState } from "react";
import { trpc } from "@/utils/trpc";

const CreatePost = () => {
  const postMutatiton = trpc.useMutation(["post.createPost"]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postResponse = await postMutatiton.mutateAsync({
        title,
        content,
      });
      console.log(postResponse);
    } catch (error) {
      if (error instanceof Error && error != undefined) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="h-screen 100vw flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content"
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
