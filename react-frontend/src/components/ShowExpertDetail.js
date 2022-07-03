import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';

export default function ShowExpertDetail({ modalVisible, setModleVisible, expertSelected }) {

    return (
        <CModal size="xl" visible={modalVisible} onClose={() => setModleVisible(false)}>
            <CModalHeader closeButton>
                <CModalTitle>{ }</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <iframe title='Google Search' src={"https://google.com/search?igu=1&q=" + expertSelected} style={{ width: "100%", height: "80vh" }}></iframe>

            </CModalBody>
        </CModal>
    );
}
