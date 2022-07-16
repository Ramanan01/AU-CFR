import generator

from utility import extractor


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
