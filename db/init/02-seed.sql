-- Seed data taken from the CV. Edit freely; the site reads it live.
-- Note: the phone number is deliberately NOT stored or published (spam / scam risk).

INSERT INTO profile (id, full_name, headline, summary, location, email) VALUES (
  1,
  'Ishe Shalton Milubi',
  'Final-year BSc IT student and software developer',
  'Final-year BSc Information Technology student at the University of Johannesburg (Computer Sciences and Informatics). I have hands-on project experience across software engineering, data-driven solutions (KNN, image similarity, classification), backend development in C#/.NET, and containerised full-stack and mobile applications using Docker, PostgreSQL and Git. Analytical, adaptable and committed to continuous learning.',
  'Johannesburg, South Africa',
  'isheshalton29@gmail.com'
);

INSERT INTO projects (slug, title, subtitle, description, role, technologies, sort_order) VALUES
(
  'throwafit',
  'ThrowAFit',
  'Outfit suitability prediction',
  'A team project that assesses whether an outfit is suitable for an event or place based on defined norms. It combines colour analysis with KNN, image similarity and classification.',
  'Personally developed the colour-analysis and histogram algorithms: colour histograms, hue bins and compatibility analysis.',
  ARRAY['Java 21','JavaFX','KNN','Image similarity','Classification','Colour histograms','Hue bins'],
  1
),
(
  'barberq-premium-studio',
  'BarberQ Premium Studio',
  'Queue and appointment management system',
  'A system that supports customer bookings and is designed to support barber queues, schedules, service tracking and business operations.',
  'Contributed primarily to the customer-facing mobile application, focusing on the appointment-scheduling use case.',
  ARRAY['React Native','React','TypeScript','Node.js','Express.js','PostgreSQL','Docker','Docker Compose','pgAdmin','psql','Expo Router'],
  2
),
(
  'booknexus',
  'BookNexus',
  'E-commerce bookshop',
  'A second-year project: an online book-selling application.',
  'Primarily responsible for backend development in C# and .NET Framework, including the loyalty-programme and coupon features.',
  ARRAY['C#','.NET Framework'],
  3
);

INSERT INTO skills (category, category_order, name, sort_order) VALUES
('Programming', 1, 'Java (incl. Java 21)', 1), ('Programming', 1, 'C#', 2), ('Programming', 1, 'JavaScript', 3),
('Programming', 1, 'TypeScript', 4), ('Programming', 1, 'Python', 5), ('Programming', 1, 'C++', 6), ('Programming', 1, 'SQL', 7),
('Software development', 2, 'Object-oriented programming', 1), ('Software development', 2, 'Data structures and algorithms', 2),
('Software development', 2, 'Algorithm design', 3), ('Software development', 2, 'Debugging and problem-solving', 4),
('Web and mobile', 3, 'React Native', 1), ('Web and mobile', 3, 'React', 2), ('Web and mobile', 3, 'Expo Router', 3),
('Web and mobile', 3, 'HTML and CSS', 4),
('Backend and APIs', 4, 'C#/.NET Framework', 1), ('Backend and APIs', 4, 'Node.js', 2), ('Backend and APIs', 4, 'Express.js', 3),
('Backend and APIs', 4, 'REST API integration', 4), ('Backend and APIs', 4, 'Postman', 5),
('Data and databases', 5, 'PostgreSQL', 1), ('Data and databases', 5, 'SQL Server', 2), ('Data and databases', 5, 'Database design', 3),
('Data and databases', 5, 'Image similarity', 4), ('Data and databases', 5, 'KNN and classification', 5),
('Tools', 6, 'Git and GitHub', 1), ('Tools', 6, 'Docker and Docker Compose', 2), ('Tools', 6, 'pgAdmin and psql', 3),
('Tools', 6, 'Microsoft Word, Excel and PowerPoint', 4),
('Languages', 7, 'Tshivenda (native)', 1), ('Languages', 7, 'English (professional)', 2),
('Languages', 7, 'Xitsonga (proficient)', 3), ('Languages', 7, 'isiZulu (fair)', 4);

INSERT INTO education (institution, qualification, period, details, sort_order) VALUES
(
  'University of Johannesburg',
  'BSc Information Technology (Computer Sciences and Informatics)',
  'Final year - studies complete Nov 2026, graduating May 2027',
  'Current average: 68%.',
  1
),
(
  'Tshiitwa Secondary School',
  'National Senior Certificate',
  '2023',
  'Mathematics, Physical Sciences, English and Life Sciences.',
  2
);

INSERT INTO achievements (title, sort_order) VALUES
('UJenius member, University of Johannesburg (2024)', 1),
('Grade 12 academic top achiever, including Mathematics recognition at school and Hlanganani North Circuit level', 2),
('Data Structures and Algorithms in Java (Intermediate), Great Learning', 3),
('Java Programming, Great Learning', 4),
('Introduction to Python, GRIT Lab Africa', 5);
