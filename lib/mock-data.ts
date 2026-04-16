// בעה"י
export interface Snippet {
  id: string
  title: string
  language: string
  description: string
  code: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  authorUsername: string
}

export interface User {
  id: string
  username: string
  email: string
  displayName: string
  bio: string
  createdAt: string
}

export const languageColors: Record<string, string> = {
  javascript: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  typescript: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  python: "bg-green-500/20 text-green-600 dark:text-green-400",
  rust: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  go: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  java: "bg-red-500/20 text-red-600 dark:text-red-400",
  cpp: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  html: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  css: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  sql: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  bash: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
  json: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
}

export const languages = [
  "javascript", "typescript", "python", "rust",
  "go", "java", "cpp", "html", "css", "sql", 
  "bash", "json", "yaml", "markdown", "xml", "php"
]

export const mockUser: User = {
  id: "1",
  username: "johndoe",
  email: "john@example.com",
  displayName: "John Doe",
  bio: "Full-stack developer passionate about clean code and open source.",
  createdAt: "2024-01-15",
}

export const mockSnippets: Snippet[] = [
  {
    id: "1",
    title: "React useDebounce Hook",
    language: "typescript",
    description: "A custom React hook for debouncing values",
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    isPublic: true,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    authorUsername: "johndoe",
  },
  {
    id: "2",
    title: "Quick Sort Implementation",
    language: "python",
    description: "Classic quicksort algorithm in Python",
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(numbers))`,
    isPublic: true,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-12",
    authorUsername: "johndoe",
  },
  {
    id: "3",
    title: "Fetch with Retry",
    language: "javascript",
    description: "Fetch wrapper with automatic retry logic",
    code: `async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}`,
    isPublic: false,
    createdAt: "2024-03-08",
    updatedAt: "2024-03-08",
    authorUsername: "johndoe",
  },
  {
    id: "4",
    title: "Rust Error Handling",
    language: "rust",
    description: "Pattern for handling errors elegantly in Rust",
    code: `use std::fs::File;
use std::io::{self, Read};

fn read_file_contents(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn main() {
    match read_file_contents("config.txt") {
        Ok(contents) => println!("File contents: {}", contents),
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}`,
    isPublic: true,
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05",
    authorUsername: "johndoe",
  },
  {
    id: "5",
    title: "SQL Window Functions",
    language: "sql",
    description: "Example of using window functions for analytics",
    code: `SELECT 
    employee_name,
    department,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,
    salary - LAG(salary) OVER (ORDER BY hire_date) as salary_diff
FROM employees
ORDER BY department, salary DESC;`,
    isPublic: true,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    authorUsername: "johndoe",
  },
  {
    id: "6",
    title: "Go HTTP Server",
    language: "go",
    description: "Simple HTTP server with middleware",
    code: `package main

import (
    "log"
    "net/http"
    "time"
)

func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello, World!"))
    })

    handler := loggingMiddleware(mux)
    log.Fatal(http.ListenAndServe(":8080", handler))
}`,
    isPublic: false,
    createdAt: "2024-02-28",
    updatedAt: "2024-02-28",
    authorUsername: "johndoe",
  },
]

export const publicSnippets = mockSnippets.filter((s) => s.isPublic)
