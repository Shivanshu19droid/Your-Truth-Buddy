import { supabase, testConnection } from './supabase';
import { FallbackQuestion } from './storage-fallback';

// Database table creation SQL
export const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname VARCHAR(100) NOT NULL,
  avatar VARCHAR(10) DEFAULT '😊',
  full_name VARCHAR(200),
  city VARCHAR(100),
  pin_code VARCHAR(20),
  linkedin_url VARCHAR(200),
  instagram_url VARCHAR(200),
  twitter_url VARCHAR(200),
  github_url VARCHAR(200),
  points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('general', 'science', 'technology', 'history', 'sports', 'entertainment')),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  is_hot BOOLEAN DEFAULT FALSE,
  hot_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User answers table
CREATE TABLE IF NOT EXISTS user_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER DEFAULT 0,
  is_hot_question BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_text TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  verification_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_hot ON questions(is_hot, hot_date);
CREATE INDEX IF NOT EXISTS idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_question_id ON user_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_user_id ON verification_requests(user_id);
`;

// Sample questions data
export const sampleQuestions = [
  {
    title: "What is the capital of France?",
    category: "general",
    difficulty: "easy",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct_answer: 2,
    explanation: "Paris is the capital and most populous city of France.",
    is_hot: true,
    hot_date: new Date().toISOString().split('T')[0]
  },
  {
    title: "Which planet is known as the Red Planet?",
    category: "science",
    difficulty: "easy",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct_answer: 1,
    explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
    is_hot: true,
    hot_date: new Date().toISOString().split('T')[0]
  },
  {
    title: "What does HTML stand for?",
    category: "technology",
    difficulty: "medium",
    options: ["Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Hyperlink Text Markup Language"],
    correct_answer: 2,
    explanation: "HTML stands for Hyper Text Markup Language, used to create web pages.",
    is_hot: true,
    hot_date: new Date().toISOString().split('T')[0]
  },
  {
    title: "Who painted the Mona Lisa?",
    category: "general",
    difficulty: "easy",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correct_answer: 2,
    explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1506."
  },
  {
    title: "What is the largest mammal in the world?",
    category: "science",
    difficulty: "easy",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correct_answer: 1,
    explanation: "The Blue Whale is the largest mammal and largest animal ever known to have lived on Earth."
  },
  {
    title: "Which sport is known as 'The Beautiful Game'?",
    category: "sports",
    difficulty: "easy",
    options: ["Basketball", "Tennis", "Football/Soccer", "Cricket"],
    correct_answer: 2,
    explanation: "Football (soccer) is widely known as 'The Beautiful Game' due to its artistry and global appeal."
  },
  {
    title: "What is the chemical symbol for gold?",
    category: "science",
    difficulty: "medium",
    options: ["Go", "Gd", "Au", "Ag"],
    correct_answer: 2,
    explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'."
  },
  {
    title: "Which programming language was created by Guido van Rossum?",
    category: "technology",
    difficulty: "medium",
    options: ["Java", "Python", "JavaScript", "C++"],
    correct_answer: 1,
    explanation: "Python was created by Guido van Rossum and first released in 1991."
  },
  {
    title: "In which year did World War II end?",
    category: "history",
    difficulty: "easy",
    options: ["1944", "1945", "1946", "1947"],
    correct_answer: 1,
    explanation: "World War II ended in 1945 with the surrender of Japan in September."
  },
  {
    title: "What is the fastest land animal?",
    category: "general",
    difficulty: "easy",
    options: ["Lion", "Cheetah", "Leopard", "Tiger"],
    correct_answer: 1,
    explanation: "The cheetah is the fastest land animal, capable of reaching speeds up to 70 mph."
  },
  {
    title: "Which is the smallest planet in the Solar System?",
    category: "science",
    difficulty: "easy",
    options: ["Mercury", "Mars", "Venus", "Pluto"],
    correct_answer: 0,
    explanation: "Mercury is the smallest planet in our Solar System."
  },
  {
    title: "Which blood group is known as the universal donor?",
    category: "science",
    difficulty: "easy",
    options: ["O+", "O-", "AB+", "A-"],
    correct_answer: 1,
    explanation: "O- is the universal donor because it can be transfused to any blood type."
  },
  {
    title: "Who invented the telephone?",
    category: "technology",
    difficulty: "easy",
    options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Michael Faraday"],
    correct_answer: 1,
    explanation: "Alexander Graham Bell is credited with inventing the telephone in 1876."
  },
  {
    title: "Which continent is the Sahara Desert located in?",
    category: "geography",
    difficulty: "easy",
    options: ["Asia", "Africa", "Australia", "South America"],
    correct_answer: 1,
    explanation: "The Sahara Desert is located in northern Africa."
  },
  {
    title: "Who was the first person to reach the South Pole?",
    category: "history",
    difficulty: "medium",
    options: ["Robert Scott", "Roald Amundsen", "Ernest Shackleton", "Edmund Hillary"],
    correct_answer: 1,
    explanation: "Roald Amundsen, a Norwegian explorer, reached the South Pole in 1911."
  },
  {
    title: "Which Indian city is known as the 'Pink City'?",
    category: "general",
    difficulty: "easy",
    options: ["Jaipur", "Udaipur", "Jodhpur", "Bikaner"],
    correct_answer: 0,
    explanation: "Jaipur is called the 'Pink City' because of its pink-colored buildings."
  },
  {
    title: "Which gas is most abundant in Earth's atmosphere?",
    category: "science",
    difficulty: "easy",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
    correct_answer: 1,
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere."
  },
  {
    title: "Which programming language is used for iOS app development?",
    category: "technology",
    difficulty: "medium",
    options: ["Swift", "Kotlin", "Java", "Python"],
    correct_answer: 0,
    explanation: "Swift is the primary programming language for iOS app development."
  },
  {
    title: "Who was the first woman Prime Minister of India?",
    category: "history",
    difficulty: "easy",
    options: ["Indira Gandhi", "Sonia Gandhi", "Sarojini Naidu", "Pratibha Patil"],
    correct_answer: 0,
    explanation: "Indira Gandhi was the first and only woman Prime Minister of India."
  },
  {
    title: "Which element has the atomic number 1?",
    category: "science",
    difficulty: "easy",
    options: ["Oxygen", "Hydrogen", "Helium", "Carbon"],
    correct_answer: 1,
    explanation: "Hydrogen, with one proton, has the atomic number 1."
  },
  {
    title: "Which is the longest wall in the world?",
    category: "general",
    difficulty: "easy",
    options: ["Berlin Wall", "Hadrian's Wall", "Great Wall of China", "Western Wall"],
    correct_answer: 2,
    explanation: "The Great Wall of China is the longest wall in the world."
  },
  {
    title: "What is the national sport of Japan?",
    category: "sports",
    difficulty: "medium",
    options: ["Judo", "Sumo Wrestling", "Karate", "Baseball"],
    correct_answer: 1,
    explanation: "Sumo Wrestling is considered Japan's national sport."
  },
  {
    title: "Who is known as the 'Iron Man of India'?",
    category: "history",
    difficulty: "medium",
    options: ["Subhas Chandra Bose", "Sardar Vallabhbhai Patel", "Bhagat Singh", "Jawaharlal Nehru"],
    correct_answer: 1,
    explanation: "Sardar Vallabhbhai Patel is known as the 'Iron Man of India'."
  },
  {
    title: "Which ocean is the smallest by area?",
    category: "geography",
    difficulty: "easy",
    options: ["Atlantic", "Indian", "Arctic", "Southern"],
    correct_answer: 2,
    explanation: "The Arctic Ocean is the smallest of the Earth's oceans."
  },
  {
    title: "What is the freezing point of water in Celsius?",
    category: "science",
    difficulty: "easy",
    options: ["0°C", "32°C", "100°C", "-1°C"],
    correct_answer: 0,
    explanation: "Water freezes at 0°C under normal atmospheric pressure."
  },
  {
    title: "Which Indian festival is known as the 'Festival of Lights'?",
    category: "general",
    difficulty: "easy",
    options: ["Holi", "Diwali", "Dussehra", "Raksha Bandhan"],
    correct_answer: 1,
    explanation: "Diwali is widely known as the 'Festival of Lights'."
  },
  {
    title: "Who invented the World Wide Web?",
    category: "technology",
    difficulty: "medium",
    options: ["Steve Jobs", "Bill Gates", "Tim Berners-Lee", "Larry Page"],
    correct_answer: 2,
    explanation: "Tim Berners-Lee invented the World Wide Web in 1989."
  },
  {
    title: "Which organ in the human body purifies blood?",
    category: "science",
    difficulty: "easy",
    options: ["Heart", "Kidneys", "Lungs", "Liver"],
    correct_answer: 1,
    explanation: "The kidneys filter waste from the blood and excrete it as urine."
  },
  {
    title: "Which city hosted the first modern Olympic Games in 1896?",
    category: "sports",
    difficulty: "medium",
    options: ["Rome", "Athens", "Paris", "London"],
    correct_answer: 1,
    explanation: "Athens, Greece, hosted the first modern Olympic Games in 1896."
  },
  {
    title: "Which country is the largest by land area?",
    category: "geography",
    difficulty: "easy",
    options: ["USA", "China", "Canada", "Russia"],
    correct_answer: 3,
    explanation: "Russia is the largest country in the world by land area."
  },
  {
    title: "Who discovered gravity when an apple fell on his head?",
    category: "science",
    difficulty: "easy",
    options: ["Galileo Galilei", "Isaac Newton", "Albert Einstein", "Charles Darwin"],
    correct_answer: 1,
    explanation: "Isaac Newton discovered the law of gravity in the 17th century."
  },
  {
    title: "What is the national flower of India?",
    category: "general",
    difficulty: "easy",
    options: ["Rose", "Lotus", "Marigold", "Jasmine"],
    correct_answer: 1,
    explanation: "The Lotus is the national flower of India."
  },
  {
    title: "Which programming language is known as the 'mother of all languages'?",
    category: "technology",
    difficulty: "medium",
    options: ["Assembly", "C", "Fortran", "COBOL"],
    correct_answer: 2,
    explanation: "Fortran, developed in the 1950s, is considered the first high-level programming language."
  },
  {
    title: "Which battle is considered the turning point of World War II?",
    category: "history",
    difficulty: "hard",
    options: ["Battle of Britain", "Battle of Stalingrad", "Battle of Midway", "D-Day"],
    correct_answer: 1,
    explanation: "The Battle of Stalingrad (1942–1943) marked a turning point in favor of the Allies."
  },
  {
    title: "What is the capital city of Australia?",
    category: "geography",
    difficulty: "easy",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct_answer: 2,
    explanation: "Canberra is the capital city of Australia."
  },
  {
    title: "Which country invented paper?",
    category: "history",
    difficulty: "medium",
    options: ["India", "China", "Egypt", "Greece"],
    correct_answer: 1,
    explanation: "Paper was invented in China during the Han dynasty around 105 AD."
  },
  {
    title: "Which Indian state is known as the 'Spice Garden of India'?",
    category: "general",
    difficulty: "medium",
    options: ["Kerala", "Goa", "Assam", "Tamil Nadu"],
    correct_answer: 0,
    explanation: "Kerala is called the 'Spice Garden of India' due to its spice plantations."
  },
  {
    title: "What is the chemical symbol for sodium?",
    category: "science",
    difficulty: "easy",
    options: ["S", "Na", "So", "Sd"],
    correct_answer: 1,
    explanation: "The chemical symbol for sodium is Na, from the Latin 'Natrium'."
  },
  {
    title: "Which sport is associated with Wimbledon?",
    category: "sports",
    difficulty: "easy",
    options: ["Football", "Tennis", "Hockey", "Cricket"],
    correct_answer: 1,
    explanation: "Wimbledon is the oldest tennis tournament in the world."
  },
  {
    title: "Which scientist is known for the theory of evolution?",
    category: "science",
    difficulty: "medium",
    options: ["Isaac Newton", "Charles Darwin", "Gregor Mendel", "Louis Pasteur"],
    correct_answer: 1,
    explanation: "Charles Darwin proposed the theory of evolution by natural selection."
  },
  {
    title: "What is the capital city of Italy?",
    category: "geography",
    difficulty: "easy",
    options: ["Rome", "Venice", "Milan", "Florence"],
    correct_answer: 0,
    explanation: "Rome is the capital city of Italy."
  },
  {
    title: "Which is the largest island in the world?",
    category: "geography",
    difficulty: "medium",
    options: ["Greenland", "Madagascar", "New Guinea", "Borneo"],
    correct_answer: 0,
    explanation: "Greenland is the largest island in the world."
  },
  {
    title: "Which Mughal emperor built the Taj Mahal?",
    category: "history",
    difficulty: "easy",
    options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
    correct_answer: 2,
    explanation: "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal."
  },
  {
    title: "Which gas is essential for human respiration?",
    category: "science",
    difficulty: "easy",
    options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Hydrogen"],
    correct_answer: 1,
    explanation: "Oxygen is essential for respiration in humans."
  },
  {
    title: "Who was the first man to climb Mount Everest?",
    category: "history",
    difficulty: "medium",
    options: ["Tenzing Norgay", "Edmund Hillary", "George Mallory", "Reinhold Messner"],
    correct_answer: 1,
    explanation: "Edmund Hillary and Tenzing Norgay were the first to successfully climb Everest in 1953."
  },
  {
    title: "Which Indian scientist is known as the 'Missile Man of India'?",
    category: "history",
    difficulty: "easy",
    options: ["Homi Bhabha", "Vikram Sarabhai", "APJ Abdul Kalam", "C.V. Raman"],
    correct_answer: 2,
    explanation: "Dr. APJ Abdul Kalam is called the 'Missile Man of India'."
  },
  {
    title: "Which country is known as the 'Land of a Thousand Lakes'?",
    category: "geography",
    difficulty: "medium",
    options: ["Canada", "Norway", "Finland", "Sweden"],
    correct_answer: 2,
    explanation: "Finland is known as the 'Land of a Thousand Lakes'."
  },
  {
    title: "Which device is used to measure electric current?",
    category: "science",
    difficulty: "medium",
    options: ["Voltmeter", "Ammeter", "Ohmmeter", "Barometer"],
    correct_answer: 1,
    explanation: "An ammeter is used to measure electric current."
  },
  {
    title: "Which ancient wonder was located in Egypt?",
    category: "history",
    difficulty: "easy",
    options: ["Hanging Gardens", "Great Pyramid of Giza", "Statue of Zeus", "Colossus of Rhodes"],
    correct_answer: 1,
    explanation: "The Great Pyramid of Giza is the only surviving wonder of the ancient world."
  },
  {
    title: "What is the main ingredient in sushi?",
    category: "general",
    difficulty: "easy",
    options: ["Bread", "Rice", "Noodles", "Wheat"],
    correct_answer: 1,
    explanation: "Rice is the main ingredient used in making sushi."
  },
  {
    title: "Which is the deepest ocean trench in the world?",
    category: "geography",
    difficulty: "hard",
    options: ["Tonga Trench", "Java Trench", "Puerto Rico Trench", "Mariana Trench"],
    correct_answer: 3,
    explanation: "The Mariana Trench in the Pacific Ocean is the deepest ocean trench."
  },
  {
    title: "Which city is known as the 'Silicon Valley of India'?",
    category: "technology",
    difficulty: "easy",
    options: ["Hyderabad", "Bengaluru", "Chennai", "Pune"],
    correct_answer: 1,
    explanation: "Bengaluru is known as the 'Silicon Valley of India'."
  },
  {
    title: "Who was the first man in space?",
    category: "history",
    difficulty: "medium",
    options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"],
    correct_answer: 2,
    explanation: "Yuri Gagarin, a Soviet astronaut, was the first man in space in 1961."
  },
  {
    title: "Which organ pumps blood through the human body?",
    category: "science",
    difficulty: "easy",
    options: ["Brain", "Heart", "Liver", "Kidneys"],
    correct_answer: 1,
    explanation: "The heart pumps blood throughout the human body."
  },
  {
    title: "Which desert is the largest hot desert in the world?",
    category: "geography",
    difficulty: "medium",
    options: ["Gobi", "Thar", "Sahara", "Kalahari"],
    correct_answer: 2,
    explanation: "The Sahara Desert is the largest hot desert in the world."
  },
  {
    title: "Which is the longest highway in India?",
    category: "general",
    difficulty: "medium",
    options: ["NH 27", "NH 44", "NH 48", "NH 19"],
    correct_answer: 1,
    explanation: "NH 44 is the longest highway in India, running from Srinagar to Kanyakumari."
  },
  {
    title: "Which is the tallest mountain in the world?",
    category: "general",
    difficulty: "easy",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"],
    correct_answer: 1,
    explanation: "Mount Everest, standing at 8,848 meters, is the tallest mountain on Earth."
  },
  {
    title: "What is the national currency of Japan?",
    category: "general",
    difficulty: "easy",
    options: ["Yuan", "Won", "Yen", "Dollar"],
    correct_answer: 2,
    explanation: "The Japanese Yen (¥) is the official currency of Japan."
  },
  {
    title: "Which vitamin is produced when the human body is exposed to sunlight?",
    category: "science",
    difficulty: "easy",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    correct_answer: 3,
    explanation: "Vitamin D is synthesized in the skin when exposed to sunlight."
  },
  {
    title: "Which data structure uses FIFO (First In, First Out)?",
    category: "technology",
    difficulty: "medium",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correct_answer: 1,
    explanation: "A Queue follows FIFO order, while a Stack follows LIFO."
  },
  {
    title: "Who was the first woman to win a Nobel Prize?",
    category: "history",
    difficulty: "medium",
    options: ["Mother Teresa", "Marie Curie", "Rosalind Franklin", "Ada Lovelace"],
    correct_answer: 1,
    explanation: "Marie Curie won the Nobel Prize in Physics in 1903, becoming the first woman laureate."
  },
  {
    title: "Which country hosted the 2016 Summer Olympics?",
    category: "sports",
    difficulty: "easy",
    options: ["China", "Brazil", "UK", "Russia"],
    correct_answer: 1,
    explanation: "Brazil hosted the 2016 Summer Olympics in Rio de Janeiro."
  },
  {
    title: "What is the smallest prime number?",
    category: "science",
    difficulty: "easy",
    options: ["0", "1", "2", "3"],
    correct_answer: 2,
    explanation: "2 is the smallest and the only even prime number."
  },
  {
    title: "Which city is known as the 'City of Canals'?",
    category: "general",
    difficulty: "easy",
    options: ["Venice", "Amsterdam", "Bangkok", "Bruges"],
    correct_answer: 0,
    explanation: "Venice in Italy is famously known as the 'City of Canals'."
  },
  {
    title: "In which year did World War I begin?",
    category: "history",
    difficulty: "medium",
    options: ["1912", "1914", "1916", "1918"],
    correct_answer: 1,
    explanation: "World War I began in 1914 following the assassination of Archduke Franz Ferdinand."
  },
  {
    title: "What does 'HTTP' stand for?",
    category: "technology",
    difficulty: "medium",
    options: ["Hyper Transfer Text Protocol", "Hyper Text Transfer Protocol", "High Text Transfer Protocol", "Hyper Tool Transfer Protocol"],
    correct_answer: 1,
    explanation: "HTTP stands for Hyper Text Transfer Protocol, the foundation of data communication on the web."
  },
  {
    title: "Who is known as the 'Father of Geometry'?",
    category: "science",
    difficulty: "medium",
    options: ["Pythagoras", "Euclid", "Aristotle", "Archimedes"],
    correct_answer: 1,
    explanation: "Euclid is known as the 'Father of Geometry' for his work 'Elements'."
  },
  {
    title: "Which is the largest desert in the world?",
    category: "general",
    difficulty: "easy",
    options: ["Sahara", "Gobi", "Antarctic Desert", "Kalahari"],
    correct_answer: 2,
    explanation: "The Antarctic Desert is the largest in the world, bigger than the Sahara."
  },
  {
    title: "In cricket, how many players are there on each team?",
    category: "sports",
    difficulty: "easy",
    options: ["10", "11", "12", "15"],
    correct_answer: 1,
    explanation: "A cricket team consists of 11 players."
  },
  {
    title: "Which is the hottest planet in the Solar System?",
    category: "science",
    difficulty: "medium",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correct_answer: 1,
    explanation: "Venus is hotter than Mercury due to its thick carbon dioxide atmosphere causing a greenhouse effect."
  },
  {
    title: "Who was the first Indian woman to go to space?",
    category: "history",
    difficulty: "medium",
    options: ["Kalpana Chawla", "Sunita Williams", "Indira Gandhi", "Valentina Tereshkova"],
    correct_answer: 0,
    explanation: "Kalpana Chawla became the first Indian woman in space in 1997."
  },
  {
    title: "Which instrument measures atmospheric pressure?",
    category: "science",
    difficulty: "medium",
    options: ["Barometer", "Thermometer", "Hygrometer", "Anemometer"],
    correct_answer: 0,
    explanation: "A barometer is used to measure atmospheric pressure."
  },
  {
    title: "Which is the longest bone in the human body?",
    category: "science",
    difficulty: "easy",
    options: ["Femur", "Humerus", "Tibia", "Fibula"],
    correct_answer: 0,
    explanation: "The femur, or thigh bone, is the longest and strongest bone in the human body."
  },
  {
    title: "Who is the author of 'The Republic'?",
    category: "general",
    difficulty: "hard",
    options: ["Socrates", "Plato", "Aristotle", "Homer"],
    correct_answer: 1,
    explanation: "Plato wrote 'The Republic', a foundational work in Western philosophy."
  },
  {
    title: "What is the chemical formula of water?",
    category: "science",
    difficulty: "easy",
    options: ["H2", "H2O", "HO2", "OH"],
    correct_answer: 1,
    explanation: "The chemical formula for water is H2O, consisting of two hydrogen atoms and one oxygen atom."
  },
  {
    title: "Which planet has the most moons?",
    category: "science",
    difficulty: "medium",
    options: ["Jupiter", "Saturn", "Mars", "Neptune"],
    correct_answer: 1,
    explanation: "Saturn has the most confirmed moons in the Solar System, over 80."
  },
  {
    title: "Which famous scientist developed the three laws of motion?",
    category: "science",
    difficulty: "easy",
    options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Johannes Kepler"],
    correct_answer: 1,
    explanation: "Isaac Newton formulated the three laws of motion."
  },
  {
    title: "Which is the largest planet in the Solar System?",
    category: "science",
    difficulty: "easy",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correct_answer: 2,
    explanation: "Jupiter is the largest planet, more than 11 times the size of Earth."
  },
  {
    title: "What does the 'S' in 'HTTPS' stand for?",
    category: "technology",
    difficulty: "medium",
    options: ["Safe", "Secure", "Server", "Socket"],
    correct_answer: 1,
    explanation: "HTTPS stands for Hyper Text Transfer Protocol Secure, adding encryption to HTTP."
  },
  {
    title: "Who painted the ceiling of the Sistine Chapel?",
    category: "general",
    difficulty: "medium",
    options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
    correct_answer: 2,
    explanation: "Michelangelo painted the ceiling of the Sistine Chapel between 1508 and 1512."
  },
  {
    title: "What is the capital city of Canada?",
    category: "general",
    difficulty: "easy",
    options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
    correct_answer: 2,
    explanation: "Ottawa is the capital city of Canada."
  },
  {
    title: "Which sport uses the term 'checkmate'?",
    category: "sports",
    difficulty: "easy",
    options: ["Tennis", "Hockey", "Chess", "Boxing"],
    correct_answer: 2,
    explanation: "Checkmate is a winning position in chess when the king is trapped."
  },
  {
    title: "What is the speed of light in vacuum?",
    category: "science",
    difficulty: "hard",
    options: ["3 × 10^6 m/s", "3 × 10^7 m/s", "3 × 10^8 m/s", "3 × 10^9 m/s"],
    correct_answer: 2,
    explanation: "The speed of light in vacuum is approximately 3 × 10^8 meters per second."
  },
  {
    title: "Who was the first Prime Minister of India?",
    category: "history",
    difficulty: "easy",
    options: ["Sardar Patel", "Jawaharlal Nehru", "Mahatma Gandhi", "Rajendra Prasad"],
    correct_answer: 1,
    explanation: "Jawaharlal Nehru was the first Prime Minister of India, serving from 1947 to 1964."
  },
  {
    title: "Which country is called the 'Land of the Rising Sun'?",
    category: "general",
    difficulty: "easy",
    options: ["China", "Japan", "South Korea", "Thailand"],
    correct_answer: 1,
    explanation: "Japan is called the 'Land of the Rising Sun' because the sun rises first there in Asia."
  },
  {
    title: "Which is the longest river in the world?",
    category: "general",
    difficulty: "medium",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correct_answer: 1,
    explanation: "The Nile River is traditionally considered the longest river in the world, though some studies argue the Amazon is longer."
  },
  {
    title: "In computing, what does 'CPU' stand for?",
    category: "technology",
    difficulty: "easy",
    options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Core Processing Utility"],
    correct_answer: 1,
    explanation: "CPU stands for Central Processing Unit, the brain of the computer."
  },
  {
    title: "Who wrote the play 'Romeo and Juliet'?",
    category: "general",
    difficulty: "easy",
    options: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
    correct_answer: 0,
    explanation: "William Shakespeare wrote 'Romeo and Juliet', one of his most famous tragedies."
  },
  {
    title: "Which metal has the chemical symbol 'Fe'?",
    category: "science",
    difficulty: "easy",
    options: ["Fluorine", "Iron", "Lead", "Zinc"],
    correct_answer: 1,
    explanation: "The symbol 'Fe' comes from 'Ferrum', the Latin name for iron."
  },
  {
    title: "In which year did India gain independence?",
    category: "history",
    difficulty: "easy",
    options: ["1945", "1946", "1947", "1948"],
    correct_answer: 2,
    explanation: "India gained independence from British rule on 15th August 1947."
  },
  {
    title: "Which is the hardest natural substance on Earth?",
    category: "science",
    difficulty: "medium",
    options: ["Gold", "Diamond", "Quartz", "Graphite"],
    correct_answer: 1,
    explanation: "Diamond is the hardest natural substance due to its strong carbon bonds."
  },
  {
    title: "Which language is primarily spoken in Brazil?",
    category: "general",
    difficulty: "easy",
    options: ["Spanish", "Portuguese", "French", "English"],
    correct_answer: 1,
    explanation: "Portuguese is the official and most widely spoken language in Brazil."
  },
  {
    title: "Who was the first man to step on the Moon?",
    category: "history",
    difficulty: "easy",
    options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"],
    correct_answer: 1,
    explanation: "Neil Armstrong became the first man to walk on the Moon on July 20, 1969."
  },
  {
    title: "What is the value of Pi (π) up to two decimal places?",
    category: "science",
    difficulty: "easy",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correct_answer: 1,
    explanation: "The value of Pi is approximately 3.14 up to two decimal places."
  },
  {
    title: "Which company owns YouTube?",
    category: "technology",
    difficulty: "easy",
    options: ["Microsoft", "Meta", "Google", "Amazon"],
    correct_answer: 2,
    explanation: "Google acquired YouTube in 2006 and is its current owner."
  },
  {
    title: "Which gas do plants absorb during photosynthesis?",
    category: "science",
    difficulty: "easy",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correct_answer: 1,
    explanation: "Plants absorb carbon dioxide from the atmosphere and release oxygen during photosynthesis.",
    is_hot: true,
    hot_date: new Date().toISOString().split('T')[0]
  },
  {
    title: "Who developed the theory of relativity?",
    category: "science",
    difficulty: "medium",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"],
    correct_answer: 1,
    explanation: "Albert Einstein developed the theory of relativity, published in 1905 and 1915."
  },
  {
    title: "Which programming language is primarily used for Android app development?",
    category: "technology",
    difficulty: "medium",
    options: ["Swift", "Kotlin", "C#", "Ruby"],
    correct_answer: 1,
    explanation: "Kotlin is the preferred programming language for Android development."
  },
  {
    title: "Who was the first President of the United States?",
    category: "history",
    difficulty: "easy",
    options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
    correct_answer: 2,
    explanation: "George Washington served as the first President of the United States from 1789 to 1797."
  },
  {
    title: "Which is the smallest continent by land area?",
    category: "general",
    difficulty: "easy",
    options: ["Europe", "Australia", "Antarctica", "South America"],
    correct_answer: 1,
    explanation: "Australia is the smallest continent by land area."
  },
  {
    title: "What is the SI unit of force?",
    category: "science",
    difficulty: "medium",
    options: ["Pascal", "Joule", "Newton", "Watt"],
    correct_answer: 2,
    explanation: "The SI unit of force is the Newton (N), named after Sir Isaac Newton."
  },
  {
    title: "Which company developed the Windows operating system?",
    category: "technology",
    difficulty: "easy",
    options: ["Apple", "Microsoft", "IBM", "Google"],
    correct_answer: 1,
    explanation: "Microsoft developed and released the Windows operating system in 1985."
  },
  {
    title: "In which sport is the term 'love' used?",
    category: "sports",
    difficulty: "easy",
    options: ["Tennis", "Cricket", "Football", "Hockey"],
    correct_answer: 0,
    explanation: "In tennis, 'love' refers to a score of zero."
  },
  {
    title: "Which ocean is the largest in the world?",
    category: "general",
    difficulty: "easy",
    options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
    correct_answer: 1,
    explanation: "The Pacific Ocean is the largest, covering more than 30% of Earth's surface."
  },
  {
    title: "Who discovered penicillin?",
    category: "science",
    difficulty: "medium",
    options: ["Marie Curie", "Louis Pasteur", "Alexander Fleming", "Gregor Mendel"],
    correct_answer: 2,
    explanation: "Alexander Fleming discovered penicillin in 1928, revolutionizing medicine."
  }
];

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Test if Supabase is available
    const useSupabase = await testConnection();

    if (useSupabase) {
      console.log('Using Supabase database');

      // Check if questions already exist
      const { data: existingQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .limit(1);

      if (questionsError) {
        console.log('Questions table might not exist yet, this is normal for first run');
      }

      // If no questions exist, insert sample questions
      if (!existingQuestions || existingQuestions.length === 0) {
        console.log('Inserting sample questions to Supabase...');

        for (const questionData of sampleQuestions) {
          try {
            const { error } = await supabase
              .from('questions')
              .insert([questionData]);

            if (error) {
              console.error('Error inserting question:', error);
            }
          } catch (err) {
            console.error('Error inserting question:', err);
          }
        }

        console.log('Sample questions inserted successfully to Supabase');
      } else {
        console.log('Questions already exist in Supabase, skipping sample data insertion');
      }
    } else {
      console.log('Using localStorage fallback');

      // Check if questions exist in localStorage
      const existingQuestions = JSON.parse(localStorage.getItem('truth_buddy_questions') || '[]');

      if (existingQuestions.length === 0) {
        console.log('Inserting sample questions to localStorage...');

        for (const questionData of sampleQuestions) {
          try {
            await FallbackQuestion.create(questionData);
          } catch (err) {
            console.error('Error inserting question to localStorage:', err);
          }
        }

        console.log('Sample questions inserted successfully to localStorage');
      } else {
        console.log('Questions already exist in localStorage, skipping sample data insertion');
      }
    }

    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}
