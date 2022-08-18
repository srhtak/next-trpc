import React, { useState } from "react";
import { trpc } from "@/utils/trpc";

const CreatePost = () => {
  const postMutatiton = trpc.useMutation(["post.createPost"]);
  const { data } = trpc.useQuery(["post.getPost", { id: 4 }]);
  const { data: users } = trpc.useQuery(["auth.allUser"]);
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

  const getPost = async () => {
    try {
      const usersResponse = users;
      const postResponse = data;
      console.log(postResponse);
      console.log(usersResponse);
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
      <button onClick={getPost}>get Post by Id</button>
    </div>
  );
};

export default CreatePost;
