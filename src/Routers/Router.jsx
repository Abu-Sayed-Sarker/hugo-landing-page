import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import UniversityDirectory from "../Pages/UniversityDirectory/UniversityDirectory";
import MainLayout from "../Layouts/MainLayout";
import UniversityEvents from "../Pages/Events/UniversityEvents";
import UniversityJobs from "../Pages/Jobs/UniversityJobs";
import UniDashboard from "../Pages/UniversityDirectory/UniDashboard";
import Overview from "../Pages/UniversityDirectory/Overview";
import Program from "../Pages/UniversityDirectory/Program";
import Events from "../Pages/UniversityDirectory/Events";
import TestimonialTab from "../Pages/UniversityDirectory/TestimonialTab";
import Gallery from "../Pages/UniversityDirectory/Gallery";
import ProgramDetails from "../components/ProgramDetails/ProgramDetails";
import LoginPage from "../Pages/Auth/LoginPage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import About from "../Pages/About/About";
import UserDashboard from "../Pages/UserDashboard/UserDashboard";
import MessageInterface from "../Pages/UserDashboard/MessageInterface";
import UniSignUp from "../Pages/Auth/UniSignUp";
import UniSignIn from "../Pages/Auth/UniSignIn";
import UniversityDashboard from "../Layouts/UniversityDashboard";
import UniMain from "../Layouts/University/UniMain";
import UniversityProfile from "../Layouts/University/UniversityProfile/UniversityProfile";
import Programs from "../Layouts/University/Programs/Programs";
import ProgramDetailRoute from "../Layouts/University/Programs/ProgramDetailRoute";
import UniEvents from "../Layouts/University/Events/UniEvents";
import UniGallery from "../Layouts/University/Gallery/UniGallery";
import Chat from "../Layouts/University/Chat/Chat";
import Testimonials from "../Layouts/University/Testimonials/Testimonials";
import JobsAndInternships from "../Layouts/University/JobsAndInternships/JobsAndInternships";
import StudentApprovals from "../Layouts/University/StudentApprovals/StudentApprovals";
import Settings from "../components/Settings/Settings";
import AdminMain from "../Layouts/Admin/AdminMain";
import AdminSignIn from "../Pages/Auth/AdminSignin";
import AdminDashboard from "../Layouts/Admin/AdminDashboard/AdminDashboard";
import Universities from "../Layouts/Admin/Universities/Universities";
import AIAssistant from "../components/AIAssistant/AIAssistant";
import AllUniversityPrograms from "../Pages/Programs/AllUniversityPrograms";
import ForgetPass from "../Pages/Auth/ForgetPass";
import VerifyOTP from "../Pages/Auth/VerifyOTP";
import ResetPass from "../Pages/Auth/ResetPass";
import UniProgramDetails from "../Pages/UniversityDirectory/UniProgramDetails";
import PrivacyPolicy from "../Pages/Policies/PrivacyPolicy";
import TermsConditions from "../Pages/Policies/TermsConditions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <h1>404</h1>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "/universities",
        element: <UniversityDirectory />,
      },
      {
        path: "/universities/:id",
        element: <UniDashboard />,
        children: [
          {
            path: "overview",
            element: <Overview />,
          },
          {
            path: "programs",
            element: <Program />,
          },

          {
            path: "events",
            element: <Events />,
          },
          {
            path: "testimonials",
            element: <TestimonialTab />,
          },
          {
            path: "gallery",
            element: <Gallery />,
          },
        ],
      },
      {
        path: "/program-details/:id",
        element: <ProgramDetails />,
      },
      {
        path: "/programs",
        element: <AllUniversityPrograms />,
      },
      {
        path: "/events",
        element: <UniversityEvents />,
      },
      {
        path: "/jobs",
        element: <UniversityJobs />,
      },
      {
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "/forget-pass",
        element: <ForgetPass />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "/reset-pass",
        element: <ResetPass />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/user",
        element: <UserDashboard />,
      },
      {
        path: "/message",
        element: <MessageInterface />,
      },
    ],
  },
  {
    path: "/login-page",
    element: <LoginPage />,
  },
  {
    path: "/university-login",
    element: <UniSignIn />,
  },
  {
    path: "/university-register",
    element: <UniSignUp />,
  },
  {
    path: "/admin",
    element: <AdminSignIn />,
  },
  {
    path: "/ai-assistant/:id?",
    element: <AIAssistant />,
  },
  {
    path: "/university",
    element: <UniMain />,
    children: [
      {
        path: "dashboard",
        index: true,
        element: <UniversityDashboard />,
      },
      {
        path: "profile",
        element: <UniversityProfile />,
      },
      {
        path: "programs",
        element: <Programs />,
      },
      {
        path: "program-details",
        element: <ProgramDetailRoute />,
      },
      {
        path: "events",
        element: <UniEvents />,
      },
      {
        path: "gallery",
        element: <UniGallery />,
      },
      {
        path: "testimonials",
        element: <Testimonials />,
      },

      {
        path: "jobs",
        element: <JobsAndInternships />,
      },
      {
        path: "approvals",
        element: <StudentApprovals />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminMain />,
    children: [
      {
        path: "dashboard",
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "universities",
        element: <Universities />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ]
  }
]);
