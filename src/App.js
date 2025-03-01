import React from "react";
import SignUpForm from "./componets/SignupForm";

function App() {
  const handleFormSubmit = (data) => {
    console.log("User Data:", data);
    localStorage.setItem("users", JSON.stringify(data));
  };

  return (
    <div>
      <h1>User Sign-Up</h1>
      <SignUpForm onSubmitForm={handleFormSubmit} />
    </div>
  );
}

export default App;
