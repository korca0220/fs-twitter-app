import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PROFILE_DEFAULT_URL = "/logo192.png";

export default function ProfilePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postQuery, (snapshot) => {
        let dataobj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataobj as PostProps[]);
      });
    }
  }, []);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile"
            className="profile__image"
            width={100}
            height={100}
          />
          <button
            type="button"
            onClick={() => navigate("/profile/edit")}
            className="profile__btn"
          >
            프로필 수정
          </button>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "Google님"}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For U</div>
          <div className="home__tab">Likes</div>
        </div>
        <div className="post">
          {posts?.length > 0 ? (
            posts?.map((post) => <PostBox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
