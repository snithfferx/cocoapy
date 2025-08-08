import React from "react";
import Cookies from "js-cookie";
/* {
                "token":access_token,
                "expiration":expiration,
                "user":{
                    "userID":userID,
                    "name":user["username"],
                    "email":user["email"],
                    "role":user["role"],
                },
                "sessionID":sessionId
            } */
interface SessionManagerProps {
  loginResponse: {
    token: string;
    sessionID: string;
    expiration?: number;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    },
  };
  children?: React.ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ loginResponse, children }) => {
  React.useEffect(() => {
    if (loginResponse && loginResponse.token && loginResponse.user.id) {
      Cookies.set("session_token", loginResponse.token, {
        expires: loginResponse.expiration ? new Date(loginResponse.expiration * 1000) : undefined,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("user_id", String(loginResponse.user.id), {
        expires: loginResponse.expiration ? new Date(loginResponse.expiration * 1000) : undefined,
        secure: true,
        sameSite: "strict",
      });
    }
  }, [loginResponse]);

  return <>{children}</>;
};

export default SessionManager;
