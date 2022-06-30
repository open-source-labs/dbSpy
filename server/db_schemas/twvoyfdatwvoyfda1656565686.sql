--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5 (Ubuntu 11.5-3.pgdg18.04+1)
-- Dumped by pg_dump version 14.4

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

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


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

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.accounts (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    created_on timestamp without time zone NOT NULL,
    last_login timestamp without time zone
);


ALTER TABLE public.accounts OWNER TO twvoyfda;

--
-- Name: accounts_user_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.accounts_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_user_id_seq OWNER TO twvoyfda;

--
-- Name: accounts_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.accounts_user_id_seq OWNED BY public.accounts.user_id;


--
-- Name: conditions; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.conditions (
    id integer NOT NULL,
    hypertension boolean,
    diabetes boolean,
    cancer boolean,
    alzheimers boolean,
    dementia boolean,
    smoking boolean,
    parkinsons boolean,
    arthritis boolean,
    ckd boolean,
    stroke boolean,
    copd boolean,
    osteoporosis boolean,
    user_id integer
);


ALTER TABLE public.conditions OWNER TO twvoyfda;

--
-- Name: conditions_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.conditions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conditions_id_seq OWNER TO twvoyfda;

--
-- Name: conditions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.conditions_id_seq OWNED BY public.conditions.id;


--
-- Name: location; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.location (
    id integer NOT NULL,
    zipcode character varying(15),
    state character varying(20),
    city character varying(30)
);


ALTER TABLE public.location OWNER TO twvoyfda;

--
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_id_seq OWNER TO twvoyfda;

--
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- Name: profile; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.profile (
    id integer NOT NULL,
    age integer,
    weight integer,
    address character varying(50),
    role character varying(10),
    phone character varying(20),
    language character varying(15),
    firstname character varying(20),
    lastname character varying(20),
    location_id integer,
    user_id integer,
    email character varying(40)
);


ALTER TABLE public.profile OWNER TO twvoyfda;

--
-- Name: profile_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profile_id_seq OWNER TO twvoyfda;

--
-- Name: profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.profile_id_seq OWNED BY public.profile.id;


--
-- Name: request; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.request (
    id integer NOT NULL,
    starttime character varying(20),
    endtime character varying(20),
    startdate character varying(20),
    enddate character varying(20),
    message text,
    status character varying(20),
    m boolean,
    t boolean,
    w boolean,
    th boolean,
    f boolean,
    sat boolean,
    sun boolean,
    provider_id integer,
    patient_id integer
);


ALTER TABLE public.request OWNER TO twvoyfda;

--
-- Name: request_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_id_seq OWNER TO twvoyfda;

--
-- Name: request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.request_id_seq OWNED BY public.request.id;


--
-- Name: user_accounts; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.user_accounts (
    id integer NOT NULL,
    username character varying(20),
    password character varying(20),
    role character varying(10)
);


ALTER TABLE public.user_accounts OWNER TO twvoyfda;

--
-- Name: user_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.user_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_accounts_id_seq OWNER TO twvoyfda;

--
-- Name: user_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.user_accounts_id_seq OWNED BY public.user_accounts.id;


--
-- Name: userb; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.userb (
    id integer NOT NULL,
    username character varying(20),
    password character varying(20),
    role character varying(10)
);


ALTER TABLE public.userb OWNER TO twvoyfda;

--
-- Name: userb_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.userb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userb_id_seq OWNER TO twvoyfda;

--
-- Name: userb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.userb_id_seq OWNED BY public.userb.id;


--
-- Name: usert; Type: TABLE; Schema: public; Owner: twvoyfda
--

CREATE TABLE public.usert (
    id integer NOT NULL
);


ALTER TABLE public.usert OWNER TO twvoyfda;

--
-- Name: usert_id_seq; Type: SEQUENCE; Schema: public; Owner: twvoyfda
--

CREATE SEQUENCE public.usert_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usert_id_seq OWNER TO twvoyfda;

--
-- Name: usert_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: twvoyfda
--

ALTER SEQUENCE public.usert_id_seq OWNED BY public.usert.id;


--
-- Name: accounts user_id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.accounts ALTER COLUMN user_id SET DEFAULT nextval('public.accounts_user_id_seq'::regclass);


--
-- Name: conditions id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.conditions ALTER COLUMN id SET DEFAULT nextval('public.conditions_id_seq'::regclass);


--
-- Name: location id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- Name: profile id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.profile ALTER COLUMN id SET DEFAULT nextval('public.profile_id_seq'::regclass);


--
-- Name: request id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.request ALTER COLUMN id SET DEFAULT nextval('public.request_id_seq'::regclass);


--
-- Name: user_accounts id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.user_accounts ALTER COLUMN id SET DEFAULT nextval('public.user_accounts_id_seq'::regclass);


--
-- Name: userb id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.userb ALTER COLUMN id SET DEFAULT nextval('public.userb_id_seq'::regclass);


--
-- Name: usert id; Type: DEFAULT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.usert ALTER COLUMN id SET DEFAULT nextval('public.usert_id_seq'::regclass);


--
-- Name: accounts accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (user_id);


--
-- Name: accounts accounts_username_key; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_username_key UNIQUE (username);


--
-- Name: conditions conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_pkey PRIMARY KEY (id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: request request_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (id);


--
-- Name: user_accounts user_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_pkey PRIMARY KEY (id);


--
-- Name: userb userb_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.userb
    ADD CONSTRAINT userb_pkey PRIMARY KEY (id);


--
-- Name: usert usert_pkey; Type: CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.usert
    ADD CONSTRAINT usert_pkey PRIMARY KEY (id);


--
-- Name: profile profile_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- Name: profile profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_accounts(id);


--
-- Name: request request_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.user_accounts(id);


--
-- Name: request request_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.user_accounts(id);


--
-- Name: conditions user_id; Type: FK CONSTRAINT; Schema: public; Owner: twvoyfda
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT user_id FOREIGN KEY (id) REFERENCES public.user_accounts(id);


--
-- PostgreSQL database dump complete
--

