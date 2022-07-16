import warnings
warnings.filterwarnings('ignore')

from pdf_utils import convert_pdf_to_txt
import openpyxl

import pandas as pd
import numpy as np
from ast import literal_eval
import re
from transformers import BigBirdModel, BigBirdConfig, BigBirdTokenizer

from src.controller import generator
from src.lib import extractor

import pprint

import nltk
from nltk.util import ngrams
import psycopg2
import json

conn = psycopg2.connect(
    database="dcmemberselection", user='postgres', password='root', host='localhost', port='5432'
)
cur = conn.cursor()

def extract_ngrams(data, num):
    n_grams = ngrams(nltk.word_tokenize(data), num)
    return [ ' '.join(grams) for grams in n_grams]


def dp_pipeline(doc_df, stopwords):
    """This function contains the pipeline for generating the
    document-phrase matrix"""
    # Construct corpus (of tokens and noun phrases)
    corpus = doc_df["text"].values
    X_train = extractor.tokenise_doc(corpus, stopwords, max_phrase_len=3)

    # Generate TF for terms and noun phrases
    tf_terms = generator.generate_tf(X_train["tokens"])
    tf_phrases = generator.generate_tf(X_train["np"])

    # Generate document-phrase matrix
    dp_matrix = generator.generate_dp_matrix(
        tf_terms, tf_phrases, doc_df["doc_id"], method="indirect"
    )

    return pd.DataFrame(
        dp_matrix["matrix"].todense(),
        index=dp_matrix["index"],
        columns=dp_matrix["columns"],
    )

def personalised_pipeline(ed_df, ed_matrix, dtopic_matrix, topic_vec):
    # Generate expoert-document graph
    G = generator.generate_ecg(ed_df)
    
    # Generate personalised matrices 
    etop_matrix, dtop_matrix = generator.generate_pr_matrix(ed_matrix, 
                                                            dtopic_matrix, 
                                                            topic_vec['weights'].values, 
                                                            G, alpha=0.0)
    
    # Construct DataFrame
    etop_matrix = pd.DataFrame(etop_matrix['matrix'].todense(),
                               index=etop_matrix['index'],
                               columns=etop_matrix['columns'])
    dtop_matrix = pd.DataFrame(dtop_matrix['matrix'].todense(),
                               index=dtop_matrix['index'],
                               columns=dtop_matrix['columns'])
    
    return etop_matrix, dtop_matrix, G

wb_obj = openpyxl.load_workbook("./dataset/members-full.xlsx")

sheet = wb_obj.active

# configuration = BigBirdConfig()
# model = BigBirdModel(configuration)
# tokenizer = BigBirdTokenizer.from_pretrained("google/bigbird-roberta-base")

# model_dict = {"model": model, "tokenizer": tokenizer, "trained_vectors": None}

with open("./data/stopword.txt") as f:
    stopwords = literal_eval(f.read())

i = 0
for row in sheet.iter_rows(values_only=True):

    # skip header row
    i += 1
    if i == 1:
        continue
    
    try:
        app_gen_id = str(row[1]).replace(".0", "")
        name = row[2]
        title = row[3]
        # print(f"Processing application id: {app_gen_id}...")


        # print("Extracting members information...")
        dc_members = []
        dco_members = []

        dc1 = row[4]
        dc1_designation = row[10]
        dc1_dept = row[16]
        dc1_address = row[22]
        dc1_special = row[28]

        dc2 = row[5]
        dc2_designation = row[11]
        dc2_dept = row[17]
        dc2_address = row[23]
        dc2_special = row[29]

        dc3 = row[6]
        dc3_designation = row[12]
        dc3_dept = row[18]
        dc3_address = row[24]
        dc3_special = row[30]

        dco1 = row[7]
        dco1_designation = row[13]
        dco1_dept = row[19]
        dco1_address = row[25]
        dco1_special = row[31]

        dco2 = row[8]
        dco2_designation = row[14]
        dco2_dept = row[20]
        dco2_address = row[26]
        dco2_special = row[32]

        dco3 = row[9]
        dco3_designation = row[15]
        dco3_dept = row[21]
        dco3_address = row[27]
        dco3_special = row[33]

        # print("Extracting text from publications pdf document...")
        # doc_id, text
        pdf_txt1 = re.sub(r"[^a-zA-Z0-9]"," ",convert_pdf_to_txt(f"./pubs/{app_gen_id}_1.pdf"))
        pdf_txt2 = re.sub(r"[^a-zA-Z0-9]"," ",convert_pdf_to_txt(f"./pubs/{app_gen_id}_2.pdf"))
        pdf_txt3 = re.sub(r"[^a-zA-Z0-9]"," ",convert_pdf_to_txt(f"./pubs/{app_gen_id}_3.pdf"))
        pdf_txt4 = re.sub(r"[^a-zA-Z0-9]"," ",convert_pdf_to_txt(f"./pubs/{app_gen_id}_4.pdf"))
        pdf_txt5 = re.sub(r"[^a-zA-Z0-9]"," ",convert_pdf_to_txt(f"./pubs/{app_gen_id}_5.pdf"))
        pdf_txt6 = re.sub(r"[^a-zA-Z0-9]"," ",convert_pdf_to_txt(f"./pubs/{app_gen_id}_6.pdf"))
            
        # doc_data = [
        #     ["d1", pdf_txt1],
        #     ["d2", pdf_txt2],
        #     ["d3", pdf_txt3],
        #     ["d4", pdf_txt4],
        #     ["d5", pdf_txt5],
        #     ["d6", pdf_txt6],
        # ]
        # doc_df = pd.DataFrame(doc_data, columns=["doc_id", "text"])

        # ed_data = [
        #     ["d1", "e1", 1],
        #     ["d2", "e2", 1],
        #     ["d3", "e3", 1],
        #     ["d4", "e4", 1],
        #     ["d5", "e5", 1],
        #     ["d6", "e6", 1],
        # ]

        # print("Computing expert score...")
        # ed_df = pd.DataFrame(ed_data, columns=["doc_id", "exp_id", "weight"])
        # ed_matrix = generator.generate_ed_matrix(ed_df)
        # dp_matrix = dp_pipeline(doc_df, stopwords)

        # topics = [dc1_special, dc2_special, dc3_special, dco1_special, dco2_special, dco3_special]
        # topics = extract_ngrams(title.lower(), 2) + extract_ngrams(title.lower(), 3)

        # Generate document-topic matrix
        # dtopic_matrix, topic_phrase = generator.generate_dtop_matrix(dp_matrix, topics, 
        #                                                             model_dict, top_n=1)
        # topic_vec = generator.generate_topic_vector(dtopic_matrix)
        # dtopic_matrix = pd.DataFrame(dtopic_matrix['matrix'].todense(),
        #                             index=dtopic_matrix['index'], 
        #                             columns=dtopic_matrix['columns'])

        # print(f"Topic Phrase: {topic_phrase}")
    
        # exp_pr_df, doc_pr_df, ed_graph = personalised_pipeline(ed_df, ed_matrix, dtopic_matrix, topic_vec)
        # exp_pr_df['sum'] = exp_pr_df.sum(axis=1)

        # dc1_score = exp_pr_df.loc[['e1']]['sum'].values[0] if exp_pr_df.loc[['e1']]['sum'].values[0] < 100 else 100
        # dc2_score = exp_pr_df.loc[['e2']]['sum'].values[0] if exp_pr_df.loc[['e2']]['sum'].values[0] < 100 else 100
        # dc3_score = exp_pr_df.loc[['e3']]['sum'].values[0] if exp_pr_df.loc[['e3']]['sum'].values[0] < 100 else 100
        # dco1_score = exp_pr_df.loc[['e4']]['sum'].values[0] if exp_pr_df.loc[['e4']]['sum'].values[0] < 100 else 100
        # dco2_score = exp_pr_df.loc[['e5']]['sum'].values[0] if exp_pr_df.loc[['e5']]['sum'].values[0] < 100 else 100
        # dco3_score = exp_pr_df.loc[['e6']]['sum'].values[0] if exp_pr_df.loc[['e6']]['sum'].values[0] < 100 else 100

        # dc_members.append({"name": str(dc1), "designation": str(dc1_designation), "department": str(dc1_dept), "specialization": str(dc1_special), "score": dc1_score, "member_id": 1})
        # dc_members.append({"name": str(dc2), "designation": str(dc2_designation), "department": str(dc2_dept), "specialization": str(dc2_special), "score": dc2_score, "member_id": 2})
        # dc_members.append({"name": str(dc3), "designation": str(dc3_designation), "department": str(dc3_dept), "specialization": str(dc3_special), "score": dc3_score, "member_id": 3})
        # dco_members.append({"name": str(dco1), "designation": str(dco1_designation), "department": str(dco1_dept), "specialization": str(dco1_special), "score": dco1_score, "member_id": 4})
        # dco_members.append({"name": str(dco2), "designation": str(dco2_designation), "department": str(dco2_dept), "specialization": str(dco2_special), "score": dco2_score, "member_id": 5})
        # dco_members.append({"name": str(dco3), "designation": str(dco3_designation), "department": str(dco3_dept), "specialization": str(dco3_special), "score": dco3_score, "member_id": 6})

        # dc_sorted = sorted(dc_members, key = lambda i: i['score'], reverse=True)
        # dco_sorted = sorted(dco_members, key = lambda i: i['score'], reverse=True)

        # for idx in range(3):
        #     dc_sorted[idx]['score'] = str(dc_sorted[idx]['score'])
        #     dc_sorted[idx]['score'] = str(dc_sorted[idx]['score'])
        #     dc_sorted[idx]['score'] = str(dc_sorted[idx]['score'])
        #     dco_sorted[idx]['score'] = str(dco_sorted[idx]['score'])
        #     dco_sorted[idx]['score'] = str(dco_sorted[idx]['score'])
        #     dco_sorted[idx]['score'] = str(dco_sorted[idx]['score'])

        # print("DC Members List")
        # print("-------------------------")
        # pprint.pprint(dc_sorted)
        # print("DCO Members List")
        # print("-------------------------")
        # pprint.pprint(dco_sorted)

        # print("Recommended Members:")
        # print("--------------------------")
        # print(f"DC Member -> name: {dc_sorted[0]['name']}, designation: {dc_sorted[0]['designation']}, department: {dc_sorted[0]['department']}, specialization: {dc_sorted[0]['specialization']}")
        # print(f"DCO Member -> name: {dco_sorted[0]['name']}, designation: {dco_sorted[0]['designation']}, department: {dco_sorted[0]['department']}, specialization: {dco_sorted[0]['specialization']}")

        # cur.execute(f"INSERT INTO membersdata (app_gen_id, name, title, dc_members, dco_members) \
        #             VALUES ('{app_gen_id}', '{name}', '{title}', \
        #                 '{json.dumps(dc_sorted)}', '{json.dumps(dco_sorted)}')")
        
        # print("count ->", i, ", generated ->", app_gen_id)
        # conn.commit()
        
        cur.execute(f"INSERT INTO experts (expert_name, expert_designation, expert_department, \
                        expert_specialization, expert_address, expert_publication_text) \
                        VALUES ('{dc1}', '{dc1_designation}', '{dc1_dept}', '{dc1_special}', '{dc1_address}', \
                            '{pdf_txt1}')")
        cur.execute(f"INSERT INTO experts (expert_name, expert_designation, expert_department, \
                        expert_specialization, expert_address, expert_publication_text) \
                        VALUES ('{dc2}', '{dc2_designation}', '{dc2_dept}', '{dc2_special}', '{dc2_address}', \
                            '{pdf_txt2}')")
        cur.execute(f"INSERT INTO experts (expert_name, expert_designation, expert_department, \
                        expert_specialization, expert_address, expert_publication_text) \
                        VALUES ('{dc3}', '{dc3_designation}', '{dc3_dept}', '{dc3_special}', '{dc3_address}', \
                            '{pdf_txt3}')")
        cur.execute(f"INSERT INTO experts (expert_name, expert_designation, expert_department, \
                        expert_specialization, expert_address, expert_publication_text) \
                        VALUES ('{dco1}', '{dco1_designation}', '{dco1_dept}', '{dco1_special}', '{dco1_address}', \
                            '{pdf_txt4}')")
        cur.execute(f"INSERT INTO experts (expert_name, expert_designation, expert_department, \
                        expert_specialization, expert_address, expert_publication_text) \
                        VALUES ('{dco2}', '{dco2_designation}', '{dco2_dept}', '{dco2_special}', '{dco2_address}', \
                            '{pdf_txt5}')")
        cur.execute(f"INSERT INTO experts (expert_name, expert_designation, expert_department, \
                        expert_specialization, expert_address, expert_publication_text) \
                        VALUES ('{dco3}', '{dco3_designation}', '{dco3_dept}', '{dco3_special}', '{dco3_address}', \
                            '{pdf_txt6}')")
        conn.commit()
        print("added ", i, "\n")
    except Exception as e:
        print(e)

    # print("#############################################################################################################################################")
    

# conn.commit()
conn.close()


