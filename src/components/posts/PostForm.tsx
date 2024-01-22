import { FiImage } from "react-icons/fi";

export default function PostForm() {
  const handelFileUpload = () => {};

  return (
    <form className="post-form">
      <textarea
        className="post-form__textarea"
        required
        name="content"
        id="content"
        placeholder="What is happening?"
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
