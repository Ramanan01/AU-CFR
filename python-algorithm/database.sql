
CREATE DATABASE dcmemberselection;

CREATE TABLE 
    members(
        app_gen_id VARCHAR,
        name VARCHAR,
        title VARCHAR,
        dc_members VARCHAR,
        dco_members VARCHAR
    );

CREATE TABLE
    experts(
        expert_id SERIAL,
        expert_name VARCHAR,
        expert_designation VARCHAR,
        expert_department VARCHAR,
        expert_specialization VARCHAR,
        expert_address VARCHAR,
        expert_publication_text VARCHAR
    );