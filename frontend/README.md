# Fit App - Front End

This is the mobile front end for the Fit App—a fitness tracking application built with React Native and Expo. It provides a user interface for starting workout sessions, viewing workout history and analytics, and managing user profiles.

## Features & Screens

- **Home**  
  - Displays the details of the most recent workout session (date, duration, per-activity rep/weight details).  
  - Shows a small chart placeholder with aggregated analytics (e.g. trends in performance).  
  - Includes quick-action buttons (e.g. “Start Session”).

- **Workouts**  
  - Lists existing workout templates (set up once).  
  - Selecting a workout shows its details—including its activities and a history of previous sessions.  
  - Provides a button to edit the workout template or start a new session based on it.

- **Analytics**  
  - Displays aggregated workout data such as average reps, max weight lifted, total workout duration, and workouts per week.
  - (Future enhancements can include trend charts and additional metrics.)

- **Profile**  
  - Shows basic user profile information with editable fields (name, email, age, weight, height).

- **Create/Edit Workout Screen**  
  - Allows the user to create or edit a workout template.  
  - For each activity, the user selects an exercise from a dropdown that includes existing exercises with an option “Add new exercise.”  
  - If “Add new exercise” is selected, the UI switches to allow entering a new exercise’s details (name, type, default sets for lifts or default duration/unit for cardio).  
  - Activities (with their default sets or duration/unit) are then saved as part of the workout template.

- **Start Session Screen**  
  - Pre-populated with the activities from the chosen workout template.
  - The user enters performance data (e.g. reps/weight for lifts) for each activity and finishes the session to save it.

## Setup & Development

### Prerequisites

- Node.js (v14+ recommended)
- Yarn package manager
- Expo CLI (if running on a simulator or physical device)

### Installation

1. Clone the repository.
2. Navigate to the front-end directory.
3. Install dependencies:

   ```bash
   yarn install
