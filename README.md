# Study Flow

Create a complete modern student study management web application called "My Study App".

IMPORTANT ARCHITECTURE:

Frontend-only application.

React.

Vite.

JavaScript, not TypeScript.

Tailwind CSS.

No backend.

No Django.

No Electron.

No database server.

No authentication.

The app will later use LocalStorage and IndexedDB.

The final application will be deployed to Vercel.

IMPORTANT:
This first stage is mainly about creating a polished frontend UI/UX.
Use mock/sample data for the visual design.
Do not implement a backend.

DESIGN:
Create a beautiful, modern, clean student productivity interface.

Style:

Professional

Minimal

Student-friendly

Comfortable for long study sessions

Responsive

Desktop, tablet, and mobile support

Good typography

Good spacing

Rounded cards

Subtle shadows

Clean icons

Simple animations

Clear empty states

Accessible controls

MAIN NAVIGATION:

Dashboard

Subjects

Notes

Tasks

Study Timer

Exams

Progress

Settings

DASHBOARD:
Create:

Welcome section

Today's study time

Completed tasks

Total tasks

Upcoming exams

Subject progress

Today's tasks

Recent notes

Quick actions

SUBJECTS:
Create:

Subject cards

Subject name

Description

Progress percentage

Study time

Add Subject

Edit

Delete

Empty state

NOTES:
Create:

Notes list/grid

Search

Subject filter

Add Note

Edit Note

Delete Note

Note title

Note content

Updated date

Note photo/image attachment UI

Image preview UI

Multiple image attachment UI

Empty state

IMPORTANT FOR NOTE PHOTOS:
The UI should support attaching photos to notes because students may take photos of textbook pages, handwritten notes, diagrams, or lecture material.

TASKS:
Create:

Today's tasks

Upcoming tasks

Completed tasks

Add Task

Edit

Delete

Complete/incomplete checkbox

Priority

Due date

Subject

Search

Filters

STUDY TIMER:
Create:

Large timer

Study mode

Break mode

Start

Pause

Resume

Reset

Study duration

Break duration

Today's sessions

Study statistics

EXAMS:
Create:

Upcoming exams

Exam countdown

Exam name

Subject

Exam date

Remaining days

Add exam

Edit

Delete

Empty state

PROGRESS:
Create:

Overall progress

Weekly study time

Completed tasks

Task completion rate

Subject progress

Study sessions

Progress bars

Simple charts if appropriate

SETTINGS:
Create:

Theme selection

Light mode

Dark mode

Data management

Clear all app data

Confirmation dialog

RESPONSIVE DESIGN:
Desktop:

Sidebar navigation

Main content area

Mobile:

Mobile-friendly navigation

Responsive cards

Responsive forms

Responsive note/photo viewer

No horizontal overflow

COMPONENTS:
Create reusable components where appropriate:

Sidebar

Mobile navigation

Header

Cards

Buttons

Modal/dialog

Forms

Progress bars

Empty states

Confirmation dialogs

Note editor

Note image preview

IMPORTANT:
Do not over-engineer the application.
Keep the code organized and easy for another developer to add functionality later.

Make the UI look like a finished professional student productivity application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5893f81d-784d-410d-bb68-d5f164ce1d83).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
