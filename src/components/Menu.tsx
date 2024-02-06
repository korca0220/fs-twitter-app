import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { useContext } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AiOutlineSearch } from "react-icons/ai";

export default function MenuList() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleClickLogout = async () => {
    const auth = getAuth(app);

    try {
      await signOut(auth);

      navigate("/");

      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navigate("/")}>
          <BsHouse />
          Home
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          Profile
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <AiOutlineSearch />
          Search
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/user/login")}>
            <MdLogin />
            Login
          </button>
        ) : (
          <button type="button" onClick={handleClickLogout}>
            <MdLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
