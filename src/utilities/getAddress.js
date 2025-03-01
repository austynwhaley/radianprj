// use for grabbing address

import { useState } from 'react';
export const useAddressAutocomplete = (options = {}, setValue) => {
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [scriptStatus, setScriptStatus] = useState({
    loaded: false,
    error: false,
    errorMessage: ''
  });

  const defaultOptions = {
    types: ['address'],
    componentRestrictions: { country: 'us' }
  };

  const autocompleteOptions = { ...defaultOptions, ...options };

  const handleScriptLoad = () => {
    setScriptStatus({
      ...scriptStatus,
      loaded: true
    });
    console.log("Google Maps script loaded successfully");
  };

  const handleScriptError = (error) => {
    setScriptStatus({
      loaded: false,
      error: true,
      errorMessage: error.message
    });
    console.error("Google Maps script loading error:", error);
  };

  const onAutocompleteLoad = (autocomplete) => {
    setAutocompleteRef(autocomplete);
    console.log("Autocomplete component loaded");
  };

  const onPlaceChanged = () => {
    if (autocompleteRef) {
      const place = autocompleteRef.getPlace();
      if (place && place.formatted_address) {
        setValue("address", place.formatted_address);
        console.log("Selected place:", place);
        
        if (place.address_components) {
          const postalCode = place.address_components.find(
            component => component.types.includes('postal_code')
          );
          
          if (postalCode) {
            // setValue("postalCode", postalCode.long_name);
          }
        }
        
        return place;
      } else {
        console.warn("Place selection did not return expected data");
        return null;
      }
    } else {
      console.warn("Autocomplete is not loaded yet!");
      return null;
    }
  };

  return {
    scriptStatus,
    handleScriptLoad,
    handleScriptError,
    onAutocompleteLoad,
    onPlaceChanged,
    autocompleteOptions
  };
};

export const AddressInput = ({ register, name, ...props }) => {
  return (
    <input
      {...register(name)}
      {...props}
    />
  );
};