import { Layout } from "components/Layout";
import Router from "components/Router";
import Loader from "components/loader/Loader";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState(false);
  const [isAuthenticated, seIsAuthenticated] = useState(!!auth?.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) =>
      user ? seIsAuthenticated(true) : seIsAuthenticated(false)
    );
    setInit(true);
  }, [auth]);

  return (
    <Layout>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </Layout>
  );
}
