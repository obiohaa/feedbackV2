// import React, { useState } from "react";
import "./setup.css";
import logo from "/theplace.png";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosFetch } from "../../Utility/AxiosFetch";
import Loading from "../../Components/Checks/Loading";
import Select from "react-select";
import customStyles from "../Main/CustomStyle";
import { Link, useNavigate } from "react-router-dom";

export default function CustomerFeedback() {
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    defaultValues: {
      manager: "",
      email: "",
      location: "",
    },
    // shouldUnregister: true,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  //Using react query to handle the API call POST
  const { mutate: logUser, isPending } = useMutation({
    mutationFn: async (logUser) => AxiosFetch.post("/setupFeedback", { ...logUser }),
    onSuccess: (data) => {
      console.log(data);
      //   navigate("/");
    },
    onError: (error) => {
      reset();
      navigate("/");
      console.log(error);

      toast.error(
        <div>
          <span>{error?.response?.data?.msg || error?.message || "Something went wrong"}</span>
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
    },
  });

  const onSubmit = (data) => {
    if (!data.manager?.trim() || !data.email?.trim() || !data.location?.trim()) {
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

    const payload = {
      ...data,
    };
    console.log(payload);

    logUser(payload);
  };

  //GET LOCATION RECORD
  const {
    isLoading: LoadingLocation,
    data,
    // error,
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

  //   if (error) {
  //     toast.error(
  //       <div>
  //         <span>
  //           {error.response ? error.response.data.msg : "Something went wrong contact Admin"}
  //         </span>
  //       </div>,
  //       {
  //         position: "top-center",
  //         autoClose: 8000,
  //         hideProgressBar: true,
  //         closeOnClick: false,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         className: "toastBad",
  //       },
  //     );
  //   }

  const outletOptions =
    data?.AllOutletLocations?.map((OutletLocation) => ({
      value: OutletLocation.OutletName, // clean value
      label: `Theplace ${OutletLocation.OutletName}`, // display
    })) || [];

  return (
    <div>
      <div className="feedback-container">
        <div className="form-section">
          <div className="card_setup">
            {/* HEADER */}
            <div className="header">
              <img src={logo} alt="logo" className="logo" />

              <div className="header-text">
                <h4>Feedback Setup Page</h4>
                {/* <p className="subtitle">Help us improve your experience</p> */}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
              {/* NAME */}
              <div className="form-group">
                <label>Manager's Name</label>
                <input
                  autoComplete="new-password"
                  {...register("manager", {
                    validate: (value) => (value && value.trim() !== "") || "Manager is required",

                    required: "Manager's name is required!",
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
                  placeholder="Manager's name"
                />
                {errors.manager && <span className="error">{errors.manager.message}</span>}
              </div>
              <div className="form-group">
                <label>Manager's Email</label>
                <input
                  autoComplete="new-password"
                  type="email"
                  //   name="email"
                  placeholder="Manager's email address"
                  formNoValidate
                  {...register("email", {
                    required: "Manager's Email address is required!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address!",
                    },
                  })}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
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

              <button
                disabled={isPending || isSubmitting}
                type="submit"
                className="submit-btn"
                formNoValidate>
                {isPending ? <Loading /> : "Submit Setup"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
