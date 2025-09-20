# Your Truth Buddy - Gamified Learning Platform

A React-based gamified learning platform with fake news detection and quiz system.

## Features

- **Interactive Quiz System** - Answer questions and earn points
- **Hot Questions** - Featured questions with 3x points
- **Truth Verification** - Upload content or text to verify authenticity
- **Leaderboards** - Global and regional rankings
- **User Profiles** - Customizable avatars and social links
- **Gamification** - Points, streaks, and level progression

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (with localStorage fallback)
- **Routing**: React Router

## Database Integration

The application supports both Supabase and localStorage storage:

### Supabase Setup (Recommended)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `.env.local`:
   ```
   VITE_SUPABASE_KEY=your_actual_supabase_anon_key_here
   ```
4. Run the SQL commands from `src/lib/database-init.js` in your Supabase SQL editor to create tables

### Required Tables

The application needs these tables in Supabase:

- `users` - User profiles and statistics
- `questions` - Quiz questions with categories and difficulties  
- `user_answers` - User responses to questions
- `verification_requests` - Content verification history

### Fallback Mode

If Supabase is not configured, the app automatically falls back to localStorage for data persistence.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (optional):
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**: http://localhost:5173

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── QuestionCard.jsx
│   ├── HotQuestionsCarousel.jsx
│   └── StatsCard.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── VerifyPage.jsx
│   ├── LeaderboardPage.jsx
│   └── ProfilePage.jsx
├── entities/           # Data layer
│   └── all.js         # Database entities with Supabase integration
├── lib/               # Utilities and configuration
│   ├── supabase.js    # Supabase client
│   ├── database-init.js # Database initialization
│   ├── storage-fallback.js # localStorage fallback
│   └── utils.js       # Helper functions
└── App.jsx            # Main application component
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `nickname` (VARCHAR, Required)
- `avatar` (VARCHAR, Default: '😊')
- `full_name`, `city`, `pin_code` (VARCHAR, Optional)
- `linkedin_url`, `instagram_url`, `twitter_url`, `github_url` (VARCHAR, Optional)
- `points` (INTEGER, Default: 0)
- `current_streak` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP)

### Questions Table
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `category` (VARCHAR, Enum: general, science, technology, history, sports, entertainment)
- `difficulty` (VARCHAR, Enum: easy, medium, hard)
- `options` (JSONB, Array of answer options)
- `correct_answer` (INTEGER, Index of correct option)
- `explanation` (TEXT, Optional)
- `is_hot` (BOOLEAN, Default: false)
- `hot_date` (DATE, Optional)
- `created_at` (TIMESTAMP)

### User Answers Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `question_id` (UUID, Foreign Key to questions)
- `selected_answer` (INTEGER, User's choice)
- `is_correct` (BOOLEAN)
- `points_earned` (INTEGER)
- `is_hot_question` (BOOLEAN)
- `created_at` (TIMESTAMP)

### Verification Requests Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `content_text` (TEXT, Optional)
- `file_url` (TEXT, Optional)
- `file_name` (VARCHAR, Optional)
- `verification_result` (JSONB, Analysis results)
- `created_at` (TIMESTAMP)

## Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
