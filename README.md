# Notes App - Full-Stack CRUD Application

A simple, full-stack notes application built with Next.js, MongoDB, and Tailwind CSS. Create, view, edit, and delete notes with automatic timestamps.

## ✨ Features

- **Create Notes**: Add new notes with title and content
- **View Notes**: Browse all notes in a clean, organized list
- **Edit Notes**: Update existing notes with ease
- **Delete Notes**: Remove notes with a single click
- **Automatic Timestamps**: Track when notes are created and updated
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: UI reflects changes immediately after operations

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router, TypeScript)
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 🏗 Architecture

### High-Level Design

```
┌─────────────────────────────────────────┐
│         Next.js App Router              │
│  ┌─────────────┐    ┌────────────────┐ │
│  │  app/       │    │  app/api/      │ │
│  │  page.tsx   │◄───┤  notes/        │ │
│  │  notes/[id] │    │  - route.ts    │ │
│  └─────────────┘    │  - [id]/route  │ │
│                     └────────────────┘ │
└─────────────────────────────────────────┘
                  ▼
         ┌─────────────────┐
         │  lib/mongodb.ts │
         │  (Connection)   │
         └─────────────────┘
                  ▼
         ┌─────────────────┐
         │    MongoDB      │
         │  notes collection│
         └─────────────────┘
```

### Directory Structure

- **`app/`**: Next.js App Router pages and layouts
  - `page.tsx`: Main notes list and creation form
  - `notes/[id]/page.tsx`: Individual note editing page
  - `api/notes/`: API route handlers for CRUD operations
- **`lib/`**: Shared utilities
  - `mongodb.ts`: MongoDB connection manager with caching

## 📊 Data Model

### MongoDB Collection: `notes`

Each note document contains:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique identifier |
| `title` | String | Note title (required) |
| `content` | String | Note content/body (required) |
| `createdAt` | Date | Timestamp of creation |
| `updatedAt` | Date | Timestamp of last update |

**Example Document**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Meeting Notes",
  "content": "Discuss project timeline and deliverables...",
  "createdAt": "2024-01-08T10:30:00.000Z",
  "updatedAt": "2024-01-08T14:45:00.000Z"
}
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/notes` | List all notes (sorted by date, desc) | - | Array of notes |
| `POST` | `/api/notes` | Create a new note | `{ title, content }` | Created note object |
| `GET` | `/api/notes/[id]` | Get single note by ID | - | Note object |
| `PUT` | `/api/notes/[id]` | Update existing note | `{ title, content }` | Updated note object |
| `DELETE` | `/api/notes/[id]` | Delete note by ID | - | Success message |

### Response Format

**Success**: 
```json
{
  "success": true,
  "data": { /* note object or array */ }
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🚀 Getting Started

 **Configure Environment Variables**
   
   Create `.env.local` in the project root:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=notesapp
   ```


## 📁 Project Structure

```
Notes/
├── app/
│   ├── page.tsx                 # Main page: list + create form
│   ├── notes/
│   │   └── [id]/
│   │       └── page.tsx         # Edit note page
│   ├── api/
│   │   └── notes/
│   │       ├── route.ts         # GET all, POST new
│   │       └── [id]/
│   │           └── route.ts     # GET, PUT, DELETE by ID
│   └── layout.tsx               # Root layout
├── lib/
│   └── mongodb.ts               # MongoDB connection utility
├── .env.local                   # Environment variables (not in git)
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB` | Database name | `notesapp` |

**Security Note**: Never commit `.env.local` to version control. Add it to `.gitignore`.

## 💡 Usage

### Creating a Note

1. Navigate to the home page
2. Fill in the "Title" field
3. Enter your content in the text area
4. Click "Create Note"
5. The new note appears in the list below

### Viewing Notes

- All notes are displayed on the home page
- Notes are sorted by creation date (newest first)
- Each card shows: title, content preview, and timestamp

### Editing a Note

1. Click "Edit" on any note card
2. Modify the title or content
3. Click "Save" to update
4. Click "Back" to return without saving

### Deleting a Note

1. Click "Delete" on any note card
2. The note is removed immediately
3. The list updates automatically

---

**Built with ❤️ using Next.js and MongoDB**
