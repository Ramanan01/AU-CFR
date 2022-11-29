import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowExpertDetail from "./ShowExpertDetail";
import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableRow,
    CRow,
    CCol,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:9000/";

const SelectExpert = () => {

    const [expertData, setExpertData] = useState(null);
    const [globalOffset, setGlobalOffset] = useState("0");
    const [currentPdf, setCurrentPdf] = useState("")
    const [modalVisible, setModleVisible] = useState(false);
    const sectionColor = ["success", "", "danger"];
    const [selectedArticle, setSelectedArticle] = useState(-1)
    const [expertSelected, setExpertSelected] = useState("");
    const [selectedExpertMemberID, setselectedExpertMemberID] = useState("");

    const GetExpertData = (offset) => {
        if (offset === undefined) {
            offset = "0";
        }
        setGlobalOffset(offset);
        axios.get(API_URL + "api/expert/next?offset=" + offset)
            .then(response => {
                console.log(response.data);
                setExpertData(response.data);
            });
    };

    const UpdateSelectExpert = (app_gen_id, expert_id) => {
        axios.put(API_URL + "api/expert/select", { app_gen_id, expert_id })
            .then(response => {
                if (response?.data?.response?.status === 200) {
                    toast.success("Expert Selected");
                } else {
                    toast.info("Something went wrong");
                }
                GetExpertData(globalOffset);
            }).catch(e => {
                toast.warning("Something went wrong");
            })
    };

    useEffect(() => {
        GetExpertData();
    }, []);


    const openExpertResearchWork = (pdfName, selectedArticle, selectedExpertMemberID) => {
        const pdfPath = `/pubs/${pdfName}`
        setSelectedArticle(selectedArticle)
        setCurrentPdf(pdfPath)
        setselectedExpertMemberID(selectedExpertMemberID)
    }

    const memberNameClicked = (member_name) => {
        setModleVisible(true);
        setExpertSelected(member_name);
    }

    const classes = {
        main: {
            border: "2px solid grey",
            cursor: "pointer"
        }
    }

    return (
        <div style={{ marginLeft: 10, marginTop: 10, padding: 0 }}>
            <ToastContainer />
            {expertData ? (
                <div>
                    <CRow>
                        <CCol xs={4} style={{wordBreak: "break-word" }}>
                            <b>Title:</b>{" "} <b>{expertData?.expert?.title}</b>
                            <CTable style={{ marginBottom: 0, borderSpacing: "0 !important" }}>
                                <CTableBody>
                                    {expertData?.expert?.dc_members.map((dc_member, idx) => (
                                        <CTableRow key={idx} style={selectedArticle === idx ? classes.main : { cursor: "pointer" }} color={sectionColor[idx]} onClick={() => openExpertResearchWork(`${expertData?.expert?.app_gen_id}_${parseInt(dc_member?.member_id)}.pdf`, idx, parseInt(dc_member?.member_id))}>
                                            {console.log("id->", expertData?.expert?.app_gen_id, dc_member)}
                                            <CTableDataCell scope="row">
                                                <a href="##" onClick={() => memberNameClicked("Google Scholar " + dc_member?.name + " " + dc_member?.designation)}><b>{dc_member?.name}</b></a><br />
                                                {dc_member?.designation}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <b>Des:</b>{" "}{dc_member?.specialization}<br />
                                                <b>Score:</b>{" "}{(dc_member?.score)?.substring(0, 5)}
                                            </CTableDataCell>
                                            {expertData?.expert?.selected_expert === (idx + 1).toString() ? (<img title="Select Expert" src="/check.png" alt="select" width={30} height={30} />) : (<p></p>)}
                                        </CTableRow>
                                    ))}
                                    {expertData?.expert?.dco_members.map((dco_member, idx) => (
                                        <CTableRow key={idx} style={selectedArticle === idx + 3 ? classes.main : { cursor: "pointer" }} color={sectionColor[idx]} onClick={() => openExpertResearchWork(`${expertData?.expert?.app_gen_id}_${parseInt(dco_member?.member_id)}.pdf`, idx + 3, parseInt(dco_member?.member_id))}>
                                            <CTableDataCell scope="row">
                                                <a href="##" onClick={() => memberNameClicked("Google Scholar " + dco_member?.name + " " + dco_member?.designation)}><b>{dco_member?.name}</b></a><br />
                                                {dco_member?.designation}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <b>Des:</b>{" "}{dco_member?.specialization}<br />
                                                <b>Score:</b>{" "}{(dco_member?.score)?.substring(0, 5)}
                                            </CTableDataCell>
                                            {expertData?.expert?.selected_expert === (idx + 4).toString() ? (<img title="Select Expert" src="/check.png" alt="select" width={30} height={30} />) : (<p></p>)}
                                        </CTableRow>
                                    ))}

                                    <CTableRow>
                                        <CTableDataCell style={{ cursor: "pointer" }} onClick={() => {
                                            if (parseInt(globalOffset, 10) > 0) {
                                                const prevOffset = parseInt(globalOffset, 10) - 1;
                                                setGlobalOffset(prevOffset.toString());
                                                GetExpertData(prevOffset);
                                            }
                                        }
                                        }>
                                            <img src="/previous.png" alt="prev" width={30} height={30} />{" "}
                                            <b>Prev</b>
                                        </CTableDataCell>
                                        <CTableDataCell style={{ cursor: "pointer", float: "right" }} onClick={() => {
                                            const prevOffset = parseInt(globalOffset, 10) + 1;
                                            setGlobalOffset(prevOffset.toString());
                                            GetExpertData(prevOffset);
                                        }
                                        }>
                                            <b>Next</b>{" "}
                                            <img src="/next.png" alt="next" width={30} height={30} />
                                        </CTableDataCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                            <button style={{ width: "100%", margin: 0, backgroundColor: "#0B7E88", color: "white", borderRadius: "5px" }} onClick={() => UpdateSelectExpert(expertData?.expert?.app_gen_id, selectedExpertMemberID)}>Select Expert</button>
                        </CCol>
                        <CCol xs={8}>
                            {currentPdf ?
                                // eslint-disable-next-line jsx-a11y/alt-text
                                <object
                                    data={currentPdf}
                                    type="application/pdf"
                                    style={{ width: "98%", height: "85vh" }}
                                ></object> 
                                : <div> helloo </div> }
                        </CCol>
                    </CRow>
                </div>
            ) : (
                <header className="jumbotron" style={{ width: "98vw", overflow: "hidden" }}>
                    <h3>No record Found</h3>
                </header>
            )}
            <ShowExpertDetail setModleVisible={setModleVisible} modalVisible={modalVisible} expertSelected={expertSelected} />
        </div>
    );
};

export default SelectExpert;

/*
{
    "expert": {
        "id": 1,
        "app_gen_id": "50044",
        "name": "A.Harini",
        "title": "STUDIES ON REBAR CORROSION IN FOOTINGS",
        "dc_members": [
            {
                "name": "K.Sudalaimani",
                "designation": "Professor",
                "department": "Civil Engineering",
                "specialization": "Structural Engineering",
                "score": "28.083609"
            },
            {
                "name": "K.C.Pazhani",
                "designation": "Professor",
                "department": "Department of Civil Engineering",
                "specialization": "Structural Engineering",
                "score": "13.03352"
            },
            {
                "name": "M.Arun",
                "designation": "Associate Professor",
                "department": "Civil Engineering",
                "specialization": "Structural Engineering",
                "score": "12.250338"
            }
        ],
        "dco_members": [
            {
                "name": "K.Baskar",
                "designation": "Professor",
                "department": "Civil Engineering",
                "specialization": "Structural Engineering",
                "score": "100"
            },
            {
                "name": "J.Prabakar",
                "designation": "Senior Principal Scientist",
                "department": "Advanced Concrete Testing and Evaluation Laboratory",
                "specialization": "Concrete Structures, Durability of Structures and Non-Destructive Evaluation",
                "score": "16.399612"
            },
            {
                "name": "G.Ramakrishna",
                "designation": "Professor",
                "department": "Civil Engineering",
                "specialization": "Structures-FRC Composites",
                "score": "4.047381"
            }
        ]
    },
    "response": {
        "status": 200,
        "message": {
            "message": "Successful",
            "error": ""
        }
    }
}
*/

