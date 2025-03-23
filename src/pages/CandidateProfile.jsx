import React from 'react';

// Sample candidate data
const candidate = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  location: 'San Francisco, CA',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  summary:
    'Highly motivated Full Stack Developer with 5+ years of experience in web development, specializing in front-end and back-end technologies. Passionate about building scalable and efficient applications.',
  skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python'],
  experience: [
    {
      title: 'Full Stack Developer',
      company: 'XYZ Corp.',
      dates: 'June 2020 – Present',
      description:
        'Developed and maintained web applications using React, Node.js, and MongoDB. Collaborated with cross-functional teams to deliver features that improved application performance by 30%.',
    },
    {
      title: 'Software Engineer',
      company: 'ABC Inc.',
      dates: 'May 2018 – May 2020',
      description:
        'Designed and developed an e-commerce platform that increased sales by 20%. Led the migration from a monolithic architecture to a microservices-based architecture.',
    },
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: 'Graduated May 2018',
      coursework: ['Data Structures', 'Algorithms', 'Web Development', 'Cloud Computing'],
    },
  ],
};

const CandidateProfile = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>{candidate.name}</h1>
        <h3>{candidate.title}</h3>
        <p>{candidate.location}</p>
        <p>
          <strong>Email: </strong>{' '}
          <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
        </p>
        <p>
          <strong>Phone: </strong>{' '}
          <a href={`tel:${candidate.phone}`}>{candidate.phone}</a>
        </p>
        <p>
          <strong>LinkedIn: </strong>{' '}
          <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">
            {candidate.linkedin}
          </a>
        </p>
        <p>
          <strong>GitHub: </strong>{' '}
          <a href={candidate.github} target="_blank" rel="noopener noreferrer">
            {candidate.github}
          </a>
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>Summary</h2>
        <p>{candidate.summary}</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Skills</h2>
        <ul>
          {candidate.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Experience</h2>
        {candidate.experience.map((job, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3>{job.title} at {job.company}</h3>
            <p><em>{job.dates}</em></p>
            <p>{job.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {candidate.education.map((edu, index) => (
          <div key={index}>
            <h3>{edu.degree} – {edu.school}</h3>
            <p><em>{edu.year}</em></p>
            <p><strong>Relevant Coursework:</strong> {edu.coursework.join(', ')}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CandidateProfile;
