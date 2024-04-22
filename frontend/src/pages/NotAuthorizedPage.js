import React from "react";
import { Result, Button } from "antd";
import { Link, useHistory } from "react-router-dom";

const NotAuthorizedPage = () => {
  const history = useHistory();

  const redirectToLogin = () => {
    history.push("/login");
  };

  return (
    <div>
        <Result
      status="403"
      title="403"
      subTitle="Désolé, vous n'êtes pas autorisé à accéder à cette page."
      extra={
        <Button type="primary" onClick={redirectToLogin}>
          Aller à la page de connexion
        </Button>
      }
    />
    </div>
  );
};

export default NotAuthorizedPage;
