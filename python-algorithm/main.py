import warnings
warnings.filterwarnings('ignore')

from pdf_utils import convert_pdf_to_txt
import openpyxl

import pandas as pd
import numpy as np
from ast import literal_eval

from transformers import BigBirdModel, BigBirdConfig, BigBirdTokenizer

from src.controller import generator
from src.lib import extractor

import pprint

import nltk
from nltk.util import ngrams

import psycopg2
import json
from csv import writer

conn = psycopg2.connect(
    database="cuic", user='postgres', password='rammv@123', host='localhost', port='5432'
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

# give the path of dataset excel sheet
wb_obj = openpyxl.load_workbook("C:/Users/Ramanan/Downloads/july-rem.xlsx")

sheet = wb_obj.active

configuration = BigBirdConfig()
model = BigBirdModel(configuration)
tokenizer = BigBirdTokenizer.from_pretrained("google/bigbird-roberta-base")

model_dict = {"model": model, "tokenizer": tokenizer, "trained_vectors": None}

with open("./data/stopword.txt") as f:
    stopwords = literal_eval(f.read())

csv_header = ["faculty", "appgenid", "name", "tentative_title",	"dcmember1", "dcmember2", "dcmember3", "dcomember1", "dcomember2", "dcomember3",
              "dcdesignation1", "dcdesignation2", "dcdesignation3", "dcodesignation1", "dcodesignation2", "dcodesignation3", 
              "dcdept1", "dcdept2", "dcdept3", "dcodept1", "dcodept2", "dcodept3", "memcoll_1", "memcoll_2", "memcoll_3", "memuniv_4", "memuniv_5", 
              "memuniv_6", "dcspecial1", "dcspecial2", "dcspecial3", "dcospecial1", "dcospecial2", "dcospecial3",
              "dc1_score", "dc2_score", "dc3_score", "dco1_score", "dco2_score", "dco3_score", "dc_selected", "dco_selected"]
i = 0
# with open('July-dcmembers-result.csv', 'a') as result_file_object:
#     writer_object = writer(result_file_object)
#     writer_object.writerow(csv_header)
for row in sheet.iter_rows(values_only=True):

    # skip header row
    i += 1
    if i == 1:
        continue
    
    if i>2:
        break
    try:
        app_gen_id = str(row[1]).replace(".0", "")
        name = row[2]
        title = row[3]
        print(f"Processing application id: {app_gen_id}...")


        print("Extracting members information...")
        dc_members = []
        dco_members = []

        dc1 = row[4]
        dc1_designation = row[10]
        dc1_dept = row[16]
        dc1_college = row[22]
        dc1_special = row[28]

        dc2 = row[5]
        dc2_designation = row[11]
        dc2_dept = row[17]
        dc2_college = row[23]
        dc2_special = row[29]

        dc3 = row[6]
        dc3_designation = row[12]
        dc3_dept = row[18]
        dc3_college = row[24]
        dc3_special = row[30]

        dco1 = row[7]
        dco1_designation = row[13]
        dco1_dept = row[19]
        dco1_college = row[25]
        dco1_special = row[31]

        dco2 = row[8]
        dco2_designation = row[14]
        dco2_dept = row[20]
        dco2_college = row[26]
        dco2_special = row[32]

        dco3 = row[9]
        dco3_designation = row[15]
        dco3_dept = row[21]
        dco3_college = row[27]
        dco3_special = row[33]

        print("Extracting text from publications pdf document...")
        # doc_id, text
        doc_data = [
            ["d1", convert_pdf_to_txt(f"C:/Users/Ramanan/Downloads/dcmemberjul22-ice/dcmemberjul22-ice/{app_gen_id}_1.pdf")],
            ["d2", convert_pdf_to_txt(f"C:/Users/Ramanan/Downloads/dcmemberjul22-ice/dcmemberjul22-ice/{app_gen_id}_2.pdf")],
            ["d3", convert_pdf_to_txt(f"C:/Users/Ramanan/Downloads/dcmemberjul22-ice/dcmemberjul22-ice/{app_gen_id}_3.pdf")],
            ["d4", convert_pdf_to_txt(f"C:/Users/Ramanan/Downloads/dcmemberjul22-ice/dcmemberjul22-ice/{app_gen_id}_4.pdf")],
            ["d5", convert_pdf_to_txt(f"C:/Users/Ramanan/Downloads/dcmemberjul22-ice/dcmemberjul22-ice/{app_gen_id}_5.pdf")],
            ["d6", convert_pdf_to_txt(f"C:/Users/Ramanan/Downloads/dcmemberjul22-ice/dcmemberjul22-ice/{app_gen_id}_6.pdf")],
        ]
        doc_df = pd.DataFrame(doc_data, columns=["doc_id", "text"])

        ed_data = [
            ["d1", "e1", 1],
            ["d2", "e2", 1],
            ["d3", "e3", 1],
            ["d4", "e4", 1],
            ["d5", "e5", 1],
            ["d6", "e6", 1],
        ]

        # print("Computing expert score...")
        ed_df = pd.DataFrame(ed_data, columns=["doc_id", "exp_id", "weight"])
        ed_matrix = generator.generate_ed_matrix(ed_df)
        dp_matrix = dp_pipeline(doc_df, stopwords)
    

        # topics = [dc1_special, dc2_special, dc3_special, dco1_special, dco2_special, dco3_special]
        topics = extract_ngrams(title.lower(), 2) + extract_ngrams(title.lower(), 3)

        # Generate document-topic matrix
        dtopic_matrix, topic_phrase = generator.generate_dtop_matrix(dp_matrix, topics, 
                                                                    model_dict, top_n=1)
        
        print("phrase -> \n", topic_phrase)
        topic_vec = generator.generate_topic_vector(dtopic_matrix)
        dtopic_matrix = pd.DataFrame(dtopic_matrix['matrix'].todense(),
                                    index=dtopic_matrix['index'], 
                                    columns=dtopic_matrix['columns'])

    
        exp_pr_df, doc_pr_df, ed_graph = personalised_pipeline(ed_df, ed_matrix, dtopic_matrix, topic_vec)
        
        exp_pr_df['sum'] = exp_pr_df.sum(axis=1)

        dc1_score = exp_pr_df.loc[['e1']]['sum'].values[0] if exp_pr_df.loc[['e1']]['sum'].values[0] < 100 else 100
        dc2_score = exp_pr_df.loc[['e2']]['sum'].values[0] if exp_pr_df.loc[['e2']]['sum'].values[0] < 100 else 100
        dc3_score = exp_pr_df.loc[['e3']]['sum'].values[0] if exp_pr_df.loc[['e3']]['sum'].values[0] < 100 else 100
        dco1_score = exp_pr_df.loc[['e4']]['sum'].values[0] if exp_pr_df.loc[['e4']]['sum'].values[0] < 100 else 100
        dco2_score = exp_pr_df.loc[['e5']]['sum'].values[0] if exp_pr_df.loc[['e5']]['sum'].values[0] < 100 else 100
        dco3_score = exp_pr_df.loc[['e6']]['sum'].values[0] if exp_pr_df.loc[['e6']]['sum'].values[0] < 100 else 100

        dc_members.append({"name": str(dc1), "designation": str(dc1_designation), "department": str(dc1_dept), "specialization": str(dc1_special), "score": dc1_score, "member_id": 1})
        dc_members.append({"name": str(dc2), "designation": str(dc2_designation), "department": str(dc2_dept), "specialization": str(dc2_special), "score": dc2_score, "member_id": 2})
        dc_members.append({"name": str(dc3), "designation": str(dc3_designation), "department": str(dc3_dept), "specialization": str(dc3_special), "score": dc3_score, "member_id": 3})
        dco_members.append({"name": str(dco1), "designation": str(dco1_designation), "department": str(dco1_dept), "specialization": str(dco1_special), "score": dco1_score, "member_id": 4})
        dco_members.append({"name": str(dco2), "designation": str(dco2_designation), "department": str(dco2_dept), "specialization": str(dco2_special), "score": dco2_score, "member_id": 5})
        dco_members.append({"name": str(dco3), "designation": str(dco3_designation), "department": str(dco3_dept), "specialization": str(dco3_special), "score": dco3_score, "member_id": 6})

        dc_sorted = sorted(dc_members, key = lambda i: i['score'], reverse=True)
        dco_sorted = sorted(dco_members, key = lambda i: i['score'], reverse=True)

        for idx in range(3):
            dc_sorted[idx]['score'] = str(dc_sorted[idx]['score'])
            dc_sorted[idx]['score'] = str(dc_sorted[idx]['score'])
            dc_sorted[idx]['score'] = str(dc_sorted[idx]['score'])
            dco_sorted[idx]['score'] = str(dco_sorted[idx]['score'])
            dco_sorted[idx]['score'] = str(dco_sorted[idx]['score'])
            dco_sorted[idx]['score'] = str(dco_sorted[idx]['score'])

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

        # LIST = ["", app_gen_id, name, title, dc1, dc2, dc3, dco1, dco2, dco3, dc1_designation, dc2_designation, dc3_designation, dco1_designation, dco2_designation, dco3_designation, 
        #         dc1_dept, dc2_dept, dc3_dept, dco1_dept, dco2_dept, dco3_dept, dc1_college, dc2_college, dc3_college, dco1_college, dco2_college, dco3_college, 
        #         dc1_special, dc2_special, dc3_special, dco1_special, dco2_special, dco3_special, dc1_score, dc2_score, dc3_score, dco1_score, dco2_score, dco3_score,
        #         dc_sorted[0]['member_id'], dco_sorted[0]['member_id']]
        
        # writer_object.writerow(LIST)
        cur.execute(f"INSERT INTO membersdata (app_gen_id, name, title, dc_members, dco_members) \
                    VALUES ('{app_gen_id}', '{name}', '{title}', \
                        '{json.dumps(dc_sorted)}', '{json.dumps(dco_sorted)}')")
        
        print("count ->", i, ", generated ->", app_gen_id)
        # conn.commit()
    except Exception as e:
        print(e)

    # print("#############################################################################################################################################")
#result_file_object.close()

conn.commit()
conn.close()


