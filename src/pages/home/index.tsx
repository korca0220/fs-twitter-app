import { FiImage } from "react-icons/fi";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "test@test.com",
    content: "내용",
    createdAt: "2024-01-21",
    uid: "123",
  },
  {
    id: "2",
    email: "test@test.com",
    content: "내용",
    createdAt: "2024-01-21",
    uid: "123",
  },
  {
    id: "3",
    email: "test@test.com",
    content: "내용",
    createdAt: "2024-01-21",
    uid: "123",
  },
  {
    id: "4",
    email: "test@test.com",
    content: "내용",
    createdAt: "2024-01-21",
    uid: "123",
  },
  {
    id: "5",
    email: "test@test.com",
    content: "내용",
    createdAt: "2024-01-21",
    uid: "123",
  },
];

export default function HomePage() {
  const handelFileUpload = () => {};

  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home_tabs">
        <div className="home__tab home__tab--active">For U</div>
        <div className="home__tab">Following</div>
      </div>

      <form className="post-form">
        <textarea
          className="post-form__textarea"
          required
          name="content"
          id="content"
          placeholder="What is happening?"
        ></textarea>
        <div className="post-form__submit-area">
          <label htmlFor="file-input" className="post-from__file">
            <FiImage />
          </label>
          <input
            type="file"
            name="file-input"
            accept="image/*"
            onChange={handelFileUpload}
            className="hidden"
          ></input>
          <input
            type="submit"
            value="Tweet"
            className="post-form__submit-btn"
          ></input>
        </div>
      </form>
      {/* Tweet posts */}
      <div className="post">
        {posts?.map((post) => (
          <div className="post__box" key={post.id}>
            {post.content}
          </div>
        ))}
      </div>
    </div>
  );
}
