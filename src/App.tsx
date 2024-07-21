import { useEffect, useState } from 'react';
import './App.css';

interface PostsInterface {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [posts, setPosts] = useState<PostsInterface[]>([] as PostsInterface[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Error! Network response was not ok');
        }
        const data: PostsInterface[] = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error as Error);
      } finally {

        setLoading(false);
      }
    }

    fetchPost();
  }, []);
  return (
    <div style={{ padding: '20px', }}>
      <h1>CRA + TS + TESTING</h1>
      <p>{loading ? 'Loading' : null}</p>
      <p>{!loading ? 'Loaded' : null}</p>
      <p>{error ? error.message : null}</p>
      {posts && posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
