import React, { useState } from "react";
import "./Profile.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/esm/Spinner";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Profile() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    // redirect to register page if not logged in
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/register");
   

    // fetching  user details from the server
    const userInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    
})
// user instance request interceptor 
userInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("userAuthToken");
    request.headers.Authorization = `Bearer ${token}`
    return request
})
    const fetchData = async () => {
      const token = localStorage.getItem("userAuthToken");

      const { data } = await axios.get(
       ` ${process.env.REACT_APP_USER_SERVER_API}/userDetails`,
        {},
        {Headers:`Bearer ${token}`}
      );
      if (data.status) {
        setName(data.user.userName);
        setProfileUrl(data.user.profileUrl);
      } else {
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  // handing the image upload

  const handleSubmit = async () => {
    // abort if no image selected

    if (!image) {
      toast.error("select an image", { position: "top-center" });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data } = await axios.post(
        `${process.env.REACT_APP_USER_SERVER_API}/upload_image`,
        { image, profileUrl },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (data.status) {
        setProfileUrl(data.profileUrl);
        toast(data.message, { position: "top-center" });
        setImage(null);
        setEdit(false);
      } else {
        toast.error(data.error, { position: "top-center" });
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong", { position: "top-center" });
    }
  };
  // canceling the request
  const handleCancelUpload = () => {
    const controller = new AbortController();
    controller.abort();
    setImage(null);
    setEdit(false);
  };

  // logging out then user

  const logout = () => {
    localStorage.removeItem("userAuthToken");
    navigate("/register");
  };
  return (
    <>
      <nav>
        <div>
          <h2>Welcome ! {name}</h2>
        </div>
        <button className="bg-danger" onClick={logout}>
          logout
        </button>
      </nav>
      <div
        style={{
          backgroundImage: `url(${
            profileUrl
              ? process.env.REACT_APP_USER_SERVER_API + profileUrl
              : "https://gbaglobal.org/wp-content/plugins/buddyboss-platform/bp-core/images/profile-avatar-buddyboss.png"
          })`,
        }}
        className="profilePic"
      ></div>
      {console.log(image, "nvdnssndljkds")}
      <div className="d-flex justify-content-center  pic rounded">
        {image ? (
          <img
            alt="Posts"
            width="200px"
            height="200px"
            src={URL.createObjectURL(image)}
          ></img>
        ) : (
          <div>
            <label htmlFor="image-upload">
              <div onClick={() => setEdit(true)} className="upload-icon-div">
                <span className="material-icons">cloud_upload</span>
                <span>upload</span>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>
      <div className="m-auto d-flex outline-0 justify-content-center">
        {edit ? (
          <div className="d-flex justify-content-end align-items-center my-2">
            {loading ? (
              <button className="imgUploadBtn  rounded">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <button onClick={handleSubmit} className="imgUploadBtn  rounded">
                Submit
              </button>
            )}
            <span
              style={{ display: image ? "" : "none" }}
              data-tooltip-content="Cancel"
              data-tooltip-id="cancel-tooltip"
              data-tooltip-place="bottom"
              onClick={handleCancelUpload}
              className="material-icons m-2 cancel-icon"
            >
              cancel
            </span>
            <Tooltip id="cancel-tooltip" />
          </div>
        ) : (
          ""
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default Profile;