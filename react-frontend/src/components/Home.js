import React from "react";

const Home = () => {

  return (
    <div style={{ marginLeft: 10, marginTop: 10, padding: 0 }}>
      <header className="jumbotron" style={{ width: "98vw", paddingLeft: 50, paddingRight: 50 }}>
        <h3>Research Topic Specific Expert Identification using Deep Learning</h3><br />
        <p style={{ textAlign: "justify" }}>We have to identify Technical Experts for guiding students based on research topic.
          And selecting the best among large number of experts is really tough task, as we have to
          go-through their publications, research papers, journals and their domain specific work,
          which is time-taking process. So, in order to save time and to select the best expert,
          the project proposes automation which will automate everything using Deep Learning Natural
          Language Processing techniques.</p>
      </header>
      <footer style={{ bottom: 0, position: "absolute", left: 0, right: 0 }}>
        <div style={{ textAlign: "center", lineHeight: 0.5 }}>
          <p><b>Developed by</b></p>
          <p>Shubham Agarwal</p>
          <p>2019202052, MCA (2019-22)</p>
          <p><b>Under the guidance of</b></p>
          <p>Dr. Ranjani Parthasarathi </p>
          <p>College of Engineering Guindy, Anna University, Chennai</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
