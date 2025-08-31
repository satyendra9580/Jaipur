# Database Schema (MongoDB)

This app uses two collections: `profiles` and `projects`.

---

## Collection: profiles

Example document
```json
{
  "_id": "ObjectId",
  "name": "Your Name",
  "email": "your.email@example.com",
  "summary": "Short professional summary",
  "education": [
    {"degree":"B.Tech CSE","institution":"University X","startYear":2016,"endYear":2020}
  ],
  "skills": ["javascript","react","node","mongodb"],
  "work": [
    {
      "company": "Company A",
      "title": "Software Engineer",
      "startDate": "2021-01-01T00:00:00.000Z",
      "endDate": null,
      "description": "Worked on web apps...",
      "skills": ["react","node"],
      "links": ["https://example.com/project"]
    }
  ],
  "links": {
    "github": "https://github.com/you",
    "linkedin": "https://linkedin.com/in/you",
    "portfolio": "https://your-site.com"
  },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

Indexes
- `{ email: 1 }` unique
- Text index: `{ name: "text", summary: "text", "work.description": "text", "education.degree": "text", "education.institution": "text", skills: "text" }`

Notes
- Single profile assumed for simplicity; email is the natural unique key.

---

## Collection: projects

Example document
```json
{
  "_id": "ObjectId",
  "title": "Portfolio Website",
  "description": "Personal site built with React and Vite",
  "skills": ["react","vite","css"],
  "links": ["https://your-site.com"],
  "repoUrl": "https://github.com/you/portfolio",
  "demoUrl": "https://your-site.com",
  "startDate": "2023-01-01T00:00:00.000Z",
  "endDate": null,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

Indexes
- Text index: `{ title: "text", description: "text" }`
- Multikey index: `{ skills: 1 }` (implicitly created by field index)

Notes
- `skills/top` aggregates over `projects.skills`.

---

## Relationships

- This simple playground does not strictly relate projects to the profile, assuming a single owner profile. If needed, add an `ownerEmail` on projects or a `profileId` reference.
