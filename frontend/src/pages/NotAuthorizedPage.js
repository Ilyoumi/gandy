import React from "react";
import { Result, Button } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NotAuthorizedPage = () => {
  const history = useHistory();
  const { isLogged, handleLogout } = useAuth();

  const redirectToLogin = () => {
    if (isLogged) {
      handleLogout();
    }
    history.push("/login");
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle="Désolé, vous n'êtes pas autorisé à accéder à cette page."
        extra={
          <>
            <Button type="primary" onClick={redirectToLogin}>
              Aller à la page de connexion
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={goBack}>
              Retourner à la page précédente
            </Button>
          </>
        }
      />
    </div>
  );
};

export default NotAuthorizedPage;
