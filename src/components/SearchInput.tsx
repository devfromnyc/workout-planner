import React, { useState, useCallback } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchInput: React.FC<SearchInputProps> = React.memo(
  ({ onSearch, isSearching }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        console.log("Input changed to:", newValue);
        setSearchQuery(newValue);
      },
      []
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        console.log("=== FORM SUBMITTED ===");
        onSearch(searchQuery);
      },
      [searchQuery, onSearch]
    );

    return (
      <form onSubmit={handleSubmit} className="search-form">
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
            onChange={handleInputChange}
            className="search-input"
          />
        </div>
        <button type="submit" className="search-button" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
