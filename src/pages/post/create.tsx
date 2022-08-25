import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { util } from "vue/types/umd";

const CreatePost = () => {
  const utils = trpc.useContext()
  const { data: users } = trpc.useQuery(["auth.allUser"]);
  const postsQuery = trpc.useQuery(["post.allPosts"])
  const postMutatiton = trpc.useMutation("post.createPost",{
    async onSuccess(){
        await utils.invalidateQueries(["post.allPosts"])
    }
  });
  
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
      console.log(usersResponse);
    } catch (error) {
      if (error instanceof Error && error != undefined) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="h-screen 100vw">
      <form  onSubmit={handleSubmit}>
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
      <button className="inline" onClick={getPost}>get Post by Id</button>
      <div className="">
          {postsQuery.isLoading ? "Loading" : postsQuery.data?.map(data => <div key={data.id}>
            {JSON.stringify(data)}
          </div>)}
      </div>
    </div>
  );
};

export default CreatePost;
