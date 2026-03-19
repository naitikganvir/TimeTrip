import { createContext, useContext, useState } from "react";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [user, setUser] = useState(
    userData?.type == "user"
      ? userData.data
      : {
        email: "",
        fullname: {
          firstname: "",
          lastname: "",
        }
      }
  );

  return (
    <userDataContext.Provider value={{ user, setUser }}>
      {children}
    </userDataContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(userDataContext);
  return { user, setUser };
};

export default UserContext;
