--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5 (Ubuntu 13.5-2.pgdg20.04+1)
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: dblink; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;


--
-- Name: EXTENSION dblink; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';


--
-- Name: dict_int; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_int WITH SCHEMA public;


--
-- Name: EXTENSION dict_int; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_int IS 'text search dictionary template for integers';


--
-- Name: dict_xsyn; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_xsyn WITH SCHEMA public;


--
-- Name: EXTENSION dict_xsyn; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_xsyn IS 'text search dictionary template for extended synonym processing';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgrowlocks; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrowlocks WITH SCHEMA public;


--
-- Name: EXTENSION pgrowlocks; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgrowlocks IS 'show row-level locking information';


--
-- Name: pgstattuple; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgstattuple WITH SCHEMA public;


--
-- Name: EXTENSION pgstattuple; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgstattuple IS 'show tuple-level statistics';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: xml2; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS xml2 WITH SCHEMA public;


--
-- Name: EXTENSION xml2; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION xml2 IS 'XPath querying and XSLT';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: films; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.films (
    _id integer NOT NULL,
    title character varying NOT NULL,
    episode_id integer NOT NULL,
    opening_crawl character varying NOT NULL,
    director character varying NOT NULL,
    producer character varying NOT NULL,
    release_date date NOT NULL
);


ALTER TABLE public.films OWNER TO vjcmcaut;

--
-- Name: films__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.films__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.films__id_seq OWNER TO vjcmcaut;

--
-- Name: films__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.films__id_seq OWNED BY public.films._id;


--
-- Name: people; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.people (
    _id integer NOT NULL,
    name character varying NOT NULL,
    mass character varying,
    hair_color character varying,
    skin_color character varying,
    eye_color character varying,
    birth_year character varying,
    gender character varying,
    species_id bigint,
    homeworld_id bigint,
    height integer
);


ALTER TABLE public.people OWNER TO vjcmcaut;

--
-- Name: people__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.people__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.people__id_seq OWNER TO vjcmcaut;

--
-- Name: people__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.people__id_seq OWNED BY public.people._id;


--
-- Name: people_in_films; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.people_in_films (
    _id integer NOT NULL,
    person_id bigint NOT NULL,
    film_id bigint NOT NULL
);


ALTER TABLE public.people_in_films OWNER TO vjcmcaut;

--
-- Name: people_in_films__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.people_in_films__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.people_in_films__id_seq OWNER TO vjcmcaut;

--
-- Name: people_in_films__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.people_in_films__id_seq OWNED BY public.people_in_films._id;


--
-- Name: pilots; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.pilots (
    _id integer NOT NULL,
    person_id bigint NOT NULL,
    vessel_id bigint NOT NULL
);


ALTER TABLE public.pilots OWNER TO vjcmcaut;

--
-- Name: pilots__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.pilots__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pilots__id_seq OWNER TO vjcmcaut;

--
-- Name: pilots__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.pilots__id_seq OWNED BY public.pilots._id;


--
-- Name: planets; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.planets (
    _id integer NOT NULL,
    name character varying,
    rotation_period integer,
    orbital_period integer,
    diameter integer,
    climate character varying,
    gravity character varying,
    terrain character varying,
    surface_water character varying,
    population bigint
);


ALTER TABLE public.planets OWNER TO vjcmcaut;

--
-- Name: planets__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.planets__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planets__id_seq OWNER TO vjcmcaut;

--
-- Name: planets__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.planets__id_seq OWNED BY public.planets._id;


--
-- Name: planets_in_films; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.planets_in_films (
    _id integer NOT NULL,
    film_id bigint NOT NULL,
    planet_id bigint NOT NULL
);


ALTER TABLE public.planets_in_films OWNER TO vjcmcaut;

--
-- Name: planets_in_films__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.planets_in_films__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planets_in_films__id_seq OWNER TO vjcmcaut;

--
-- Name: planets_in_films__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.planets_in_films__id_seq OWNED BY public.planets_in_films._id;


--
-- Name: species; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.species (
    _id integer NOT NULL,
    name character varying NOT NULL,
    classification character varying,
    average_height character varying,
    average_lifespan character varying,
    hair_colors character varying,
    skin_colors character varying,
    eye_colors character varying,
    language character varying,
    homeworld_id bigint
);


ALTER TABLE public.species OWNER TO vjcmcaut;

--
-- Name: species__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.species__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.species__id_seq OWNER TO vjcmcaut;

--
-- Name: species__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.species__id_seq OWNED BY public.species._id;


--
-- Name: species_in_films; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.species_in_films (
    _id integer NOT NULL,
    film_id bigint NOT NULL,
    species_id bigint NOT NULL
);


ALTER TABLE public.species_in_films OWNER TO vjcmcaut;

--
-- Name: species_in_films__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.species_in_films__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.species_in_films__id_seq OWNER TO vjcmcaut;

--
-- Name: species_in_films__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.species_in_films__id_seq OWNED BY public.species_in_films._id;


--
-- Name: starship_specs; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.starship_specs (
    _id integer NOT NULL,
    hyperdrive_rating character varying,
    "MGLT" character varying,
    vessel_id bigint NOT NULL
);


ALTER TABLE public.starship_specs OWNER TO vjcmcaut;

--
-- Name: starship_specs__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.starship_specs__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.starship_specs__id_seq OWNER TO vjcmcaut;

--
-- Name: starship_specs__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.starship_specs__id_seq OWNED BY public.starship_specs._id;


--
-- Name: vessels; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.vessels (
    _id integer NOT NULL,
    name character varying NOT NULL,
    manufacturer character varying,
    model character varying,
    vessel_type character varying NOT NULL,
    vessel_class character varying NOT NULL,
    cost_in_credits bigint,
    length character varying,
    max_atmosphering_speed character varying,
    crew integer,
    passengers integer,
    cargo_capacity character varying,
    consumables character varying
);


ALTER TABLE public.vessels OWNER TO vjcmcaut;

--
-- Name: vessels__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.vessels__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vessels__id_seq OWNER TO vjcmcaut;

--
-- Name: vessels__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.vessels__id_seq OWNED BY public.vessels._id;


--
-- Name: vessels_in_films; Type: TABLE; Schema: public; Owner: vjcmcaut
--

CREATE TABLE public.vessels_in_films (
    _id integer NOT NULL,
    vessel_id bigint NOT NULL,
    film_id bigint NOT NULL
);


ALTER TABLE public.vessels_in_films OWNER TO vjcmcaut;

--
-- Name: vessels_in_films__id_seq; Type: SEQUENCE; Schema: public; Owner: vjcmcaut
--

CREATE SEQUENCE public.vessels_in_films__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vessels_in_films__id_seq OWNER TO vjcmcaut;

--
-- Name: vessels_in_films__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vjcmcaut
--

ALTER SEQUENCE public.vessels_in_films__id_seq OWNED BY public.vessels_in_films._id;


--
-- Name: films _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.films ALTER COLUMN _id SET DEFAULT nextval('public.films__id_seq'::regclass);


--
-- Name: people _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people ALTER COLUMN _id SET DEFAULT nextval('public.people__id_seq'::regclass);


--
-- Name: people_in_films _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people_in_films ALTER COLUMN _id SET DEFAULT nextval('public.people_in_films__id_seq'::regclass);


--
-- Name: pilots _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.pilots ALTER COLUMN _id SET DEFAULT nextval('public.pilots__id_seq'::regclass);


--
-- Name: planets _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.planets ALTER COLUMN _id SET DEFAULT nextval('public.planets__id_seq'::regclass);


--
-- Name: planets_in_films _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.planets_in_films ALTER COLUMN _id SET DEFAULT nextval('public.planets_in_films__id_seq'::regclass);


--
-- Name: species _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.species ALTER COLUMN _id SET DEFAULT nextval('public.species__id_seq'::regclass);


--
-- Name: species_in_films _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.species_in_films ALTER COLUMN _id SET DEFAULT nextval('public.species_in_films__id_seq'::regclass);


--
-- Name: starship_specs _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.starship_specs ALTER COLUMN _id SET DEFAULT nextval('public.starship_specs__id_seq'::regclass);


--
-- Name: vessels _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.vessels ALTER COLUMN _id SET DEFAULT nextval('public.vessels__id_seq'::regclass);


--
-- Name: vessels_in_films _id; Type: DEFAULT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.vessels_in_films ALTER COLUMN _id SET DEFAULT nextval('public.vessels_in_films__id_seq'::regclass);


--
-- Name: films films_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT films_pk PRIMARY KEY (_id);


--
-- Name: people_in_films people_in_films_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people_in_films
    ADD CONSTRAINT people_in_films_pk PRIMARY KEY (_id);


--
-- Name: people people_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pk PRIMARY KEY (_id);


--
-- Name: pilots pilots_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.pilots
    ADD CONSTRAINT pilots_pk PRIMARY KEY (_id);


--
-- Name: planets_in_films planets_in_films_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.planets_in_films
    ADD CONSTRAINT planets_in_films_pk PRIMARY KEY (_id);


--
-- Name: planets planets_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_pk PRIMARY KEY (_id);


--
-- Name: species_in_films species_in_films_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.species_in_films
    ADD CONSTRAINT species_in_films_pk PRIMARY KEY (_id);


--
-- Name: species species_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_pk PRIMARY KEY (_id);


--
-- Name: starship_specs starship_specs_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.starship_specs
    ADD CONSTRAINT starship_specs_pk PRIMARY KEY (_id);


--
-- Name: vessels_in_films vessels_in_films_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.vessels_in_films
    ADD CONSTRAINT vessels_in_films_pk PRIMARY KEY (_id);


--
-- Name: vessels vessels_pk; Type: CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.vessels
    ADD CONSTRAINT vessels_pk PRIMARY KEY (_id);


--
-- Name: people people_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_fk0 FOREIGN KEY (species_id) REFERENCES public.species(_id);


--
-- Name: people people_fk1; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_fk1 FOREIGN KEY (homeworld_id) REFERENCES public.planets(_id);


--
-- Name: people_in_films people_in_films_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people_in_films
    ADD CONSTRAINT people_in_films_fk0 FOREIGN KEY (person_id) REFERENCES public.people(_id);


--
-- Name: people_in_films people_in_films_fk1; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.people_in_films
    ADD CONSTRAINT people_in_films_fk1 FOREIGN KEY (film_id) REFERENCES public.films(_id);


--
-- Name: pilots pilots_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.pilots
    ADD CONSTRAINT pilots_fk0 FOREIGN KEY (person_id) REFERENCES public.people(_id);


--
-- Name: pilots pilots_fk1; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.pilots
    ADD CONSTRAINT pilots_fk1 FOREIGN KEY (vessel_id) REFERENCES public.vessels(_id);


--
-- Name: planets_in_films planets_in_films_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.planets_in_films
    ADD CONSTRAINT planets_in_films_fk0 FOREIGN KEY (film_id) REFERENCES public.films(_id);


--
-- Name: planets_in_films planets_in_films_fk1; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.planets_in_films
    ADD CONSTRAINT planets_in_films_fk1 FOREIGN KEY (planet_id) REFERENCES public.planets(_id);


--
-- Name: species species_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_fk0 FOREIGN KEY (homeworld_id) REFERENCES public.planets(_id);


--
-- Name: species_in_films species_in_films_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.species_in_films
    ADD CONSTRAINT species_in_films_fk0 FOREIGN KEY (film_id) REFERENCES public.films(_id);


--
-- Name: species_in_films species_in_films_fk1; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.species_in_films
    ADD CONSTRAINT species_in_films_fk1 FOREIGN KEY (species_id) REFERENCES public.species(_id);


--
-- Name: starship_specs starship_specs_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.starship_specs
    ADD CONSTRAINT starship_specs_fk0 FOREIGN KEY (vessel_id) REFERENCES public.vessels(_id);


--
-- Name: vessels_in_films vessels_in_films_fk0; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.vessels_in_films
    ADD CONSTRAINT vessels_in_films_fk0 FOREIGN KEY (vessel_id) REFERENCES public.vessels(_id);


--
-- Name: vessels_in_films vessels_in_films_fk1; Type: FK CONSTRAINT; Schema: public; Owner: vjcmcaut
--

ALTER TABLE ONLY public.vessels_in_films
    ADD CONSTRAINT vessels_in_films_fk1 FOREIGN KEY (film_id) REFERENCES public.films(_id);


--
-- PostgreSQL database dump complete
--

