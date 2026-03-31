import React, { useState } from "react";
import "./component.css";
import logo from "/theplace.png";
import foodImage from "/nice.jpg";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import StarRating from "./StarRating";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosFetch } from "../Utility/AxiosFetch";
import Loading from "../Components/Checks/Loading";
import CheckMark from "../Components/Checks/GoodCheck";
import Select from "react-select";
import customStyles from "./CustomStyle";

// import { Link, useNavigate } from "react-router-dom";

// const emojiScale = [
//   { icon: "😡", label: "Very Bad" },
//   { icon: "😕", label: "Bad" },
//   { icon: "😐", label: "Okay" },
//   { icon: "😊", label: "Good" },
//   { icon: "😍", label: "Excellent" },
// ];

export default function CustomerFeedback() {
  // const navigate = useNavigate();
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [ambiance, setAmbiance] = useState(0);
  const [showCheck, setShowCheck] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      comment: "",
    },
    // shouldUnregister: true,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  //Using react query to handle the API call POST
  const { mutate: logUser, isPending } = useMutation({
    mutationFn: async (logUser) => AxiosFetch.post("/sendFeedback", { ...logUser }),
    onSuccess: (data) => {
      console.log(data);
      setShowCheck(true);
    },
    onError: (error) => {
      reset();
      setFood(0);
      setService(0);
      setAmbiance(0);

      // REMOVE THIS AFTER TESTING
      setShowCheck(true);
      console.log(error);

      // toast.error(
      //   <div>
      //     <span>{error?.response?.data?.msg || error?.message || "Something went wrong"}</span>
      //   </div>,
      //   {
      //     position: "top-center",
      //     autoClose: 5000,
      //     hideProgressBar: true,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     className: "toastBad",
      //   },
      // );
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    if (
      !data.name?.trim() ||
      !data.comment?.trim() ||
      !data.location?.trim() ||
      !data.phone?.trim()
    ) {
      toast.error(
        <div>
          <span>Please fill in all required fields.</span>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "toastBad",
        },
      );
      return;
    }

    // console.log("he click me");
    // console.log(isSuccess);
    // console.log(isError);

    const payload = {
      ...data,
      ratings: {
        food,
        service,
        ambiance,
      },
    };
    // console.log(payload);

    logUser(payload);
    setFood(0);
    setService(0);
    setAmbiance(0);
  };

  //GET LOCATION RECORD
  const {
    isLoading: LoadingLocation,
    error,
    data,
  } = useQuery({
    queryKey: ["locationData"],
    retryOnMount: true, //do not retry on mount
    refetchOnWindowFocus: false, //do not refetch on window focus
    refetchOnReconnect: true, //do not refetch on reconnect
    refetchOnMount: true, //do not refetch on mount
    refetchInterval: true, //do not refetch at intervals
    refetchIntervalInBackground: false, //do not refetch in background
    queryFn: async () => {
      const { data } = await AxiosFetch.get(
        "http://localhost:5000/api/v1/admins/getAllOutletLocationPublic",
      );
      // console.log(data);
      return data;
    },
  });

  // console.log(data.AllOutletLocations);

  if (error) {
    toast.error(
      <div>
        <span>
          {error.response ? error.response.data.msg : "Something went wrong contact Admin"}
        </span>
      </div>,
      {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "toastBad",
      },
    );
  }

  const outletOptions =
    data?.AllOutletLocations?.map((OutletLocation) => ({
      value: OutletLocation.OutletName, // clean value
      label: `Theplace ${OutletLocation.OutletName}`, // display
    })) || [];

  return (
    <div>
      <div className="feedback-container">
        <div className={`form-section ${showCheck ? "blurred" : ""}`}>
          <div className="card">
            {/* HEADER */}
            <div className="header">
              <img src={logo} alt="logo" className="logo" />

              <div>
                <h4>We value your feedback</h4>
                {/* <p className="subtitle">Help us improve your experience</p> */}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
              {/* <StarRating label="Food Quality" rating={food} setRating={setFood} />

              <StarRating label="Customer Service" rating={service} setRating={setService} />

              <StarRating label="Ambiance" rating={ambiance} setRating={setAmbiance} /> */}

              {/* NAME */}
              <div className="form-group">
                <label>Full Name</label>
                <input
                  autoComplete="new-password"
                  {...register("name", {
                    validate: (value) => (value && value.trim() !== "") || "Name is required",

                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum characters of 2 letters.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximum characters of 50 letters.",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/i,
                      message: "Alphabets and spaces only!",
                    },
                  })}
                  placeholder="Enter your name"
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label>Phone Number</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone Number is required!",
                    validate: (value) => {
                      if (!value) return "Phone Number is required!";

                      // Remove everything except digits
                      let digits = value.replace(/\D/g, "");

                      // Remove Nigeria country code if present
                      if (digits.startsWith("234")) {
                        digits = digits.slice(3);
                      }
                      // console.log(digits);
                      // Now enforce strict 10–11 digits
                      if (digits.length < 10 || digits.length > 10) {
                        return "Not a valid Nigerian phone number!";
                      }

                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      defaultCountry="NG"
                      // disableDropdown={true} // keeps 🇳🇬 but no dropdown
                      international={false} // keeps local format
                      placeholder="Enter your phone number"
                      className="field"
                      autoComplete="new-password"
                    />
                  )}
                />
                {errors.phone && <span className="error">{errors.phone.message}</span>}
              </div>

              <div className="form-group">
                <label>Outlet Locations</label>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required!" }}
                  render={({ field }) => (
                    <Select
                      styles={customStyles}
                      {...field}
                      options={outletOptions}
                      isLoading={LoadingLocation}
                      placeholder={LoadingLocation ? "Loading locations..." : "Select a location"}
                      components={{
                        ClearIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      onChange={(selected) => field.onChange(selected?.value)}
                      value={
                        field.value ? outletOptions.find((opt) => opt.value === field.value) : null
                      }
                    />
                  )}
                />
                {errors.location && <span className="error">{errors.location.message}</span>}
              </div>
              {/* COMMENT */}
              <div className="form-group">
                <label>Comments</label>
                <textarea
                  autoComplete="new-password"
                  rows="4"
                  maxLength={1000}
                  {...register("comment", {
                    validate: (value) =>
                      (value && value.trim().length >= 10) || "Minimum 10 characters",
                    required: "Comments required",
                    minLength: {
                      value: 10,
                      message: "Response must be at least 10 characters",
                    },
                  })}
                  placeholder="Tell us about your experience"
                />
                {errors.comment && <span className="error">{errors.comment.message}</span>}
              </div>

              <button
                disabled={isPending || isSubmitting}
                type="submit"
                className="submit-btn"
                formNoValidate>
                {isPending ? <Loading /> : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
        {showCheck && (
          <div className="overlay" onClick={() => setShowCheck(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <CheckMark onClose={() => setShowCheck(false)} />
            </div>
          </div>
        )}
        <div className="feedback-img">
          <img src={foodImage} alt="Food" className="feedbackImage" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
