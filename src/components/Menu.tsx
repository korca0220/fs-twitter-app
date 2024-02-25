import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { useContext } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useTranslation } from "hooks/useTranslation";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function MenuList() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const t = useTranslation();

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
          {t("MENU_HOME")}
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          {t("MENU_PROFILE")}
        </button>
        <button type="button" onClick={() => navigate("/search")}>
          <AiOutlineSearch />
          {t("MENU_SEARCH")}
        </button>
        <button type="button" onClick={() => navigate("/Notifications")}>
          <IoMdNotificationsOutline />
          {t("MENU_NOTI")}
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/user/login")}>
            <MdLogin />
            {t("MENU_LOGIN")}
          </button>
        ) : (
          <button type="button" onClick={handleClickLogout}>
            <MdLogout />
            {t("MENU_LOGOUT")}
          </button>
        )}
      </div>
    </div>
  );
}
