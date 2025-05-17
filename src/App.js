import "./App.scss";
import ls from "local-storage";
import React from "react";
import { OpenRoutes, PrivateRoutes } from "./routes/router";
import auth from "./services/auth";
import Spinner from "./elements/Spinner";
import AppContext from "./contexts/AppContext";
import { Helmet } from "react-helmet";

function App(props) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const authResult = new URLSearchParams(window.location.search);
  const afftoken = authResult.get("afftoken");

  const appContext = React.useMemo(
    () => ({
      updateUserObj: async (data) => {
        // console.log("UserUpdated", data);
        await checkLoggedIn();
      },
    }),
    []
  );

  const checkLoggedIn = async () => {
    var authenticated = await auth.isAuthenticated();
    if (authenticated) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);

      // chnage here
    }
  };

  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  const init = async () => {
    window.addEventListener("load", setVh);
    window.addEventListener("resize", setVh);
    await checkLoggedIn();
    setIsReady(true);
  };
  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    if (afftoken) {
      ls.set("afftoken", afftoken);
    }
  }, [afftoken]);

  if (isReady) {
    return (
      <>
        <Helmet>
          <title>{"FALGUN | ERP"}</title>
          <meta name="description" content={"Enterprise Resource Planning"} />
        </Helmet>
        <AppContext.Provider value={appContext}>
          {!isLoggedIn && <OpenRoutes {...props} />}
          {isLoggedIn && (
            <React.Fragment>
              <PrivateRoutes {...props} />
            </React.Fragment>
          )}
        </AppContext.Provider>
      </>
    );
  } else {
    return <Spinner />;
  }
}

export default App;
