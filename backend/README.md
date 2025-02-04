
---

## Back End README

```markdown
# Fit App - Back End

This is the back end for the Fit App—a fitness tracking application built with Node.js, Express, TSOA, and MongoDB. It provides RESTful APIs for authentication, user management, managing exercises, and workout templates.

## Features & Data Model

### Data Models

- **User**  
  - Fields:  
    - `email` (unique, required)  
    - `name` (required)  
    - `provider` (enum: `apple` or `google`)  
    - `providerId` (unique id from the provider)  

- **Exercise**  
  - Represents a unique movement (e.g. "Bench Press", "Running").  
  - Fields:  
    - `name` (unique, required)  
    - `type` (`Lift` or `Cardio`)  
    - For lifts: `defaultSets` (array of objects with `reps` and `weight`)  
    - For cardio: `defaultDuration` and `defaultUnit`

- **WorkoutTemplate**  
  - Represents a user-created workout plan (template).  
  - Fields:  
    - `userId` (refers to the User)  
    - `name` (required)  
    - `description` (optional)  
    - `activities` (array of TemplateActivity objects)
  - **TemplateActivity**  
    - Contains a reference to an Exercise (`exercise`: Exercise _id).  
    - Additional fields (depending on exercise type):  
      - For lifts: `defaultSets`  
      - For cardio: `defaultDuration`, `defaultUnit`

### API Endpoints

- **Authentication** (`/auth`)
  - `POST /auth/google` – Sign in with Google.  
  - `POST /auth/apple` – Sign in with Apple.  
  - Returns a JWT token and User data.

- **User**  
  - (Future endpoints could support user profile updates, etc.)

- **Exercises** (`/exercises`)
  - `GET /exercises` – Get all exercises.
  - `POST /exercises` – Create a new exercise.
  - `PUT /exercises/{exerciseId}` – Update an exercise.
  - `DELETE /exercises/{exerciseId}` – Delete an exercise.

- **Workout Templates** (`/templates`)
  - `POST /templates` – Create a new workout template.
    - Example payload:
      ```json
      {
        "userId": 1,
        "name": "Upper Body Strength",
        "description": "Focus on chest, shoulders, and arms",
        "activities": [
          {
            "exercise": "60f5a3b8e4b0a91234567890",
            "defaultSets": [{ "reps": 8, "weight": 100 }]
          }
        ]
      }
      ```
  - `GET /templates` – (Additional endpoints can be added for reading/updating templates.)

## Setup & Development

### Prerequisites

- Node.js (v14+ recommended)
- Yarn package manager
- MongoDB (local instance or via Docker)
- (Optional) Docker and Docker Compose

### Installation

1. Clone the repository.
2. Navigate to the back-end directory.
3. Install dependencies:

   ```bash
   yarn install
   ```
4. Run 

    ```bash
    docker-compose up --build
    ```

