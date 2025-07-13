import { useState, useEffect } from "react";
import "./Workouts.css";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  muscleGroup: string;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: string;
  difficulty: string;
  createdAt: string;
}

function Workouts() {
  const [activeTab, setActiveTab] = useState<"current" | "saved">("current");
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [editingCurrentWorkout, setEditingCurrentWorkout] = useState(false);

  // Mock data for demonstration (fallback)
  const mockSavedWorkouts: Workout[] = [
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

  // Load saved workouts from localStorage on component mount
  useEffect(() => {
    const loadSavedWorkouts = () => {
      try {
        const stored = localStorage.getItem("savedWorkouts");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedWorkouts(parsed);
        } else {
          // Use mock data if no localStorage data exists
          setSavedWorkouts(mockSavedWorkouts);
        }
      } catch (error) {
        console.error("Error loading saved workouts:", error);
        setSavedWorkouts(mockSavedWorkouts);
      }
    };

    loadSavedWorkouts();
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    if (savedWorkouts.length > 0) {
      try {
        localStorage.setItem("savedWorkouts", JSON.stringify(savedWorkouts));
      } catch (error) {
        console.error("Error saving workouts to localStorage:", error);
      }
    }
  }, [savedWorkouts]);

  // Initialize current workout with default data if none exists
  useEffect(() => {
    if (!currentWorkout) {
      const defaultWorkout: Workout = {
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
      setCurrentWorkout(defaultWorkout);
    }
  }, [currentWorkout]);

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

  const handleDeleteWorkout = (workoutId: string) => {
    setSavedWorkouts((prev) =>
      prev.filter((workout) => workout.id !== workoutId)
    );
  };

  const handleLoadWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setActiveTab("current");
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
  };

  const handleDeleteExercise = (workoutId: string, exerciseIndex: number) => {
    setSavedWorkouts((prev) =>
      prev.map((workout) => {
        if (workout.id === workoutId) {
          const updatedExercises = workout.exercises.filter(
            (_, index) => index !== exerciseIndex
          );
          return {
            ...workout,
            exercises: updatedExercises,
          };
        }
        return workout;
      })
    );
  };

  const handleCreateNewWorkout = () => {
    if (!newWorkoutName.trim()) return;

    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      name: newWorkoutName,
      exercises: [],
      duration: "30 minutes",
      difficulty: "Beginner",
      createdAt: new Date().toISOString(),
    };

    const updatedWorkouts = [...savedWorkouts, newWorkout];
    setSavedWorkouts(updatedWorkouts);
    setShowCreateForm(false);
    setNewWorkoutName("");
  };

  const handleSaveEdit = () => {
    if (editingWorkout) {
      setSavedWorkouts((prev) =>
        prev.map((workout) =>
          workout.id === editingWorkout.id ? editingWorkout : workout
        )
      );
      setEditingWorkout(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkout(null);
  };

  const handleEditCurrentWorkout = () => {
    setEditingCurrentWorkout(true);
  };

  const handleDeleteCurrentExercise = (exerciseIndex: number) => {
    if (currentWorkout) {
      const updatedExercises = currentWorkout.exercises.filter(
        (_, index) => index !== exerciseIndex
      );
      setCurrentWorkout({
        ...currentWorkout,
        exercises: updatedExercises,
      });
    }
  };

  const handleSaveCurrentEdit = () => {
    setEditingCurrentWorkout(false);
  };

  const handleCancelCurrentEdit = () => {
    setEditingCurrentWorkout(false);
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
            {activeTab === "current" && currentWorkout && (
              <div className="current-workout">
                {editingCurrentWorkout ? (
                  <div className="workout-edit-mode">
                    <div className="edit-header">
                      <h3 className="edit-title">
                        Editing: {currentWorkout.name}
                      </h3>
                      <div className="edit-actions">
                        <button
                          className="save-edit-button"
                          onClick={handleSaveCurrentEdit}>
                          Save
                        </button>
                        <button
                          className="cancel-edit-button"
                          onClick={handleCancelCurrentEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="exercises-edit-list">
                      {currentWorkout.exercises.map((exercise, index) => (
                        <div key={index} className="exercise-edit-item">
                          <div className="exercise-edit-info">
                            <h4 className="exercise-edit-name">
                              {exercise.name}
                            </h4>
                            <span className="exercise-edit-sets">
                              {exercise.sets} sets × {exercise.reps} reps
                            </span>
                          </div>
                          <button
                            className="delete-exercise-button"
                            onClick={() => handleDeleteCurrentExercise(index)}
                            title="Delete exercise">
                            ×
                          </button>
                        </div>
                      ))}
                      {currentWorkout.exercises.length === 0 && (
                        <p className="no-exercises">
                          No exercises in this workout
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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
                      <button
                        className="action-button edit-workout"
                        onClick={handleEditCurrentWorkout}>
                        Edit Workout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="saved-workouts">
                <div className="workouts-grid">
                  {savedWorkouts.map((workout) => (
                    <div key={workout.id} className="workout-card">
                      {editingWorkout && editingWorkout.id === workout.id ? (
                        <div className="workout-edit-mode">
                          <div className="edit-header">
                            <h3 className="edit-title">
                              Editing: {workout.name}
                            </h3>
                            <div className="edit-actions">
                              <button
                                className="save-edit-button"
                                onClick={handleSaveEdit}>
                                Save
                              </button>
                              <button
                                className="cancel-edit-button"
                                onClick={handleCancelEdit}>
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div className="exercises-edit-list">
                            {editingWorkout.exercises.map((exercise, index) => (
                              <div key={index} className="exercise-edit-item">
                                <div className="exercise-edit-info">
                                  <h4 className="exercise-edit-name">
                                    {exercise.name}
                                  </h4>
                                  <span className="exercise-edit-sets">
                                    {exercise.sets} sets × {exercise.reps} reps
                                  </span>
                                </div>
                                <button
                                  className="delete-exercise-button"
                                  onClick={() =>
                                    handleDeleteExercise(workout.id, index)
                                  }
                                  title="Delete exercise">
                                  ×
                                </button>
                              </div>
                            ))}
                            {editingWorkout.exercises.length === 0 && (
                              <p className="no-exercises">
                                No exercises in this workout
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="workout-card-header">
                            <h3 className="workout-card-title">
                              {workout.name}
                            </h3>
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
                            <h4 className="exercises-preview-title">
                              Exercises:
                            </h4>
                            <div className="exercises-preview">
                              {workout.exercises
                                .slice(0, 3)
                                .map((exercise, index) => (
                                  <span
                                    key={index}
                                    className="exercise-preview">
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
                              <button
                                className="card-action-button load-workout"
                                onClick={() => handleLoadWorkout(workout)}>
                                Load
                              </button>
                              <button
                                className="card-action-button edit-workout"
                                onClick={() => handleEditWorkout(workout)}>
                                Edit
                              </button>
                              <button
                                className="card-action-button delete-workout"
                                onClick={() => handleDeleteWorkout(workout.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="create-workout-section">
                  {showCreateForm ? (
                    <div className="create-workout-form">
                      <input
                        type="text"
                        placeholder="Enter workout name..."
                        value={newWorkoutName}
                        onChange={(e) => setNewWorkoutName(e.target.value)}
                        className="workout-name-input"
                        autoFocus
                      />
                      <div className="form-actions">
                        <button
                          className="create-button"
                          onClick={handleCreateNewWorkout}
                          disabled={!newWorkoutName.trim()}>
                          Create
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => {
                            setShowCreateForm(false);
                            setNewWorkoutName("");
                          }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="create-workout-button"
                      onClick={() => setShowCreateForm(true)}>
                      + Create New Workout
                    </button>
                  )}
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
