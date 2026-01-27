# 📋 Todo List Feature Guide

## Overview

The pledge dashboard now includes a comprehensive todo list system where:
- **Admins** can create, edit, and delete todos for any pledge
- **Pledges** can view their todos and check them off as completed

## Features

### For Pledges (Pledge Account)

#### Dashboard View
When you log in as a pledge, you'll see:

1. **Your To-Do List Section** - Displayed prominently on the main dashboard
   - Active (uncompleted) tasks shown first
   - Each todo shows:
     - Title and description
     - Due date (if set)
     - Priority level (🔴 High, 🟡 Medium, 🟢 Low)
     - Category badge (General, Event, Requirement, Paddle, Other)
   
2. **Interactive Checkboxes**
   - Click to mark tasks as complete
   - Completed tasks get crossed out
   - Click again to un-complete if needed

3. **Completed Tasks**
   - Collapsed section showing all completed todos
   - Click "▶ Completed Tasks" to expand and view

4. **Empty State**
   - If all tasks are done: "🎉 All tasks completed! Great job!"

### For Admins (Admin Account)

#### Manage Todos Page
Admins have a special "Manage Todos" button in the navigation bar.

**To Access:**
1. Login as admin (admin@akpsi.org / admin123)
2. Click "Manage Todos" in the top navigation

**Admin Features:**
1. **View All Todos** - See todos for all pledges organized by person
2. **Add New Todo** - Click "+ Add Todo" button
   - Select which pledge to assign to
   - Enter title (required)
   - Add description (optional)
   - Set due date (optional)
   - Choose priority (Low/Medium/High)
   - Select category (General/Event/Requirement/Paddle/Other)
3. **Delete Todos** - Click the "×" button on any todo to remove it
4. **View Progress** - See completion statistics for each pledge

## How to Use

### As a Pledge:

1. **Log in** at http://localhost:3000
   - Email: pledge@akpsi.org
   - Password: pledge123

2. **View Your Dashboard**
   - Scroll down to see "Your To-Do List"
   - You'll see 5 sample todos already created

3. **Complete Tasks**
   - Click the checkbox next to any task
   - Task will be crossed out and moved to completed section
   - Refresh the page - your progress is saved!

4. **View Completed Tasks**
   - Click "▶ Completed Tasks (X)" to see what you've finished
   - Uncheck if you need to mark something as incomplete

### As an Admin:

1. **Log in** as admin
   - Email: admin@akpsi.org
   - Password: admin123

2. **Click "Manage Todos"** in the navigation

3. **View All Pledge Todos**
   - See cards for each pledge
   - View their completion progress

4. **Add a New Todo**
   - Click "+ Add Todo" button
   - Fill in the form:
     - Select the pledge from dropdown
     - Enter task title
     - (Optional) Add description
     - (Optional) Set due date
     - Choose priority level
     - Choose category
   - Click "Add Todo"

5. **Delete Todos**
   - Click the "×" button on any todo card
   - Confirm deletion
   - Todo is removed immediately

## Sample Data

The database has been seeded with 5 sample todos for the pledge user:

1. **Attend Chapter Meeting** (High Priority, Event)
   - Due: October 30, 2025
   
2. **Submit Paddle Design** (High Priority, Paddle)
   - Due: October 28, 2025
   
3. **Complete 3 Networking 1:1s** (Medium Priority, Requirement)
   - Due: November 1, 2025
   
4. **Read AKPsi History Chapter** (Low Priority, General)
   - Due: October 27, 2025
   
5. **Practice Pledge Exam** (High Priority, Requirement)
   - Due: November 5, 2025

## API Endpoints

For developers, the todo system uses these endpoints:

### Pledge Endpoints:
- `GET /api/todos` - Get all todos for current pledge
- `PUT /api/todos/:id` - Update todo completion status
- `GET /api/todos/stats` - Get completion statistics

### Admin Endpoints:
- `GET /api/todos/all` - Get all todos for all pledges
- `POST /api/todos` - Create todo for a specific pledge
- `POST /api/todos/bulk` - Create same todo for multiple pledges
- `PUT /api/todos/:id` - Update any todo (full edit access)
- `DELETE /api/todos/:id` - Delete any todo

## Testing It Out

### Quick Test Steps:

1. **Refresh your browser** at http://localhost:3000

2. **Test as Pledge:**
   - Login as pledge user
   - See 5 sample todos on dashboard
   - Check one off - it gets crossed out
   - Expand "Completed Tasks" section
   - Uncheck it - it moves back to active

3. **Test as Admin:**
   - Logout and login as admin
   - Click "Manage Todos" button
   - See the pledge user's card with 5 todos
   - Click "+ Add Todo"
   - Select "John Doe" from dropdown
   - Enter a new task
   - Click "Add Todo"
   - See it appear on the pledge's card
   - Delete it with the "×" button

## Technical Details

### Database Model:
- Title (required)
- Description (optional)
- Pledge ID (who it's assigned to)
- Completed status (boolean)
- Due date (optional)
- Priority (low/medium/high)
- Category (general/event/requirement/paddle/other)
- Created by (admin who created it)
- Completed at timestamp

### Features:
- Real-time updates (changes save immediately)
- Responsive design (works on mobile)
- Priority color coding
- Category badges
- Completion tracking
- Admin management interface

## Tips

- **Color Coding**: High priority tasks have red borders, medium have orange, low have green
- **Categories**: Use them to organize tasks by type (events, requirements, etc.)
- **Due Dates**: Optional but helpful for time-sensitive tasks
- **Descriptions**: Add extra context for complex tasks
- **Bulk Actions**: Admins can create the same todo for all pledges in a class

---

**Enjoy your new todo tracking system! 🎉**

