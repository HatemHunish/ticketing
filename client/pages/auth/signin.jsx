import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(email, password);

    await doRequest();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"></input>
      </div>
      <div className="form-group">
        <label> Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>

      <button className="btn btn-primary mt-2"> Sign In</button>
      {errors}
    </form>
  );
}

export default SignIn;
