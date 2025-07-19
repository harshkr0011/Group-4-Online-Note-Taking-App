# FeatherNote

FeatherNote is an elegant, modern note-taking app built with Next.js, React, and MongoDB. It offers a beautiful, intuitive interface for capturing, organizing, and securing your notes, with productivity-focused features and robust privacy.

## Features

- **Effortless Rich Text Editing**: Format your notes easily with a WYSIWYG editor (Draft.js and Quill supported).
- **Secure & Private**: Password-protect individual notes for privacy.
- **Always in Sync**: Access your notes from anywhere; all content is synced across devices.
- **Tagging & Organization**: Add tags to notes for easy categorization and filtering.
- **Powerful Search**: Instantly search notes by title, content, or tags.
- **Pin & Archive**: Pin important notes or archive those you no longer need.
- **Due Dates & Calendar**: Assign due dates to notes and view them in a calendar.
- **Export to PDF**: Download notes as PDF files.
- **Dark/Light Theme**: Switch between light and dark modes.
- **User Settings**: Customize theme and notification preferences.
- **Authentication**: Secure login and signup (with Google option).
- **Extra Features**: (UI links exist for) Activity logs, attachments, shared notes, reminders, and more.

## Screenshots

*(Add screenshots of the dashboard, editor, and calendar here for best effect.)*

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB
- **Authentication**: JWT-based, with Google OAuth option
- **Rich Text Editor**: Draft.js, react-draft-wysiwyg, Quill
- **UI Components**: Radix UI, Lucide Icons
- **PDF Export**: jsPDF, html2canvas

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd note-making-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your MongoDB URI and JWT secret.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:9002](http://localhost:9002).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

- `src/app/` – Main Next.js app directory
  - `(app)/dashboard/` – Dashboard and note listing
  - `(app)/notes/[id]/` – Note editor (rich text, tags, due date, lock, export)
  - `(app)/calendar/` – Calendar view for notes with due dates
  - `(app)/archived/` – Archived notes
  - `(app)/extras/` – User settings, tags, and (UI links for) extra features
  - `(auth)/` – Login and signup pages
- `src/models/Note.ts` – Note data model
- `src/app/actions/notes.ts` – Server actions for notes (CRUD, archive, lock, etc.)
- `src/components/` – UI components

## Data Model

```ts
export interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  tags?: string[];
  archived?: boolean;
  locked?: boolean;
  password?: string;
  pinned?: boolean;
  dueDate?: Date | string;
}
```

## Key UI Features

- **Sidebar Navigation**: Quick access to dashboard, calendar, new note, archived notes, tags, profile, and settings.
- **Dashboard**: View, filter, sort, and pin notes.
- **Note Editor**: Rich text editing, tagging, due dates, lock/unlock, export to PDF.
- **Calendar**: Visualize notes by due date.
- **Archived Notes**: Restore or permanently delete notes.
- **User Settings**: Theme and notification preferences.

## Extra Features (UI links present)

- User Settings
- Global Tags
- Activity Logs
- Attachments
- Shared Notes
- User Profile
- Reminders
- Calendar Events

*(Some extra features may require further backend implementation.)*

## License

MIT
