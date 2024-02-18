import { CommentProps } from "components/comments/CommentBox";
import { UserProps } from "components/following/FollowingBox";
import PostBox from "components/posts/PostBox";
import PostForm from "components/posts/PostForm";
import AuthContext from "context/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { useCallback, useContext, useEffect, useState } from "react";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: CommentProps[];
  hashTags?: string[];
  imageUrl?: string;
}

type TabType = "all" | "following";

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([""]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { user } = useContext(AuthContext);

  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user.uid);

      onSnapshot(ref, (doc) => {
        setFollowingIds([]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIds((prev) => (prev ? [...prev, user?.id] : []))
          );
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postQuery = query(postsRef, orderBy("createdAt", "desc"));
      let followingQuery = query(
        postsRef,
        where("uid", "in", followingIds),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postQuery, (snapshot) => {
        let dataobj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataobj as PostProps[]);
      });

      onSnapshot(followingQuery, (snapshot) => {
        let dataobj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setFollowingPosts(dataobj as PostProps[]);
      });
    }
  }, [followingIds, user]);

  useEffect(() => {
    if (user?.uid) {
      getFollowingIds();
    }
  }, [getFollowingIds, user?.uid]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Home</div>
        <div className="home__tabs">
          <div
            className={`home__tab ${
              activeTab === "all" && "home__tab--active"
            }`}
            onClick={() => {
              setActiveTab("all");
            }}
          >
            For U
          </div>
          <div
            className={`home__tab ${
              activeTab === "following" && "home__tab--active"
            }`}
            onClick={() => {
              setActiveTab("following");
            }}
          >
            Following
          </div>
        </div>
      </div>

      <PostForm />

      {/* Tweet posts */}

      {activeTab === "all" && (
        <div className="post">
          {posts?.length > 0 ? (
            posts?.map((post) => <PostBox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div className="post">
          {followingPosts?.length > 0 ? (
            followingPosts?.map((post) => <PostBox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
