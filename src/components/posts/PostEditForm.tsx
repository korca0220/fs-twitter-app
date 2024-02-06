import AuthContext from "context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidV4 } from "uuid";
import PostHeader from "./PostHeader";

export default function PostEditForm() {
  const params = useParams();

  const [content, setContent] = useState("");
  const [post, setPost] = useState<PostProps>();
  const navigate = useNavigate();
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  const handelFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);

      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
      setContent((docSnap?.data() as PostProps).content);
      setTags(docSnap?.data()?.hashTags);
      setImageFile((docSnap?.data() as PostProps).imageUrl ?? null);
    }
  }, [params.id]);

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);
    e.preventDefault();
    const key = `${user?.uid}/${uuidV4()}`;
    const storageRef = ref(storage, key);
    try {
      if (post) {
        if (post?.imageUrl) {
          let imageRef = ref(storage, post?.imageUrl);
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          });
        }

        let imageUrl = "";
        if (imageFile) {
          const data = await uploadString(storageRef, imageFile, "data_url");

          imageUrl = await getDownloadURL(data?.ref);
        }

        const postRef = doc(db, "posts", post.id);

        await updateDoc(postRef, {
          content: content,
          hashTags: tags,
          imageUrl,
        });

        setImageFile(null);
        setContent("");
        setIsSubmitting(false);

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

  const removeTag = (tag: string) => {
    setTags(tags.filter((val) => val !== tag));
  };

  const onChangeHashTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashTag(e?.target.value?.trim());
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      if (tags?.includes(e.target.value.trim())) {
        toast.error("같은 태그가 있습니다.");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="post">
      <PostHeader />
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
        <div className="post-form__hashtags">
          <span className="post-form__hashtags-outputs">
            {tags?.map((tag, index) => (
              <span
                className="post-form__hashtags-tag"
                key={index}
                onClick={() => removeTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </span>

          <input
            className="post-form__input"
            name="hashtag"
            id="hashtag"
            placeholder="해시태그 + 스페이스바 입력"
            onChange={onChangeHashTag}
            onKeyUp={handleKeyUp}
            value={hashTag}
          ></input>
        </div>
        <div className="post-form__submit-area">
          <div className="post-form__image-area">
            <label htmlFor="file-input" className="post-form__file">
              <FiImage className="post-form__file-icon" />
            </label>
          </div>
          <input
            type="file"
            name="file-input"
            id="file-input"
            accept="image/*"
            onChange={handelFileUpload}
            className="hidden"
          ></input>
          {imageFile && (
            <div className="post-form__attachment">
              <img src={imageFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImage}
              >
                Clear
              </button>
            </div>
          )}
          <input
            type="submit"
            value="Tweet"
            className="post-form__submit-btn"
            disabled={isSubmitting}
          ></input>
        </div>
      </form>
    </div>
  );
}
