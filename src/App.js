import { useState, useEffect } from "react";

export function App() {
  const cachedEmail = localStorage.getItem("email");
  const cachedUsers = !!localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : {};
  const [isLogged, setIsLogged] = useState(!!cachedEmail);
  const [inputEmail, setInputEmail] = useState("");
  const [users, setUsers] = useState(cachedUsers);
  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    if (!!cachedEmail) {
      if (!!users[cachedEmail]) {
        setIsLogged(true);
        setInputEmail(cachedEmail);
      }
    }
    setIsValidEmail(validateEmail(inputEmail))
  }, [cachedEmail, users, inputEmail]);


  function onClickLogin() {
    setIsLogged(true);
    localStorage.setItem("email", inputEmail);
    if (!!users[inputEmail]) {
      let lastAcc = users[inputEmail].actualAccess;
      const newUsers = {
        ...users,
        [inputEmail]: {
          ...users[inputEmail],
          actualAccess: new Date().toLocaleString(),
          lastAccess: lastAcc,
          counter: users[inputEmail].counter + 1,
        },
      };
      setUsers(newUsers);
      localStorage.setItem("users", JSON.stringify(newUsers));
    } else {
      const newUsers = {
        ...users,
        [inputEmail]: {
          email: inputEmail,
          actualAccess: new Date().toLocaleString(),
          lastAccess: "",
          counter: 1,
        },
      };
      setUsers(newUsers);
      localStorage.setItem("users", JSON.stringify(newUsers));
    }
  }

  function onClickLogout() {
    setInputEmail("");
    setIsLogged(false);
    localStorage.removeItem("email");
  }

  function onChangeEmail(event) {
    const emailValue = event.target.value;
    setInputEmail(emailValue);
  }

  function validateEmail(){
    const mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;
    return mailformat.test(inputEmail);
  }

  return (
    <section>
      <div className="container d-flex flex-column align-items-center justify-content-start" style={{ height: '100vh', padding: '20px' }}>
        {isLogged && users[inputEmail] ? (
          <>
            {users[inputEmail].counter > 1 ? (
              <>
                <div className="row mb-2 w-100 justify-content-between">
                  <div className="col" style={{ fontSize: '130%' }}>
                    <pre>
                      <b>
                        <span title="Numero accessi">{users[inputEmail].counter}</span>     <span title="Ultimo accesso">{users[inputEmail].lastAccess}</span>
                      </b>
                    </pre>
                  </div>
                  <div className="col text-end">
                    <button id="button-logout" className="btn btn-primary" onClick={onClickLogout}>
                      Logout
                    </button>
                  </div>
                </div>
                <div className="text-center mt-auto mb-auto">
                  <h1>
                    Bentornat*<br /><br />{users[inputEmail].email}
                  </h1>
                </div>
              </>
            ) : (
              <>
                <div className="row mb-2 w-100">
                  <div className="col text-end">
                    <button id="button-logout" className="btn btn-primary" onClick={onClickLogout}>
                      Logout
                    </button>
                  </div>
                </div>
                <div className="text-center mt-auto mb-auto">
                  <h1>
                    Benvenut*<br /><br />{users[inputEmail].email}
                  </h1>
                </div>
              </>
            )}
          </>

        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <div style={{ boxShadow: '0px 0px 30px #dedede', padding: '100px', flexDirection: 'column' }}>
                <div>
                  <input
                    placeholder="Inserisci email"
                    value={inputEmail}
                    onChange={onChangeEmail}
                    className="form-control"
                  />
                </div><br></br>
                <div className="text-center">
                  <button id="button-login" className="btn btn-primary" onClick={onClickLogin} disabled={!isValidEmail}>
                    Login
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}