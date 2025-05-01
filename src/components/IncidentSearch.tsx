import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

interface IncidentSearchProps {
  onSearch: (query: string) => void;
  query: string;
}

const IncidentSearch: React.FC<IncidentSearchProps> = ({ onSearch, query }) => {
  const [localQuery, setLocalQuery] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const clearSearch = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSearch}
      className="relative mb-4"
    >
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search incidents by title or description..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="pl-10 pr-10 w-full" // Adjusted padding for the search icon and clear button
          />
          {localQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button
          type="submit"
          size="sm"
          className="w-full sm:w-auto"
        >
          Search
        </Button>
      </div>
    </motion.form>
  );
};

export default IncidentSearch;
