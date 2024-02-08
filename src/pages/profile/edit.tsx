import PostHeader from "components/posts/PostHeader";
import AuthContext from "context/AuthContext";
import { updateProfile } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { storage } from "firebaseApp";
import React, { useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidV4 } from "uuid";

export default function ProfileEdit() {
  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setDisplayName(value);
  };

  const onSubmit = async (e: any) => {
    let key = `${user?.uid}/${uuidV4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl = null;

    e.preventDefault();

    try {
      // if (user?.photoURL) {
      //   const imageRef = ref(storage, user?.photoURL);
      //   await deleteObject(imageRef);
      // }

      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, "data_url");
        newImageUrl = await getDownloadURL(data?.ref);

        if (user) {
          await updateProfile(user, {
            displayName,
            photoURL: newImageUrl || '',
          }).then(() => {
            toast.success("프로필이 업데이트 되었습니다.");

            navigate("/profile");
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user?.photoURL);
    }

    if (user?.displayName) {
      setDisplayName(user?.displayName);
    }
  }, [user?.photoURL]);

  return (
    <div className="post">
      <PostHeader />
      <form className="profile-form" onSubmit={onSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder="이름"
            onChange={onChange}
            value={displayName}
          ></input>
          {imageUrl && (
            <div className="post-form__attachment">
              <img src={imageUrl} alt="attachment" width={100} height={100} />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="post-form__clear-btn"
              >
                삭제
              </button>
            </div>
          )}

          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label className="post-form__file" htmlFor="file-input">
                <FiImage className="post-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            ></input>
            <input
              type="submit"
              value={"프로필 수정"}
              className="post-form__submit-btn"
            ></input>
          </div>
        </div>
      </form>
    </div>
  );
}
