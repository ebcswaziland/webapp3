// PhoneSignInComponent.js
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import {
  doc,
  getDoc
} from "firebase/firestore";
import OtpInput from "otp-input-react";
import React, { useState } from "react";
import { BsFillShieldLockFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import fireDB from "../fireConfig";
function PhoneSignInComponent({ setShowPhoneSignIn }) {
  //   const history = useHistory();
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const auth = getAuth();

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => { },
        },
        auth
      );
    }
  }

  async function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const documentPath = "clerk/" + ph; // Your document path
    const documentRef = doc(fireDB, documentPath); // Create a reference to the document

    // Now, you can fetch the document's data
    try {
      const docSnapshot = await getDoc(documentRef);
      if (docSnapshot.exists()) {
        localStorage.setItem("phone", ph);

        const mp = docSnapshot.data();
        const mpData = {
          pollURL: mp.pollURL,
          pollingStation: mp.pollingStation,
          primaryPollUrl: mp.primaryPollUrl,
        };
        localStorage.setItem("poll", mpData.pollURL);
        localStorage.setItem("primary_poll", mpData.primaryPollUrl);
        localStorage.setItem("pollstation", mpData.pollingStation);

        // Check if 'mymap' exists in the document and if it's an object
        if (mp.hasOwnProperty('REGISTER') && typeof mp.REGISTER === 'object' && mp.REGISTER !== null) {
          const mymapData = mp.REGISTER; // Assuming 'mymap' is an object

          // Store the 'mymapData' object in localStorage
          localStorage.setItem("mymapData", JSON.stringify(mymapData));
        }

        // Check if 'mymap' exists in the document and if it's an object
        if (mp.hasOwnProperty('REGISTER2') && typeof mp.REGISTER2 === 'object' && mp.REGISTER2 !== null) {
          const mymapData2 = mp.REGISTER2; // Assuming 'mymap' is an object

          // Store the 'mymapData' object in localStorage
          localStorage.setItem("mymapData2", JSON.stringify(mymapData2));
        }

        console.log(mp.pollURL);
        console.log("UR DATA " + mp.REGISTER);

        const appVerifier = window.recaptchaVerifier;

        const formatPh = "+" + ph;
        console.log(" snapshot " + docSnapshot);
        localStorage.setItem("currentUser", docSnapshot);

        signInWithPhoneNumber(auth, formatPh, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setLoading(false);
            setShowOTP(true);
            toast.success("OTP sent successfully!");
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } else {
        toast.error("Failed to send OTP !");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  }

  function logErrorToTxtFile(error, phoneNumber, pageName) {
    const currentTime = new Date().toLocaleString();
    const logEntry = `Time: ${currentTime}, Phone Number: ${phoneNumber}, Page: ${pageName}, Error: ${error.message}\n`;


  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);

        // Assuming 'res' contains user data or other relevant information after OTP verification.
        // You can capture this data and store it in localStorage.
        const userData = {
          // Example: Capture user ID, name, or any other relevant data from 'res'.
          // Replace these with the actual properties you want to store.
          userId: res.user.uid,
          userName: res.user.displayName,
        };

        // Store user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("TAB", "mps");
        localStorage.setItem("mystation", "");


        setLoading(false);
        setShowPhoneSignIn(true); // Hide the phone sign-in component after successful login

        // Handle any further actions after phone sign-in here
        // Example: Redirect to a different page
        window.location.href = "/admin/";
      })
      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }

  return (
    <div>
      <div id="recaptcha-container"></div>
      <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
        <h1 className="text-center leading-normal text-black font-medium text-3xl mb-6">
          EBC Votes Capturing - ADMIN
        </h1>
        {showOTP ? (
          <>
            <div className="bg-black text-emerald-500 w-fit mx-auto p-4 rounded-full">
              <BsFillShieldLockFill size={30} />
            </div>
            <label
              htmlFor="otp"
              className="font-bold text-xl text-black text-center"
            >
              Enter your OTP
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              OTPLength={6}
              otpType="number"
              disabled={false}
              autoFocus
              className="otp-container "
            ></OtpInput>
            <button
              onClick={onOTPVerify}
              className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-black rounded"
            >
              {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
              <span>Verify OTP</span>
            </button>
          </>
        ) : (
          <>
            <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full"></div>
            <label
              htmlFor=""
              className="font-bold text-xl text-black text-center"
            >
              {/* <BsTelephoneFill size={16} /> */}
              Enter your phone number
            </label>
            <PhoneInput country={"sz"} value={ph} onChange={setPh} />
            <button
              onClick={onSignup}
              className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
            >
              {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
              <span>Login</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PhoneSignInComponent;
