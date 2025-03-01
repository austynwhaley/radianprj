// validate emails
import axios from 'axios';
import {useState} from "react";

export const validateEmail = async (email, apiKey) => {
  if (!email || !apiKey) {
    console.error("Missing email or API key");
    return { isValid: false, error: "Missing email or API key" };
  }

  try {
    const response = await axios.get(
      `https://api.abstractapi.com/v1/email-validation?api_key=${apiKey}&email=${email}`
    );

    const isValidFormat = response.data.is_valid_format?.value;
    const isFreeEmail = response.data.is_free_email?.value;
    const isDisposable = response.data.is_disposable_email?.value;
    const deliverability = response.data.deliverability;

    return {
      isValid: isValidFormat && deliverability === "DELIVERABLE",
      isFreeEmail,
      isDisposable,
      details: response.data,
      error: null
    };
  } catch (error) {
    console.error("Email validation error", error);
    return {
      isValid: false,
      error: error.message || "Email validation failed"
    };
  }
};

export const useEmailValidation = (apiKey) => {
  const [validationResult, setValidationResult] = useState({
    isValid: null,
    isValidating: false,
    error: null,
    details: null
  });

  const validateEmailWithState = async (email) => {
    if (!email) return;
    
    setValidationResult({
      isValid: null,
      isValidating: true,
      error: null,
      details: null
    });

    try {
      const result = await validateEmail(email, apiKey);
      setValidationResult({
        isValid: result.isValid,
        isValidating: false,
        error: result.error,
        details: result.details
      });
      return result;
    } catch (error) {
      setValidationResult({
        isValid: false,
        isValidating: false,
        error: error.message,
        details: null
      });
      return { isValid: false, error: error.message };
    }
  };

  return {
    validationResult,
    validateEmail: validateEmailWithState
  };
};