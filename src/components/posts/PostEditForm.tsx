import AuthContext from "context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostEditForm() {
  const params = useParams();

  const [content, setContent] = useState("");
  const [post, setPOst] = useState<PostProps>();
  const navigate = useNavigate();

  const handelFileUpload = () => { };

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);

      setPOst({ ...(docSnap.data() as PostProps), id: docSnap.id });
      setContent((docSnap?.data() as PostProps).content);
    }
  }, [params.id]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post.id);

        await updateDoc(postRef, {
          content: content,
        });
        setContent("");

        navigate(`/posts/${post.id}`);
        toast.success("게시글을 수정했습니다.");
      }
    } catch (e: any) {

      toast.error(e?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        required
        name="content"
        id="content"
        placeholder="What is happening?"
        value={content}
        onChange={onChange}
      ></textarea>
      <div className="post-form__submit-area">
        <div className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </div>
        <input
          type="file"
          name="input-file"
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
  );
}
