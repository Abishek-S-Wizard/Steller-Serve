import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Projects from "./components/Projects";
import HowWeWork from "./components/HowWeWork";
import JobDescription from "./components/JobDescription";
import Plans from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import MoreProjects from "./MoreProjects/MoreProjects";
import UserDashboard from "./userDashboard/UserDashboard";
import UserDetails from "./userDashboard/UserDetails";
import TaskManagement from "./userDashboard/TaskManagement";
import Notifications from "./userDashboard/Notifications";
import RatingReview from "./userDashboard/RatingReview";
import SupportHelp from "./userDashboard/SupportHelp";
import Settings from "./userDashboard/Settings";
import ServiceDashboard from "./serviceDashboard/ServiceDashboard";
import ServiceTaskManagement from "./serviceDashboard/TaskManagement";
import ServiceAttendance from "./serviceDashboard/Attendance";
import ServiceSalary from "./serviceDashboard/Salary";
import ServiceReview from "./serviceDashboard/ServiceReviews";
import Serviceadmin from "./serviceDashboard/ContactAdmin";
import ServiceProfile from "./serviceDashboard/ProfileManagement";
import ServiceNotifications from "./serviceDashboard/Notifications";
import ServiceReports from "./serviceDashboard/Reports";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import AdminTaskManagement from "./adminDashboard/AdminTaskManagement";
import Overview from "./adminDashboard/Overview";
import AdminUserManagement from "./adminDashboard/AdminUserManagement";
import AdminServiceManagement from "./adminDashboard/AdminServiceManagement";
import JobManagement from "./adminDashboard/JobManagement";
import SalaryManagement from "./adminDashboard/SalaryManagement";
import AdminAttendance from "./adminDashboard/AdminAttendance";
import Reports from "./adminDashboard/AdminReports";
import AdminSettings from "./adminDashboard/AdminSettings";
import AdminNotifications from "./adminDashboard/AdminNotifications";
import AdminSupport from "./adminDashboard/AdminSupport";
import AdminServiceSupport from "./adminDashboard/AdminServiceSupport";
import AdminContactMessages from "./adminDashboard/AdminContactUs";
import AdminReview from "./adminDashboard/AdminReview";


import LoginHome from "./auth/LoginHome";
import UserLogin from "./auth/UserLogin";
import AdminLogin from "./auth/AdminLogin";
import ServiceLogin from "./auth/ServiceLogin";


import UserRegister from "./auth/UserRegister";
import ServiceRegister from "./auth/ServiceRegister";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <AboutUs />
            <Projects />
            <HowWeWork />
            <JobDescription />
            <Plans />
            <Testimonials />
            <ContactUs />
            <Footer />
          </>
        }/>
        <Route path="/more-projects" element={<MoreProjects />} />
        <Route path="/login" element={<LoginHome />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/service-login" element={<ServiceLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/service-register" element={<ServiceRegister />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserDetails />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/ratings" element={<RatingReview />} />
        <Route path="/support" element={<SupportHelp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/service-dashboard" element={<ServiceDashboard />} />
        <Route path="/service-tasks" element={<ServiceTaskManagement />} />
        <Route path="/service-attendance" element={<ServiceAttendance />} />
        <Route path="/service-salary" element={<ServiceSalary />} />
        <Route path="/service-reviews" element={<ServiceReview />} />
        <Route path="/service-support" element={<Serviceadmin />} />
        <Route path="/service-profile" element={<ServiceProfile />} />
        <Route path="/service-notifications" element={<ServiceNotifications />} />
        <Route path="/service-reports" element={<ServiceReports />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-tasks" element={<AdminTaskManagement />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/users" element={<AdminUserManagement />} />
        <Route path="/services" element={<AdminServiceManagement />} />
        <Route path="/jobs" element={<JobManagement />} />
        <Route path="/salary" element={<SalaryManagement />} />
        <Route path="/attendance" element={<AdminAttendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/admin-notifications" element={<AdminNotifications />} />
        <Route path="/admin-support" element={<AdminSupport />} />
        <Route path="/service-supports" element={<AdminServiceSupport />} />
        <Route path="/admin-contact-messages" element={<AdminContactMessages />} />
        <Route path="/admin-reviews" element={<AdminReview />} />
      </Routes>
    </Router>
  );
}

export default App;
