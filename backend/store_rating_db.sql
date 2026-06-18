--
-- PostgreSQL database dump
--

\restrict JBAsKSYVM1mgakJ5SyOcFTAPBooC1IBf345NiS3Nj1kSsvj0wjVteaT1S1Gr90W

-- Dumped from database version 14.22
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'admin',
    'user',
    'store_owner'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ratings" (
    id integer NOT NULL,
    rating integer NOT NULL,
    "userId" integer NOT NULL,
    "storeId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Ratings" OWNER TO postgres;

--
-- Name: Ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Ratings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Ratings_id_seq" OWNER TO postgres;

--
-- Name: Ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Ratings_id_seq" OWNED BY public."Ratings".id;


--
-- Name: Stores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Stores" (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    email character varying(255) NOT NULL,
    address character varying(400) NOT NULL,
    "ownerId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Stores" OWNER TO postgres;

--
-- Name: Stores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Stores_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Stores_id_seq" OWNER TO postgres;

--
-- Name: Stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Stores_id_seq" OWNED BY public."Stores".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    email character varying(255) NOT NULL,
    address character varying(400) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" DEFAULT 'user'::public."enum_Users_role",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings" ALTER COLUMN id SET DEFAULT nextval('public."Ratings_id_seq"'::regclass);


--
-- Name: Stores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores" ALTER COLUMN id SET DEFAULT nextval('public."Stores_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ratings" (id, rating, "userId", "storeId", "createdAt", "updatedAt") FROM stdin;
1	5	3	1	2026-06-16 15:32:17.115+05:30	2026-06-16 15:32:17.115+05:30
\.


--
-- Data for Name: Stores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Stores" (id, name, email, address, "ownerId", "createdAt", "updatedAt") FROM stdin;
1	Vaishnavi Shyam Wakodikar	vaishnaviwakodikar09@gmail.com	House No. 409/B , Ganjakhet chowk, Behind narayan market, Nandbachi Dob	\N	2026-06-16 15:23:53.375+05:30	2026-06-16 15:23:53.375+05:30
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, address, password, role, "createdAt", "updatedAt") FROM stdin;
1	Vaishnavi Shyam Wakodikar	vaishnaviwakodikar09@gmail.com	House No. 409/B , Ganjakhet chowk, Behind narayan market, Nandbachi Dob	$2b$10$8B58MmJ6RI/KsMmNsuyGz.Byy3wrTPi6PZ8CtrpjH507uwhSuZXUe	user	2026-06-16 15:04:00.768+05:30	2026-06-16 15:04:00.768+05:30
2	System Administrator User	admin@gmail.com	Admin Office, Main Street, City	$2b$10$lwVcU.y37r8TLX0g3mlZQ.khmDlmrOAFRGrQXg/5y/H2Qby1XVCHe	admin	2026-06-16 15:06:30.263+05:30	2026-06-16 15:06:30.263+05:30
3	Normal Testing User One	user@gmail.com	789 User Street Mumbai Maharashtra	$2b$10$6KCXwvF6hAKMfwkWC2Tkuu.16tsU.2TAltXVCU9O4XIfvvFrglyLm	user	2026-06-16 15:31:37.246+05:30	2026-06-16 15:31:37.246+05:30
4	Vaishnavi Shyam Wakodikar	admin1@gmail.com	House No. 409/B , Ganjakhet chowk, Behind narayan market, Nandbachi Dob	$2b$10$ep49fJ.kDkVErHeZlynp9e4f31822GGQd/UChmc/Pa3UJSfsqos3C	store_owner	2026-06-17 10:23:26.188+05:30	2026-06-17 10:23:26.188+05:30
\.


--
-- Name: Ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Ratings_id_seq"', 1, true);


--
-- Name: Stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Stores_id_seq"', 2, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 4, true);


--
-- Name: Ratings Ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY (id);


--
-- Name: Stores Stores_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key" UNIQUE (email);


--
-- Name: Stores Stores_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key1" UNIQUE (email);


--
-- Name: Stores Stores_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key2" UNIQUE (email);


--
-- Name: Stores Stores_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key3" UNIQUE (email);


--
-- Name: Stores Stores_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key4" UNIQUE (email);


--
-- Name: Stores Stores_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key5" UNIQUE (email);


--
-- Name: Stores Stores_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key6" UNIQUE (email);


--
-- Name: Stores Stores_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key7" UNIQUE (email);


--
-- Name: Stores Stores_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key8" UNIQUE (email);


--
-- Name: Stores Stores_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_email_key9" UNIQUE (email);


--
-- Name: Stores Stores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Ratings Ratings_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Stores"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ratings Ratings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Stores Stores_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stores"
    ADD CONSTRAINT "Stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict JBAsKSYVM1mgakJ5SyOcFTAPBooC1IBf345NiS3Nj1kSsvj0wjVteaT1S1Gr90W

