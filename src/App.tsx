import { Layout } from "components/Layout";
import Router from "components/Router";
import { app } from "firebaseApp";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

function App() {
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
      {init ? <Router isAuthenticated={isAuthenticated} /> : "Loading"}
    </Layout>
  );
}

export default App;
