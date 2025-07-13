import { useState, useCallback, useEffect } from "react";
import "./AddToWorkout.css";

interface Exercise {
  name: string;
  tags: Record<string, boolean>;
}

interface Workout {
  id: string;
  name: string;
  exercises: any[];
  duration: string;
  difficulty: string;
  createdAt: string;
}

interface AddToWorkoutProps {
  exercise: Exercise;
  muscleGroup: string;
}

function AddToWorkout({ exercise, muscleGroup }: AddToWorkoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);

  // Load saved workouts from localStorage
  const loadSavedWorkouts = useCallback(() => {
    try {
      const stored = localStorage.getItem("savedWorkouts");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedWorkouts(parsed);
      }
    } catch (error) {
      console.error("Error loading saved workouts:", error);
      setSavedWorkouts([]);
    }
  }, []);

  // Load workouts when component mounts
  useEffect(() => {
    loadSavedWorkouts();
  }, [loadSavedWorkouts]);

  const handleAddToExistingWorkout = (workoutId: string) => {
    try {
      const updatedWorkouts = savedWorkouts.map((workout) => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: [
              ...workout.exercises,
              {
                name: exercise.name,
                sets: 3, // Default values
                reps: 10,
                muscleGroup: muscleGroup,
              },
            ],
          };
        }
        return workout;
      });

      localStorage.setItem("savedWorkouts", JSON.stringify(updatedWorkouts));
      setSavedWorkouts(updatedWorkouts);
      setIsOpen(false);

      // Show success message (you could add a toast notification here)
      console.log(`Added ${exercise.name} to workout`);
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
    }
  };

  const handleCreateNewWorkout = () => {
    if (!newWorkoutName.trim()) return;

    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      name: newWorkoutName,
      exercises: [
        {
          name: exercise.name,
          sets: 3,
          reps: 10,
          muscleGroup: muscleGroup,
        },
      ],
      duration: "30 minutes",
      difficulty: "Beginner",
      createdAt: new Date().toISOString(),
    };

    const updatedWorkouts = [...savedWorkouts, newWorkout];
    localStorage.setItem("savedWorkouts", JSON.stringify(updatedWorkouts));
    setSavedWorkouts(updatedWorkouts);
    setShowNewWorkoutForm(false);
    setNewWorkoutName("");
    setIsOpen(false);

    console.log(
      `Created new workout "${newWorkoutName}" with ${exercise.name}`
    );
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      loadSavedWorkouts(); // Refresh workouts when opening
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="add-to-workout">
      <button
        className="add-button"
        onClick={toggleDropdown}
        title="Add to workout">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <h4>Add to Workout</h4>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {savedWorkouts.length > 0 && (
            <div className="existing-workouts">
              <h5>Existing Workouts:</h5>
              {savedWorkouts.map((workout) => (
                <button
                  key={workout.id}
                  className="workout-option"
                  onClick={() => handleAddToExistingWorkout(workout.id)}>
                  {workout.name}
                </button>
              ))}
            </div>
          )}

          {!showNewWorkoutForm ? (
            <button
              className="new-workout-button"
              onClick={() => setShowNewWorkoutForm(true)}>
              + Create New Workout
            </button>
          ) : (
            <div className="new-workout-form">
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
                  className="save-button"
                  onClick={handleCreateNewWorkout}
                  disabled={!newWorkoutName.trim()}>
                  Create
                </button>
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowNewWorkoutForm(false);
                    setNewWorkoutName("");
                  }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddToWorkout;
