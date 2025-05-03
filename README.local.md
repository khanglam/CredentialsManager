# SecureVault - Credential Management System

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run migrations**
   The SQL migrations are located in the `supabase/migrations` folder. You can run them manually in the Supabase SQL editor or use the Supabase CLI.

   To use the Supabase CLI:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref your_project_id
   supabase db push
   ```

3. **Update your environment variables** with your Supabase project URL and anon key.

### Project Structure

- `/src` - Source code
  - `/components` - React components
    - `/auth` - Authentication components
    - `/credential` - Credential management components
    - `/dashboard` - Dashboard components
    - `/home` - Landing page components
    - `/pages` - Page components
    - `/ui` - UI components (shadcn/ui)
  - `/lib` - Utility functions
  - `/types` - TypeScript type definitions
- `/supabase` - Supabase configuration and migrations

### Features

- User authentication (login, signup)
- Credential management (add, view, edit, delete)
- Password strength analysis
- Categorization of credentials
- Favorites system
- Search functionality

### Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Supabase (authentication and database)
- Lucide React (icons)
