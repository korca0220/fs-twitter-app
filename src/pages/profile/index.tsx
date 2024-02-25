import { languageState } from "atom";
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
import { useRecoilState } from "recoil";

const PROFILE_DEFAULT_URL = "/logo192.png";
type TabType = "my" | "likes";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [language, setLanguage] = useRecoilState(languageState);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");

      const myPostQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const likePostQuery = query(
        postsRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(myPostQuery, (snapshot) => {
        let dataobj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        console.log(dataobj);
        setMyPosts(dataobj as PostProps[]);
      });

      onSnapshot(likePostQuery, (snapshot) => {
        let dataobj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikePosts(dataobj as PostProps[]);
      });
    }
  }, []);

  const onClickLanguage = () => {
    setLanguage(language == "ko" ? "en" : "ko");

    localStorage.setItem("language", language == "ko" ? "en" : "ko");
  };

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
          <div className="profile__flex">
            <button
              type="button"
              onClick={() => navigate("/profile/edit")}
              className="profile__btn"
            >
              프로필 수정
            </button>
            <button
              type="button"
              onClick={onClickLanguage}
              className="profile__btn--language"
            >
              {language == "ko" ? "한국어" : "English"}
            </button>
          </div>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "Google님"}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div
            className={`home__tab ${activeTab === "my" && "home__tab--active"}`}
            onClick={() => setActiveTab("my")}
          >
            For U
          </div>
          <div
            className={`home__tab ${
              activeTab === "likes" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("likes")}
          >
            Likes
          </div>
        </div>
        {activeTab === "my" && (
          <div className="post">
            {myPosts?.length > 0 ? (
              myPosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">게시글이 없습니다.</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="post">
            {likePosts?.length > 0 ? (
              likePosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">게시글이 없습니다.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
