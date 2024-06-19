import "./Article.css";
import React from "react";
import Bg2 from "../Assets/Bg2.jpg";
import { FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Article = () => {
  const NavigateTo = useNavigate();
  function handleBackDashBoard(){
    setTimeout(() => {
      NavigateTo('/DashBoard');
  }, 500);
  }
  return (
    <div className="Container">
      <article>
        <div className="article-header fs-1" style={{cursor: 'pointer'}} onClick={handleBackDashBoard}>
          <FaArrowLeft />
          <h2 className="fw-bold text-success">About</h2>
        </div>
        <img src={Bg2} alt="bus_image" className="article-bg-img mb-3 rounded" />
        <h3 className="mb-4 fw-bold">
          Enhancing Accessibility: Mahendra College Transportation Services
        </h3>
        <p>
          At <strong>Mahendra College</strong>, accessibility is a top priority.
          With a sprawling campus and students hailing from various locations,
          the institution understands the importance of reliable transportation
          services. To address this need, the college has established its own
          fleet of buses dedicated to student transportation.
        </p>
        <h2 className="mb-3">Extensive Coverage</h2>
        <p>
          Our fleet of buses is meticulously planned to cover almost every
          important location within a radial distance of 55 kilometers from the
          college campus. Whether you reside in the heart of the city or in the
          outskirts, we ensure that our buses are accessible to you. We believe
          that access to education should not be hindered by geographical
          constraints.
        </p>
        <h2 className="mb-3">Commitment to Student Welfare</h2>
        <p>
          Operated by the Mahendra Educational Trust,{" "}
          <strong>Mahendra College</strong> takes pride in its commitment to
          student welfare. Our fleet comprises 150 buses, a testament to our
          dedication to providing convenient transportation solutions.
          Presently, 45 of these buses are actively serving our students, with
          each journey reflecting our commitment to safety, efficiency, and
          comfort.
        </p>
        <h2 className="mb-3">Ensuring a Seamless Experience</h2>
        <p>
          We understand that commuting to and from college can often be
          challenging. That's why we've invested in strategic bus routes and
          schedules to ensure a seamless transportation experience for our
          students. Whether you're attending early morning classes or staying
          late for extracurricular activities, our buses are here to serve you.
        </p>
        <h2 className="mb-3">Fostering Inclusivity</h2>
        <p>
          Accessibility isn't just about physical proximity; it's about
          fostering inclusivity. By providing reliable transportation services,
          we aim to create an environment where every student feels valued and
          supported. Our buses serve as more than just modes of transportation;
          they are symbols of our commitment to fostering a vibrant and
          inclusive campus community.
        </p>
        <h2 className="mb-3">Join Us on the Journey</h2>
        <p>
          At <strong>Mahendra College</strong>, we believe that education should
          be accessible to all. Join us on this journey as we strive to enhance
          accessibility and empower our students to reach their fullest
          potential. Together, let's pave the way for a brighter, more inclusive
          future.
        </p>
      </article>
    </div>
  );
};

export default Article;