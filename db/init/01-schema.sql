-- Portfolio schema. Runs once, on first start of an empty Postgres volume.

CREATE TABLE profile (
  id         smallint PRIMARY KEY CHECK (id = 1),          -- single-row table
  full_name  text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  headline   text NOT NULL CHECK (char_length(headline) BETWEEN 1 AND 200),
  summary    text NOT NULL CHECK (char_length(summary) BETWEEN 1 AND 2000),
  location   text NOT NULL CHECK (char_length(location) BETWEEN 1 AND 120),
  email      text NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

CREATE TABLE projects (
  id            serial PRIMARY KEY,
  slug          text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{1,80}$'),
  title         text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  subtitle      text NOT NULL CHECK (char_length(subtitle) BETWEEN 1 AND 200),
  description   text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 2000),
  role          text NOT NULL CHECK (char_length(role) BETWEEN 1 AND 300),
  technologies  text[] NOT NULL DEFAULT '{}',
  repo_url      text CHECK (repo_url ~ '^https://'),
  live_url      text CHECK (live_url ~ '^https://'),
  sort_order    integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE skills (
  id              serial PRIMARY KEY,
  category        text NOT NULL,
  category_order  integer NOT NULL DEFAULT 0,
  name            text NOT NULL,
  sort_order      integer NOT NULL DEFAULT 0
);

CREATE TABLE education (
  id            serial PRIMARY KEY,
  institution   text NOT NULL,
  qualification text NOT NULL,
  period        text NOT NULL,
  details       text,
  sort_order    integer NOT NULL DEFAULT 0
);

CREATE TABLE achievements (
  id          serial PRIMARY KEY,
  title       text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0
);
