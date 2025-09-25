import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Documentation = () => {
  return (
    <div className="container py-5">
      {/* Intro Section */}
      <section id="intro" className="mb-5">
        <h2 className="mb-3">📖 ReachMagnet Documentation</h2>
        <p>
          <strong>ReachMagnet</strong> is a B2B networking platform that enables
          companies and users to connect, communicate, and collaborate. It
          supports multi-user logins, quotations, real-time chat, notifications,
          and package-based access.
        </p>
      </section>

      {/* Test Accounts */}
      <section id="accounts" className="mb-5">
        <h3 className="mb-3">👤 Test Accounts</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm p-3 mb-3">
              <h5>User Account</h5>
              <p>Email: <code>user@gmail.com</code></p>
              <p>Password: <code>123456789</code></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm p-3 mb-3">
              <h5>Business Account</h5>
              <p>Email: <code>ibra@gmail.com</code></p>
              <p>Password: <code>@Mo123456789</code></p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mb-5">
        <h3 className="mb-3">⚡ Features</h3>
        <ul className="list-group">
          <li className="list-group-item">
            Multi-user login with role-based dashboards (User & Business).
          </li>
          <li className="list-group-item">
            Real-time chat & notifications powered by Pusher.
          </li>
          <li className="list-group-item">
            Full 3-step quotation system: Buyer request → Seller response with
            tax → Buyer approval/rejection.
          </li>
          <li className="list-group-item">
            Advanced filtering for companies, products, and services.
          </li>
          <li className="list-group-item">
            Follow & unfollow companies to stay updated.
          </li>
          <li className="list-group-item">
            4-step business registration with validation using Formik & Yup.
          </li>
          <li className="list-group-item">
            Package system (Trial, Basic, Premium) with feature-based
            permissions.
          </li>
        </ul>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="mb-5">
        <h3 className="mb-3">🛠 Tech Stack</h3>
        <p>
          <strong>Frontend:</strong> React.js, JavaScript, Bootstrap, Zustand,
          Formik, Yup, Swiper, Axios, Pusher
        </p>
      </section>
            {/* Backend */}
      <section id="backend" className="mb-5">
        <h3 className="mb-3">⚙️ Backend</h3>
        <p className="mb-3">
          The backend is built with <strong>PHP Laravel</strong>.  
          It provides:
        </p>
        <ul className="list-group">
          <li className="list-group-item">RESTful API endpoints for frontend integration.</li>
          <li className="list-group-item">Authentication & authorization system.</li>
          <li className="list-group-item">Business logic for quotations, packages, and filtering.</li>
          <li className="list-group-item">Real-time communication support (Pusher).</li>
          <li className="list-group-item">Database management with MySQL.</li>
        </ul>
      </section>


      {/* How to Use */}
      <section id="usage" className="mb-5">
        <h3 className="mb-3">🚀 How to Use</h3>
        <ol>
          <li>Login using the test accounts above.</li>
          <li>Explore business dashboards, create posts, or send quotations.</li>
          <li>
            Try the chat and notification system to see real-time interactions.
          </li>
          <li>
            Switch between packages (Trial, Basic, Premium) to view feature
            restrictions.
          </li>
        </ol>
      </section>

      {/* Links */}
      <section id="links" className="mb-5">
        <h3 className="mb-3">🔗 Links</h3>
        <p>
          <a
            href="https://reach-magent-v01.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary me-3"
          >
            Live Demo
          </a>
          <a
            href="https://github.com/mohmedAmged/ReachMagent-V01"
            target="_blank"
            rel="noreferrer"
            className="btn btn-dark"
          >
            GitHub Repo
          </a>
        </p>
      </section>
    </div>
  );
};

export default Documentation;
