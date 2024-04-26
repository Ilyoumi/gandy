import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Result
        status="403"
        title="403"
        subTitle={
          <div style={{ textAlign: "center" }}>
            <div>Nous sommes désolés, mais l'accès à cet espace est réservé aux utilisateurs autorisés uniquement.</div>
            <div>Si vous pensez qu'il s'agit d'une erreur ou si vous avez besoin d'accéder à cet espace pour des raisons légitimes,</div>
            <div>veuillez contacter l'administrateur système ou le support technique pour obtenir de l'aide. Merci de votre compréhension.</div>
          </div>
        }
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
