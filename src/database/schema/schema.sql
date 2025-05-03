--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: checklist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklist_items (
    id integer NOT NULL,
    checklist_id integer NOT NULL,
    compliance_check_id integer NOT NULL,
    priority_group text,
    section_number character varying(255),
    section_name character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT checklist_items_priority_group_check CHECK ((priority_group = ANY (ARRAY['P0'::text, 'P1'::text, 'P2'::text, 'P3'::text, 'P4'::text, 'P5'::text, 'P6'::text, 'P7'::text, 'P8'::text, 'P9'::text, 'P10'::text, 'P11'::text, 'P12'::text, 'P13'::text, 'P14'::text, 'R0'::text, 'R1'::text, 'R2'::text, 'R3'::text, 'R4'::text, 'R5'::text, 'R6'::text, 'R7'::text, 'R8'::text, 'R9'::text, 'R10'::text, 'R11'::text, 'R12'::text, 'R13'::text, 'R14'::text])))
);


--
-- Name: checklist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.checklist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: checklist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.checklist_items_id_seq OWNED BY public.checklist_items.id;


--
-- Name: compliance_checklists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_checklists (
    id integer NOT NULL,
    author text NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    code_name character varying(255) NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: compliance_checklists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_checklists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_checklists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_checklists_id_seq OWNED BY public.compliance_checklists.id;


--
-- Name: compliance_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_checks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    default_section_number character varying(255) NOT NULL,
    default_section_name character varying(255) NOT NULL,
    code_name character varying(255) NOT NULL,
    default_priority_group text NOT NULL,
    is_c_scrm boolean DEFAULT false NOT NULL,
    implementation_status text DEFAULT 'pending'::text NOT NULL,
    implementation_type text,
    implementation_details_reference text,
    details_url text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT compliance_checks_implementation_status_check CHECK ((implementation_status = ANY (ARRAY['pending'::text, 'completed'::text]))),
    CONSTRAINT compliance_checks_implementation_type_check CHECK ((implementation_type = ANY (ARRAY['manual'::text, 'computed'::text]))),
    CONSTRAINT compliance_checks_priority_group_check CHECK ((default_priority_group = ANY (ARRAY['P0'::text, 'P1'::text, 'P2'::text, 'P3'::text, 'P4'::text, 'P5'::text, 'P6'::text, 'P7'::text, 'P8'::text, 'P9'::text, 'P10'::text, 'P11'::text, 'P12'::text, 'P13'::text, 'P14'::text, 'R0'::text, 'R1'::text, 'R2'::text, 'R3'::text, 'R4'::text, 'R5'::text, 'R6'::text, 'R7'::text, 'R8'::text, 'R9'::text, 'R10'::text, 'R11'::text, 'R12'::text, 'R13'::text, 'R14'::text])))
);


--
-- Name: compliance_checks_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_checks_alerts (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    severity text NOT NULL,
    compliance_check_id integer NOT NULL,
    project_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT compliance_checks_alerts_severity_check CHECK ((severity = ANY (ARRAY['critical'::text, 'high'::text, 'medium'::text, 'low'::text, 'info'::text])))
);


--
-- Name: compliance_checks_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_checks_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_checks_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_checks_alerts_id_seq OWNED BY public.compliance_checks_alerts.id;


--
-- Name: compliance_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_checks_id_seq OWNED BY public.compliance_checks.id;


--
-- Name: compliance_checks_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_checks_resources (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    name character varying(255),
    description text,
    type text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT compliance_checks_resources_type_check CHECK ((type = ANY (ARRAY['mitre'::text, 'how_to'::text, 'sources'::text])))
);


--
-- Name: compliance_checks_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_checks_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_checks_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_checks_resources_id_seq OWNED BY public.compliance_checks_resources.id;


--
-- Name: compliance_checks_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_checks_results (
    id integer NOT NULL,
    severity text NOT NULL,
    status text NOT NULL,
    rationale text NOT NULL,
    compliance_check_id integer NOT NULL,
    project_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT compliance_checks_results_severity_check CHECK ((severity = ANY (ARRAY['critical'::text, 'high'::text, 'medium'::text, 'low'::text, 'info'::text]))),
    CONSTRAINT compliance_checks_results_status_check CHECK ((status = ANY (ARRAY['unknown'::text, 'passed'::text, 'failed'::text])))
);


--
-- Name: compliance_checks_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_checks_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_checks_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_checks_results_id_seq OWNED BY public.compliance_checks_results.id;


--
-- Name: compliance_checks_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_checks_tasks (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    severity text NOT NULL,
    compliance_check_id integer NOT NULL,
    project_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT compliance_checks_tasks_severity_check CHECK ((severity = ANY (ARRAY['critical'::text, 'high'::text, 'medium'::text, 'low'::text, 'info'::text])))
);


--
-- Name: compliance_checks_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_checks_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_checks_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_checks_tasks_id_seq OWNED BY public.compliance_checks_tasks.id;


--
-- Name: github_organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.github_organizations (
    id integer NOT NULL,
    login character varying(255) NOT NULL,
    github_org_id integer,
    node_id character varying(255),
    url character varying(255),
    avatar_url character varying(255),
    description text,
    name character varying(255),
    company character varying(255),
    blog character varying(255),
    location character varying(255),
    twitter_username character varying(255),
    is_verified boolean,
    has_organization_projects boolean,
    has_repository_projects boolean,
    public_repos integer,
    public_gists integer,
    followers integer,
    following integer,
    html_url character varying(255) NOT NULL,
    total_private_repos integer,
    owned_private_repos integer,
    private_gists integer,
    disk_usage integer,
    collaborators integer,
    default_repository_permission character varying(255),
    members_can_create_repositories boolean,
    two_factor_requirement_enabled boolean,
    members_allowed_repository_creation_type character varying(255),
    members_can_create_public_repositories boolean,
    members_can_create_private_repositories boolean,
    members_can_create_internal_repositories boolean,
    members_can_create_pages boolean,
    members_can_create_public_pages boolean,
    members_can_create_private_pages boolean,
    members_can_fork_private_repositories boolean,
    web_commit_signoff_required boolean,
    deploy_keys_enabled_for_repositories boolean,
    dependency_graph_enabled_for_new_repositories boolean,
    dependabot_alerts_enabled_for_new_repositories boolean,
    dependabot_security_updates_enabled_for_new_repositories boolean,
    advanced_security_enabled_for_new_repositories boolean,
    secret_scanning_enabled_for_new_repositories boolean,
    secret_scanning_push_protection_enabled_for_new_repositories boolean,
    secret_scanning_push_protection_custom_link character varying(255),
    secret_scanning_push_protection_custom_link_enabled boolean,
    github_created_at timestamp with time zone,
    github_updated_at timestamp with time zone,
    github_archived_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_id integer NOT NULL
);


--
-- Name: github_organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.github_organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: github_organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.github_organizations_id_seq OWNED BY public.github_organizations.id;


--
-- Name: github_repositories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.github_repositories (
    id integer NOT NULL,
    node_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    html_url character varying(255) NOT NULL,
    description text,
    fork boolean,
    url character varying(255) NOT NULL,
    git_url character varying(255) NOT NULL,
    ssh_url character varying(255) NOT NULL,
    clone_url character varying(255) NOT NULL,
    svn_url character varying(255),
    homepage character varying(255),
    size integer,
    stargazers_count integer,
    watchers_count integer,
    language character varying(255),
    has_issues boolean,
    has_projects boolean,
    has_downloads boolean,
    has_wiki boolean,
    has_pages boolean,
    has_discussions boolean,
    forks_count integer,
    mirror_url character varying(255),
    archived boolean,
    disabled boolean,
    open_issues_count integer,
    allow_forking boolean,
    is_template boolean,
    web_commit_signoff_required boolean,
    topics text[],
    visibility text NOT NULL,
    default_branch character varying(255) NOT NULL,
    allow_squash_merge boolean,
    allow_merge_commit boolean,
    allow_rebase_merge boolean,
    allow_auto_merge boolean,
    delete_branch_on_merge boolean,
    allow_update_branch boolean,
    use_squash_pr_title_as_default boolean,
    squash_merge_commit_message character varying(255),
    squash_merge_commit_title character varying(255),
    merge_commit_message character varying(255),
    merge_commit_title character varying(255),
    network_count integer,
    subscribers_count integer,
    github_repo_id integer,
    github_created_at timestamp with time zone,
    github_updated_at timestamp with time zone,
    github_archived_at timestamp with time zone,
    license_key character varying(255),
    license_name character varying(255),
    license_spdx_id character varying(255),
    license_url character varying(255),
    license_node_id character varying(255),
    secret_scanning_status text DEFAULT 'disabled'::text,
    secret_scanning_push_protection_status text DEFAULT 'disabled'::text,
    dependabot_security_updates_status text DEFAULT 'disabled'::text,
    secret_scanning_non_provider_patterns_status text DEFAULT 'disabled'::text,
    secret_scanning_validity_checks_status text DEFAULT 'disabled'::text,
    github_organization_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT github_repositories_dependabot_security_updates_status_check CHECK ((dependabot_security_updates_status = ANY (ARRAY['enabled'::text, 'disabled'::text]))),
    CONSTRAINT github_repositories_secret_scanning_non_provider_patterns_check CHECK ((secret_scanning_non_provider_patterns_status = ANY (ARRAY['enabled'::text, 'disabled'::text]))),
    CONSTRAINT github_repositories_secret_scanning_push_protection_statu_check CHECK ((secret_scanning_push_protection_status = ANY (ARRAY['enabled'::text, 'disabled'::text]))),
    CONSTRAINT github_repositories_secret_scanning_status_check CHECK ((secret_scanning_status = ANY (ARRAY['enabled'::text, 'disabled'::text]))),
    CONSTRAINT github_repositories_secret_scanning_validity_checks_statu_check CHECK ((secret_scanning_validity_checks_status = ANY (ARRAY['enabled'::text, 'disabled'::text]))),
    CONSTRAINT github_repositories_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'private'::text, 'internal'::text])))
);


--
-- Name: github_repositories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.github_repositories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: github_repositories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.github_repositories_id_seq OWNED BY public.github_repositories.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: ossf_scorecard_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ossf_scorecard_results (
    id integer NOT NULL,
    analysis_score real NOT NULL,
    analysis_time timestamp with time zone NOT NULL,
    analysis_execution_time character varying(255) NOT NULL,
    repo_commit character varying(255) NOT NULL,
    scorecard_version character varying(255) NOT NULL,
    scorecard_commit character varying(255) NOT NULL,
    binary_artifacts_reason character varying(255),
    binary_artifacts_score real,
    binary_artifacts_documentation_url character varying(255),
    binary_artifacts_documentation character varying(255),
    binary_artifacts_details text,
    branch_protection_reason character varying(255),
    branch_protection_score real,
    branch_protection_documentation_url character varying(255),
    branch_protection_documentation character varying(255),
    branch_protection_details text,
    ci_tests_reason character varying(255),
    ci_tests_score real,
    ci_tests_documentation_url character varying(255),
    ci_tests_documentation character varying(255),
    ci_tests_details text,
    cii_best_practices_reason character varying(255),
    cii_best_practices_score real,
    cii_best_practices_documentation_url character varying(255),
    cii_best_practices_documentation character varying(255),
    cii_best_practices_details text,
    code_review_reason character varying(255),
    code_review_score real,
    code_review_documentation_url character varying(255),
    code_review_documentation character varying(255),
    code_review_details text,
    contributors_reason character varying(255),
    contributors_score real,
    contributors_documentation_url character varying(255),
    contributors_documentation character varying(255),
    contributors_details text,
    dangerous_workflow_reason character varying(255),
    dangerous_workflow_score real,
    dangerous_workflow_documentation_url character varying(255),
    dangerous_workflow_documentation character varying(255),
    dangerous_workflow_details text,
    dependency_update_tool_reason character varying(255),
    dependency_update_tool_score real,
    dependency_update_tool_documentation_url character varying(255),
    dependency_update_tool_documentation character varying(255),
    dependency_update_tool_details text,
    fuzzing_reason character varying(255),
    fuzzing_score real,
    fuzzing_documentation_url character varying(255),
    fuzzing_documentation character varying(255),
    fuzzing_details text,
    license_reason character varying(255),
    license_score real,
    license_documentation_url character varying(255),
    license_documentation character varying(255),
    license_details text,
    maintained_reason character varying(255),
    maintained_score real,
    maintained_documentation_url character varying(255),
    maintained_documentation character varying(255),
    maintained_details text,
    packaging_reason character varying(255),
    packaging_score real,
    packaging_documentation_url character varying(255),
    packaging_documentation character varying(255),
    packaging_details text,
    pinned_dependencies_reason character varying(255),
    pinned_dependencies_score real,
    pinned_dependencies_documentation_url character varying(255),
    pinned_dependencies_documentation character varying(255),
    pinned_dependencies_details text,
    sast_reason character varying(255),
    sast_score real,
    sast_documentation_url character varying(255),
    sast_documentation character varying(255),
    sast_details text,
    security_policy_reason character varying(255),
    security_policy_score real,
    security_policy_documentation_url character varying(255),
    security_policy_documentation character varying(255),
    security_policy_details text,
    signed_releases_reason character varying(255),
    signed_releases_score real,
    signed_releases_documentation_url character varying(255),
    signed_releases_documentation character varying(255),
    signed_releases_details text,
    token_permissions_reason character varying(255),
    token_permissions_score real,
    token_permissions_documentation_url character varying(255),
    token_permissions_documentation character varying(255),
    token_permissions_details text,
    vulnerabilities_reason character varying(255),
    vulnerabilities_score real,
    vulnerabilities_documentation_url character varying(255),
    vulnerabilities_documentation character varying(255),
    vulnerabilities_details text,
    github_repository_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ossf_scorecard_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ossf_scorecard_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ossf_scorecard_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ossf_scorecard_results_id_seq OWNED BY public.ossf_scorecard_results.id;


--
-- Name: owasp_top10_training; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.owasp_top10_training (
    id integer NOT NULL,
    description text NOT NULL,
    implementation_status text DEFAULT 'pending'::text NOT NULL,
    training_date character varying(255) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_id integer NOT NULL,
    CONSTRAINT owasp_top10_training_implementation_status_check CHECK ((implementation_status = ANY (ARRAY['unknown'::text, 'pending'::text, 'completed'::text])))
);


--
-- Name: owasp_top10_training_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.owasp_top10_training_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: owasp_top10_training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.owasp_top10_training_id_seq OWNED BY public.owasp_top10_training.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "has_defineFunctionalRoles_policy" boolean,
    "has_orgToolingMFA_policy" boolean,
    "has_softwareArchitectureDocs_policy" boolean,
    "has_MFAImpersonationDefense_policy" boolean,
    "has_includeCVEInReleaseNotes_policy" boolean,
    "has_assignCVEForKnownVulns_policy" boolean,
    "has_incidentResponsePlan_policy" boolean,
    "has_regressionTestsForVulns_policy" boolean,
    "has_vulnResponse14Days_policy" boolean,
    "has_useCVDToolForVulns_policy" boolean,
    "has_securityMdMeetsOpenJSCVD_policy" boolean,
    "has_consistentBuildProcessDocs_policy" boolean,
    "has_machineReadableDependencies_policy" boolean,
    "has_identifyModifiedDependencies_policy" boolean,
    "has_ciAndCdPipelineAsCode_policy" boolean,
    "has_npmOrgMFA_policy" boolean,
    "has_npmPublicationMFA_policy" boolean,
    "has_upgradePathDocs_policy" boolean,
    "has_patchNonCriticalVulns90Days_policy" boolean,
    "has_patchCriticalVulns30Days_policy" boolean,
    "has_twoOrMoreOwnersForAccess_policy" boolean,
    "has_injectedSecretsAtRuntime_policy" boolean,
    "has_preventScriptInjection_policy" boolean,
    "has_resolveLinterWarnings_policy" boolean,
    "has_annualDependencyRefresh_policy" boolean
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: resources_for_compliance_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources_for_compliance_checks (
    id integer NOT NULL,
    compliance_check_id integer NOT NULL,
    compliance_check_resource_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: resources_for_compliance_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resources_for_compliance_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resources_for_compliance_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resources_for_compliance_checks_id_seq OWNED BY public.resources_for_compliance_checks.id;


--
-- Name: software_design_training; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.software_design_training (
    id integer NOT NULL,
    description text NOT NULL,
    implementation_status text DEFAULT 'pending'::text NOT NULL,
    training_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_id integer NOT NULL,
    CONSTRAINT software_design_training_implementation_status_check CHECK ((implementation_status = ANY (ARRAY['unknown'::text, 'pending'::text, 'completed'::text])))
);


--
-- Name: software_design_training_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.software_design_training_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: software_design_training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.software_design_training_id_seq OWNED BY public.software_design_training.id;


--
-- Name: checklist_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items ALTER COLUMN id SET DEFAULT nextval('public.checklist_items_id_seq'::regclass);


--
-- Name: compliance_checklists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checklists ALTER COLUMN id SET DEFAULT nextval('public.compliance_checklists_id_seq'::regclass);


--
-- Name: compliance_checks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks ALTER COLUMN id SET DEFAULT nextval('public.compliance_checks_id_seq'::regclass);


--
-- Name: compliance_checks_alerts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_alerts ALTER COLUMN id SET DEFAULT nextval('public.compliance_checks_alerts_id_seq'::regclass);


--
-- Name: compliance_checks_resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_resources ALTER COLUMN id SET DEFAULT nextval('public.compliance_checks_resources_id_seq'::regclass);


--
-- Name: compliance_checks_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_results ALTER COLUMN id SET DEFAULT nextval('public.compliance_checks_results_id_seq'::regclass);


--
-- Name: compliance_checks_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_tasks ALTER COLUMN id SET DEFAULT nextval('public.compliance_checks_tasks_id_seq'::regclass);


--
-- Name: github_organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_organizations ALTER COLUMN id SET DEFAULT nextval('public.github_organizations_id_seq'::regclass);


--
-- Name: github_repositories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_repositories ALTER COLUMN id SET DEFAULT nextval('public.github_repositories_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: ossf_scorecard_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ossf_scorecard_results ALTER COLUMN id SET DEFAULT nextval('public.ossf_scorecard_results_id_seq'::regclass);


--
-- Name: owasp_top10_training id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owasp_top10_training ALTER COLUMN id SET DEFAULT nextval('public.owasp_top10_training_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: resources_for_compliance_checks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources_for_compliance_checks ALTER COLUMN id SET DEFAULT nextval('public.resources_for_compliance_checks_id_seq'::regclass);


--
-- Name: software_design_training id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_design_training ALTER COLUMN id SET DEFAULT nextval('public.software_design_training_id_seq'::regclass);


--
-- Name: checklist_items checklist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_pkey PRIMARY KEY (id);


--
-- Name: compliance_checklists compliance_checklists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checklists
    ADD CONSTRAINT compliance_checklists_pkey PRIMARY KEY (id);


--
-- Name: compliance_checks_alerts compliance_checks_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_alerts
    ADD CONSTRAINT compliance_checks_alerts_pkey PRIMARY KEY (id);


--
-- Name: compliance_checks compliance_checks_code_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks
    ADD CONSTRAINT compliance_checks_code_name_unique UNIQUE (code_name);


--
-- Name: compliance_checks compliance_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks
    ADD CONSTRAINT compliance_checks_pkey PRIMARY KEY (id);


--
-- Name: compliance_checks_resources compliance_checks_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_resources
    ADD CONSTRAINT compliance_checks_resources_pkey PRIMARY KEY (id);


--
-- Name: compliance_checks_results compliance_checks_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_results
    ADD CONSTRAINT compliance_checks_results_pkey PRIMARY KEY (id);


--
-- Name: compliance_checks_tasks compliance_checks_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_tasks
    ADD CONSTRAINT compliance_checks_tasks_pkey PRIMARY KEY (id);


--
-- Name: github_organizations github_organizations_github_org_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_organizations
    ADD CONSTRAINT github_organizations_github_org_id_unique UNIQUE (github_org_id);


--
-- Name: github_organizations github_organizations_login_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_organizations
    ADD CONSTRAINT github_organizations_login_unique UNIQUE (login);


--
-- Name: github_organizations github_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_organizations
    ADD CONSTRAINT github_organizations_pkey PRIMARY KEY (id);


--
-- Name: github_repositories github_repositories_github_repo_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_repositories
    ADD CONSTRAINT github_repositories_github_repo_id_unique UNIQUE (github_repo_id);


--
-- Name: github_repositories github_repositories_node_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_repositories
    ADD CONSTRAINT github_repositories_node_id_unique UNIQUE (node_id);


--
-- Name: github_repositories github_repositories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_repositories
    ADD CONSTRAINT github_repositories_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: ossf_scorecard_results ossf_scorecard_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ossf_scorecard_results
    ADD CONSTRAINT ossf_scorecard_results_pkey PRIMARY KEY (id);


--
-- Name: owasp_top10_training owasp_top10_training_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owasp_top10_training
    ADD CONSTRAINT owasp_top10_training_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: resources_for_compliance_checks resources_for_compliance_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources_for_compliance_checks
    ADD CONSTRAINT resources_for_compliance_checks_pkey PRIMARY KEY (id);


--
-- Name: software_design_training software_design_training_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_design_training
    ADD CONSTRAINT software_design_training_pkey PRIMARY KEY (id);


--
-- Name: checklist_items set_updated_at_checklist_items; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_checklist_items BEFORE UPDATE ON public.checklist_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: compliance_checklists set_updated_at_compliance_checklists; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_compliance_checklists BEFORE UPDATE ON public.compliance_checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: compliance_checks set_updated_at_compliance_checks; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_compliance_checks BEFORE UPDATE ON public.compliance_checks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: compliance_checks_alerts set_updated_at_compliance_checks_alerts; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_compliance_checks_alerts BEFORE UPDATE ON public.compliance_checks_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: compliance_checks_resources set_updated_at_compliance_checks_resources; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_compliance_checks_resources BEFORE UPDATE ON public.compliance_checks_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: compliance_checks_results set_updated_at_compliance_checks_results; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_compliance_checks_results BEFORE UPDATE ON public.compliance_checks_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: compliance_checks_tasks set_updated_at_compliance_checks_tasks; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_compliance_checks_tasks BEFORE UPDATE ON public.compliance_checks_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: github_organizations set_updated_at_github_organizations; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_github_organizations BEFORE UPDATE ON public.github_organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: github_repositories set_updated_at_github_repositories; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_github_repositories BEFORE UPDATE ON public.github_repositories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ossf_scorecard_results set_updated_at_ossf_scorecard_results; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_ossf_scorecard_results BEFORE UPDATE ON public.ossf_scorecard_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: owasp_top10_training set_updated_at_owasp_top10_training; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_owasp_top10_training BEFORE UPDATE ON public.owasp_top10_training FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: projects set_updated_at_projects; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: software_design_training set_updated_at_software_design_training; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_software_design_training BEFORE UPDATE ON public.software_design_training FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: checklist_items checklist_items_checklist_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_checklist_id_foreign FOREIGN KEY (checklist_id) REFERENCES public.compliance_checklists(id) ON DELETE CASCADE;


--
-- Name: checklist_items checklist_items_compliance_check_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_compliance_check_id_foreign FOREIGN KEY (compliance_check_id) REFERENCES public.compliance_checks(id) ON DELETE CASCADE;


--
-- Name: compliance_checks_alerts compliance_checks_alerts_compliance_check_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_alerts
    ADD CONSTRAINT compliance_checks_alerts_compliance_check_id_foreign FOREIGN KEY (compliance_check_id) REFERENCES public.compliance_checks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compliance_checks_alerts compliance_checks_alerts_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_alerts
    ADD CONSTRAINT compliance_checks_alerts_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compliance_checks_results compliance_checks_results_compliance_check_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_results
    ADD CONSTRAINT compliance_checks_results_compliance_check_id_foreign FOREIGN KEY (compliance_check_id) REFERENCES public.compliance_checks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compliance_checks_results compliance_checks_results_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_results
    ADD CONSTRAINT compliance_checks_results_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compliance_checks_tasks compliance_checks_tasks_compliance_check_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_tasks
    ADD CONSTRAINT compliance_checks_tasks_compliance_check_id_foreign FOREIGN KEY (compliance_check_id) REFERENCES public.compliance_checks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compliance_checks_tasks compliance_checks_tasks_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks_tasks
    ADD CONSTRAINT compliance_checks_tasks_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: github_organizations github_organizations_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_organizations
    ADD CONSTRAINT github_organizations_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: github_repositories github_repositories_github_organization_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.github_repositories
    ADD CONSTRAINT github_repositories_github_organization_id_foreign FOREIGN KEY (github_organization_id) REFERENCES public.github_organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ossf_scorecard_results ossf_scorecard_results_github_repository_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ossf_scorecard_results
    ADD CONSTRAINT ossf_scorecard_results_github_repository_id_foreign FOREIGN KEY (github_repository_id) REFERENCES public.github_repositories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: owasp_top10_training owasp_top10_training_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.owasp_top10_training
    ADD CONSTRAINT owasp_top10_training_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resources_for_compliance_checks resources_for_compliance_checks_compliance_check_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources_for_compliance_checks
    ADD CONSTRAINT resources_for_compliance_checks_compliance_check_id_foreign FOREIGN KEY (compliance_check_id) REFERENCES public.compliance_checks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resources_for_compliance_checks resources_for_compliance_checks_compliance_check_resource_id_fo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources_for_compliance_checks
    ADD CONSTRAINT resources_for_compliance_checks_compliance_check_resource_id_fo FOREIGN KEY (compliance_check_resource_id) REFERENCES public.compliance_checks_resources(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: software_design_training software_design_training_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_design_training
    ADD CONSTRAINT software_design_training_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

