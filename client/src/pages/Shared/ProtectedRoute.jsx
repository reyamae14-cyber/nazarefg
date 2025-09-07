/* eslint-disable react/prop-types */
// import React from 'react'
import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setData, setProfile } from "../../utils/profileSlice";

const ProtectedRoute = ({
  setLoaded,
  addProfile,
  editClick
}) => {
  const [auth, setAuth] = useState();
  const [ready, setReady] = useState();
  const location = useLocation();

  const dispatch = useDispatch();

  let selectedProfile = JSON.parse(localStorage.getItem("Profile")) ?? null;
  let hasSelectedProfile = localStorage.getItem("hasSelectedProfile") === "true";

  const getUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          withCredentials: true
        }
      };

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth`,
        config
      );
      return res.data.data;
    } catch (err) {
      return err.response.data.data;
    }
  };

  //getUser ////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();

      if (!user) {
        setAuth(false);
        setReady(true);
      } else {
        dispatch(setData(user));
        dispatch(setProfile(selectedProfile));
        setAuth(true);
        setReady(true);
        setLoaded(true);
        
        // If user is on browse route and has no selected profile or hasn't selected one before,
        // clear the hasSelectedProfile flag to force profile selection
        if (location.pathname === '/browse' && (!selectedProfile || !hasSelectedProfile)) {
          localStorage.removeItem('hasSelectedProfile');
        }
      }
    };
    fetchData();
  }, [addProfile, editClick, location.pathname]);

  return <>{ready && <>{auth ? <Outlet /> : <Navigate to="/" />}</>}</>;
};

export default ProtectedRoute;
