

CREATE TABLE IF NOT EXISTS tbl_todo_users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  initial CHAR(1) NOT NULL
);

INSERT IGNORE INTO tbl_todo_users (id, name, color, initial) VALUES
('harish', 'Harish', 'user-harish', 'H'),
('solai', 'Solai', 'user-solai', 'S'),
('anwar', 'Anwar', 'user-anwar', 'A');

CREATE TABLE IF NOT EXISTS tbl_todos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  project VARCHAR(100),
  assigned_to VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_date DATE,
  due_time VARCHAR(10),
  FOREIGN KEY (assigned_to) REFERENCES tbl_todo_users(id) ON DELETE SET NULL
);

-- Seed data mapping from the original index.html
INSERT INTO tbl_todos (title, description, completed, priority, project, assigned_to, created_at, due_date, due_time) VALUES
('Complete project proposal', 'Finish the client proposal document and send for review', FALSE, 'high', 'Website Redesign', 'harish', '2023-09-20', '2023-09-25', '14:00'),
('Review design mockups', 'Provide feedback on the new homepage design', FALSE, 'medium', 'Website Redesign', 'harish', '2023-09-21', '2023-09-23', '10:30'),
('Schedule team meeting', 'Coordinate with team members for weekly sync', TRUE, 'medium', 'Team Management', 'harish', '2023-09-18', '2023-09-20', '11:00'),
('Update documentation', 'Update API documentation for new features', FALSE, 'low', 'API Development', 'harish', '2023-09-22', '2023-09-30', ''),
('Fix login bug', 'Resolve the authentication issue on mobile devices', FALSE, 'high', 'Mobile App', 'solai', '2023-09-19', '2023-09-22', '16:00'),
('Write unit tests', 'Create tests for payment processing module', TRUE, 'medium', 'API Development', 'solai', '2023-09-15', '2023-09-18', ''),
('Deploy to staging', 'Deploy latest features to staging environment', FALSE, 'medium', 'DevOps', 'solai', '2023-09-21', '2023-09-25', '09:00'),
('Design landing page', 'Create new landing page for marketing campaign', FALSE, 'high', 'Marketing Website', 'anwar', '2023-09-17', '2023-09-24', '15:30'),
('Create social media graphics', 'Design graphics for upcoming product launch', FALSE, 'medium', 'Social Media', 'anwar', '2023-09-20', '2023-09-27', ''),
('Prepare presentation', 'Create slides for quarterly business review', TRUE, 'low', 'Business Review', 'anwar', '2023-09-14', '2023-09-19', '14:00'),
('Update brand guidelines', 'Add new color palette to brand guidelines', FALSE, 'low', 'Branding', 'anwar', '2023-09-22', NULL, ''),
('Review competitor analysis', 'Analyze competitor websites and provide insights', FALSE, 'medium', 'Market Research', 'anwar', '2023-09-21', '2023-09-26', '11:00');
