import AuthContext from "context/AuthContext";
import { useContext } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function MenuList() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

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
        {user === null ? (
          <button type="button" onClick={() => navigate("/user/login")}>
            <MdLogin />
            Login
          </button>
        ) : (
          <button type="button" onClick={() => navigate("/")}>
            <MdLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
