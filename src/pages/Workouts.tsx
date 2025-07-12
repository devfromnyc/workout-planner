import { useState } from "react";
import "./Workouts.css";

interface Workout {
  id: string;
  name: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    muscleGroup: string;
  }>;
  duration: string;
  difficulty: string;
  createdAt: string;
}

function Workouts() {
  const [activeTab, setActiveTab] = useState<"current" | "saved">("current");

  // Mock data for demonstration
  const currentWorkout: Workout = {
    id: "current-1",
    name: "Morning Strength Routine",
    exercises: [
      { name: "Push-ups", sets: 3, reps: 15, muscleGroup: "chest" },
      { name: "Squats", sets: 3, reps: 20, muscleGroup: "legs" },
      { name: "Plank", sets: 3, reps: 30, muscleGroup: "core" },
      { name: "Pull-ups", sets: 3, reps: 8, muscleGroup: "back" },
    ],
    duration: "45 minutes",
    difficulty: "Intermediate",
    createdAt: new Date().toISOString(),
  };

  const savedWorkouts: Workout[] = [
    {
      id: "saved-1",
      name: "Full Body Blast",
      exercises: [
        { name: "Burpees", sets: 4, reps: 12, muscleGroup: "fullBody" },
        {
          name: "Mountain Climbers",
          sets: 3,
          reps: 20,
          muscleGroup: "fullBody",
        },
        { name: "Jumping Jacks", sets: 3, reps: 30, muscleGroup: "fullBody" },
      ],
      duration: "30 minutes",
      difficulty: "Advanced",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "saved-2",
      name: "Upper Body Focus",
      exercises: [
        { name: "Push-ups", sets: 4, reps: 15, muscleGroup: "chest" },
        { name: "Diamond Push-ups", sets: 3, reps: 10, muscleGroup: "chest" },
        { name: "Pike Push-ups", sets: 3, reps: 12, muscleGroup: "shoulders" },
        { name: "Pull-ups", sets: 4, reps: 8, muscleGroup: "back" },
      ],
      duration: "40 minutes",
      difficulty: "Intermediate",
      createdAt: "2024-01-10T14:30:00Z",
    },
    {
      id: "saved-3",
      name: "Core Crusher",
      exercises: [
        { name: "Plank", sets: 3, reps: 45, muscleGroup: "core" },
        { name: "Crunches", sets: 3, reps: 20, muscleGroup: "core" },
        { name: "Russian Twists", sets: 3, reps: 15, muscleGroup: "core" },
      ],
      duration: "25 minutes",
      difficulty: "Beginner",
      createdAt: "2024-01-08T09:15:00Z",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "#10b981";
      case "intermediate":
        return "#f59e0b";
      case "advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="workouts-page">
      {/* Header */}
      <header className="workouts-header">
        <div className="header-content">
          <h1 className="page-title">💪 Workouts</h1>
          <p className="page-subtitle">Manage your workout routines</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="workouts-main">
        <div className="workouts-container">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${
                activeTab === "current" ? "active" : ""
              }`}
              onClick={() => setActiveTab("current")}>
              Current Workout
            </button>
            <button
              className={`tab-button ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}>
              Saved Workouts
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "current" && (
              <div className="current-workout">
                <div className="workout-header">
                  <h2 className="workout-title">{currentWorkout.name}</h2>
                  <div className="workout-meta">
                    <span className="workout-duration">
                      ⏱️ {currentWorkout.duration}
                    </span>
                    <span
                      className="workout-difficulty"
                      style={{
                        backgroundColor: getDifficultyColor(
                          currentWorkout.difficulty
                        ),
                      }}>
                      {currentWorkout.difficulty}
                    </span>
                  </div>
                </div>

                <div className="exercises-list">
                  <h3 className="exercises-title">Today's Exercises</h3>
                  {currentWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                      <div className="exercise-info">
                        <h4 className="exercise-name">{exercise.name}</h4>
                        <span className="muscle-group">
                          {exercise.muscleGroup}
                        </span>
                      </div>
                      <div className="exercise-sets">
                        <span className="sets-reps">
                          {exercise.sets} sets × {exercise.reps} reps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="workout-actions">
                  <button className="action-button start-workout">
                    Start Workout
                  </button>
                  <button className="action-button edit-workout">
                    Edit Workout
                  </button>
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <div className="saved-workouts">
                <div className="workouts-grid">
                  {savedWorkouts.map((workout) => (
                    <div key={workout.id} className="workout-card">
                      <div className="workout-card-header">
                        <h3 className="workout-card-title">{workout.name}</h3>
                        <span
                          className="workout-card-difficulty"
                          style={{
                            backgroundColor: getDifficultyColor(
                              workout.difficulty
                            ),
                          }}>
                          {workout.difficulty}
                        </span>
                      </div>

                      <div className="workout-card-meta">
                        <span className="workout-card-duration">
                          ⏱️ {workout.duration}
                        </span>
                        <span className="workout-card-exercises">
                          🏋️ {workout.exercises.length} exercises
                        </span>
                      </div>

                      <div className="workout-card-exercises">
                        <h4 className="exercises-preview-title">Exercises:</h4>
                        <div className="exercises-preview">
                          {workout.exercises
                            .slice(0, 3)
                            .map((exercise, index) => (
                              <span key={index} className="exercise-preview">
                                {exercise.name}
                              </span>
                            ))}
                          {workout.exercises.length > 3 && (
                            <span className="more-exercises">
                              +{workout.exercises.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="workout-card-footer">
                        <span className="workout-card-date">
                          Created: {formatDate(workout.createdAt)}
                        </span>
                        <div className="workout-card-actions">
                          <button className="card-action-button load-workout">
                            Load
                          </button>
                          <button className="card-action-button edit-workout">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="create-workout-section">
                  <button className="create-workout-button">
                    + Create New Workout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Workouts;
