import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useAddressAutocomplete } from "../utilities/getAddress";
import { useEmailValidation } from "../utilities/validatemail";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleInitial: yup.string().max(1, "Only one character allowed"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  dob: yup.date().required("Date of birth is required"),
  address: yup.string().required("Address is required"),
  tier: yup.string().required("Tier selection is required"),
  billing: yup.string().required("Billing cycle is required"),
});

const SignUpForm = ({ onSubmitForm }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const emailValidationApiKey = process.env.REACT_APP_EMAIL_VALIDATION_API_KEY;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Use our custom hooks from utility files
  const { 
    validateEmail, 
    validationResult: emailValidationResult 
  } = useEmailValidation(emailValidationApiKey);

  const {
    scriptStatus,
    handleScriptLoad,
    handleScriptError,
    onAutocompleteLoad,
    onPlaceChanged,
    autocompleteOptions
  } = useAddressAutocomplete({}, setValue);

  const handleEmailBlur = (e) => {
    validateEmail(e.target.value);
  };

  return (
    <>
      {scriptStatus.error && (
        <div className="error-message">
          Error loading Google Maps API: {scriptStatus.errorMessage}
        </div>
      )}

      <LoadScript
        googleMapsApiKey={googleMapsApiKey}
        libraries={["places"]}
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="signup-form">
          <div className="form-group">
            <input {...register("firstName")} placeholder="First Name" />
            <p className="error">{errors.firstName?.message}</p>
          </div>

          <div className="form-group">
            <input {...register("middleInitial")} placeholder="Middle Initial" />
            <p className="error">{errors.middleInitial?.message}</p>
          </div>

          <div className="form-group">
            <input {...register("lastName")} placeholder="Last Name" />
            <p className="error">{errors.lastName?.message}</p>
          </div>

          <div className="form-group">
            <input
              {...register("email")}
              placeholder="Email"
              onBlur={handleEmailBlur}
            />
            <p className="error">{errors.email?.message}</p>
            {emailValidationResult.isValid === false && (
              <p className="error">Invalid email address</p>
            )}
            {emailValidationResult.isValidating && (
              <p className="info">Validating email...</p>
            )}
          </div>

          <div className="form-group">
            <input type="date" {...register("dob")} />
            <p className="error">{errors.dob?.message}</p>
          </div>

          <div className="form-group">
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
              options={autocompleteOptions}
            >
              <input
                {...register("address")}
                placeholder="Start typing your address..."
              />
            </Autocomplete>
            <p className="error">{errors.address?.message}</p>
          </div>

          <div className="form-group">
            <select {...register("tier")}>
              <option value="">Select Tier</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <p className="error">{errors.tier?.message}</p>
          </div>

          <div className="form-group">
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Annual"
                  {...register("billing")}
                />{" "}
                Annual
              </label>
              <label>
                <input
                  type="radio"
                  value="Monthly"
                  {...register("billing")}
                />{" "}
                Monthly
              </label>
            </div>
            <p className="error">{errors.billing?.message}</p>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </LoadScript>
    </>
  );
};

export default SignUpForm;