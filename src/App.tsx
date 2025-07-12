import { useState } from "react";
import { exercises } from "./data/exercises";
import Workouts from "./pages/Workouts";
import "./App.css";

interface Exercise {
  name: string;
  tags: Record<string, boolean>;
}

interface SearchResult {
  muscleGroup: string;
  exerciseKey: string;
  exercise: Exercise;
}

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "workouts">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Search through all muscle groups and exercises
    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    Object.entries(exercises).forEach(([muscleGroup, muscleExercises]) => {
      Object.entries(muscleExercises).forEach(([exerciseKey, exercise]) => {
        // Search in exercise name
        if (exercise.name.toLowerCase().includes(query)) {
          results.push({
            muscleGroup,
            exerciseKey,
            exercise,
          });
        }
        // Search in tags
        else if (
          Object.keys(exercise.tags).some((tag) =>
            tag.toLowerCase().includes(query)
          )
        ) {
          results.push({
            muscleGroup,
            exerciseKey,
            exercise,
          });
        }
      });
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const getActiveTags = (tags: Record<string, boolean>) => {
    return Object.entries(tags)
      .filter(([_, isActive]) => isActive)
      .map(([tag, _]) => tag)
      .join(", ");
  };

  // Navigation component
  const Navigation = () => (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-brand">
          <h1 className="nav-logo">💪 WorkoutPlanner</h1>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === "home" ? "active" : ""}`}
            onClick={() => setCurrentPage("home")}>
            Home
          </button>
          <button
            className={`nav-link ${currentPage === "workouts" ? "active" : ""}`}
            onClick={() => setCurrentPage("workouts")}>
            Workouts
          </button>
        </div>
      </div>
    </nav>
  );

  // Home page component
  const HomePage = () => (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">💪 WorkoutPlanner</h1>
          <p className="tagline">Plan your perfect workout routine</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="search-container">
          <h2 className="search-title">Find Your Perfect Workout</h2>
          <p className="search-subtitle">
            Search for exercises, muscle groups, or fitness goals
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search for exercises, muscle groups, or workout types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              type="submit"
              className="search-button"
              disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3 className="results-title">
                Found {searchResults.length} exercise(s)
              </h3>
              <div className="results-grid">
                {searchResults.map((result, index) => (
                  <div key={index} className="exercise-card">
                    <div className="exercise-header">
                      <h4 className="exercise-name">{result.exercise.name}</h4>
                      <span className="muscle-group">{result.muscleGroup}</span>
                    </div>
                    <div className="exercise-tags">
                      <span className="tags-label">Tags:</span>
                      <span className="tags-text">
                        {getActiveTags(result.exercise.tags)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="no-results">
              <p>No exercises found for "{searchQuery}"</p>
              <p className="suggestion">
                Try searching for: chest, legs, core, beginner, strength, etc.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  return (
    <div className="app-wrapper">
      <Navigation />
      {currentPage === "home" ? <HomePage /> : <Workouts />}
    </div>
  );
}

export default App;
