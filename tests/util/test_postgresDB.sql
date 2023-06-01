CREATE TABLE public.projects (
    id integer PRIMARY KEY NOT NULL,
    owner_id integer NOT NULL,
    project_name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    description text NOT NULL
);

CREATE TABLE public.projects_skills_join_table (
    id integer PRIMARY KEY NOT NULL,
    project_id integer NOT NULL,
    skill_id integer NOT NULL
);

CREATE TABLE public.skills (
    id integer PRIMARY KEY NOT NULL,
    skill text NOT NULL
);

CREATE TABLE public.users (
    id integer PRIMARY KEY NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone NOT NULL
);

CREATE TABLE public.users_projects_join_table (
    id integer PRIMARY KEY NOT NULL,
    user_id integer NOT NULL,
    projects_id integer NOT NULL
);

CREATE TABLE public.users_skills_join_table (
    id integer PRIMARY KEY NOT NULL,
    user_id integer NOT NULL,
    skill_id integer NOT NULL
);

CREATE TABLE public.favorites (
    id integer PRIMARY KEY NOT NULL,
    project_id integer NOT NULL,
    user_id integer NOT NULL
);

ALTER TABLE public.favorites
    ADD CONSTRAINT favorites_fk0 FOREIGN KEY (project_id) REFERENCES public.projects(id);

ALTER TABLE public.favorites
    ADD CONSTRAINT favorites_fk1 FOREIGN KEY (user_id) REFERENCES public.users(id);
    
ALTER TABLE public.projects
    ADD CONSTRAINT projects_fk0 FOREIGN KEY (owner_id) REFERENCES public.users(id);
    
ALTER TABLE public.projects_skills_join_table
    ADD CONSTRAINT projects_skills_join_table_fk0 FOREIGN KEY (project_id) REFERENCES public.projects(id);
    
ALTER TABLE public.projects_skills_join_table
    ADD CONSTRAINT projects_skills_join_table_fk1 FOREIGN KEY (skill_id) REFERENCES public.skills(id);
    
ALTER TABLE public.users_projects_join_table
    ADD CONSTRAINT users_projects_join_table_fk0 FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.users_projects_join_table
    ADD CONSTRAINT users_projects_join_table_fk1 FOREIGN KEY (projects_id) REFERENCES public.projects(id);
    
ALTER TABLE public.users_skills_join_table
    ADD CONSTRAINT users_skills_join_table_fk0 FOREIGN KEY (user_id) REFERENCES public.users(id);
    
ALTER TABLE public.users_skills_join_table
    ADD CONSTRAINT users_skills_join_table_fk1 FOREIGN KEY (skill_id) REFERENCES public.skills(id);