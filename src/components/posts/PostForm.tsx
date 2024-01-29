import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseApp";
import React, { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

export default function PostForm() {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);
  const handelFileUpload = () => {};

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
      });

      setContent("");

      toast.success("게시글을 생성했습니다.");
    } catch (e: any) {
      console.log(e);

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
