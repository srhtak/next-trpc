import NextError from 'next/error';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';

const PostById = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.useQuery(['post.getPostById', { id }]);

  if (postQuery.error) {
    return (
     <div className='text-red-500 h-screen w-full flex justify-center items-center'>
      {postQuery.error.message}
     </div>
    );
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return (
    <>
      <h1>{postQuery.status === 'success' && data?.title}</h1>
      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      
    </>
  );
};

export default PostById;