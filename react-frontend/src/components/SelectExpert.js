import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowExpertDetail from "./ShowExpertDetail";
import Test from "./Test"

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

const API_URL = "http://localhost:8080/";

const SelectExpert = () => {

    const [expertData, setExpertData] = useState(null);
    const [globalOffset, setGlobalOffset] = useState("0");
    const [currentPdf, setCurrentPdf] = useState("")
    const [modalVisible, setModleVisible] = useState(false);
    const sectionColor = ["success", "", "danger"];
    const [selectedArticle1, setSelectedArticle1] = useState(-1)
    const [selectedArticle2, setSelectedArticle2] = useState(-1)
    const [expertSelected, setExpertSelected] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [selectedExpertMemberID1, setselectedExpertMemberID1] = useState(-1);
    const [selectedExpertMemberID2, setselectedExpertMemberID2] = useState(-1);

    const GetExpertData = (offset) => {
        if (offset === undefined) {
            offset = "0";
        }
        setGlobalOffset(offset);
        axios.get(API_URL + "getexpert?offset=" + offset,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:8081'
                }
            })
            .then(response => {
                console.log(response.data);
                setExpertData(response.data);
            });
    };

    const UpdateSelectExpert = (app_gen_id, expert_id1, expert_id2) => {
        if (expert_id1 !== -1 && expert_id2 !== -1)
            axios.put(API_URL + "updateexpert", { app_gen_id, expert_id1, expert_id2 })
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
        else
            toast.error("Please select experts")
    };

    const binaryToPDF = (binary) => {
        setPdfFile("data:application/pdf;base64," + binary)
        console.log(pdfFile)
    }

    const getFile = (pdfName) => {
        axios.post(API_URL + "getfile", { pdfName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:8081'
                },
                responseType: "arraybuffer"
            })
            .then(response => {
                console.log(response.data)
                let blob = new Blob([response.data], { type: "application/pdf" })
                console.log(blob)
                const reader = new FileReader();
                reader.onload = () => {
                    console.log("Setting pdf file path")
                    setPdfFile(reader.result)
                    setCurrentPdf(reader.result)
                };
                reader.readAsDataURL(blob)
                console.log(pdfFile)
                //binaryToPDF(response.data)
            });
    }

    useEffect(() => {
        console.log("calling inside use effect")
        console.log(pdfFile)
    }, [currentPdf])

    useEffect(() => {
        GetExpertData();
    }, []);


    const openExpertResearchWork = (pdfName, selectedArticle1, selectedArticle2, selMemberID1, selMemberID2) => {
        const pdfPath = `/pubs/${pdfName}`
        setSelectedArticle1(selectedArticle1)
        setSelectedArticle2(selectedArticle2)
        //setCurrentPdf(pdfPath)
        setselectedExpertMemberID1(selMemberID1)
        setselectedExpertMemberID2(selMemberID2)
        getFile(pdfName);
    }

    const memberNameClicked = (member_name) => {
        setModleVisible(true);
        setExpertSelected(member_name);
    }

    const classes = {
        main: {
            border: "2px solid #777",
            opacity: '85%',
            cursor: "pointer"
        }
    }

    return (
        <div style={{ marginLeft: 10, marginTop: 10, padding: 0 }}>
            <ToastContainer />
            {expertData ? (
                <div>
                    <CRow>
                        <CCol xs={4} style={{ wordBreak: "break-word" }}>
                            
                            <b>Name:</b>{" "} <text>{expertData?.expert?.name}</text>
                            <br />
                            <b>Title</b>{" "} <text style={{ textTransform: 'capitalize' }}>{expertData?.expert?.title.toLowerCase()}</text>
                            <CTable style={{ marginBottom: 0, borderSpacing: "0 !important" }}>
                                <CTableBody>
                                    <h6 style={{ marginTop: "20px" }}>DC Members</h6>
                                    {expertData?.expert?.dc_members.map((dc_member, idx) => (
                                        <CTableRow key={idx} color={sectionColor[idx]} style={selectedArticle1 === idx ? classes.main : { cursor: "pointer" }} onClick={() => openExpertResearchWork(`${expertData?.expert?.app_gen_id}_${parseInt(dc_member?.member_id)}.pdf`, idx, selectedArticle2, parseInt(dc_member?.member_id), selectedExpertMemberID2)}>
                                            {/* {console.log(selectedExpertMemberID1, selectedExpertMemberID2)} */}
                                            <CTableDataCell scope="row" style={{ width: '35%' }}>
                                                <a href="##" onClick={() => memberNameClicked("Google Scholar " + dc_member?.name + " " + dc_member?.designation)}><b>{dc_member?.name}</b></a><br />
                                                {dc_member?.designation}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <b>Des:</b>{" "}{dc_member?.specialization}<br />
                                                <b>Score:</b>{" "}{(dc_member?.score)?.substring(0, 5)}<br/>
                                                <b>College</b>{" "}{dc_member?.college}
                                            </CTableDataCell>
                                            {expertData?.expert?.selected_expert === (idx + 1).toString() ? (<img title="Select Expert" src="/check.png" alt="select" width={30} height={30} />) : (<p></p>)}
                                        </CTableRow>
                                    ))}
                                    <h6 style={{ marginTop: "20px" }}>DCO Members</h6>
                                    {expertData?.expert?.dco_members.map((dco_member, idx) => (
                                        <CTableRow key={idx} style={selectedArticle2 === idx + 3 ? classes.main : { cursor: "pointer" }} color={sectionColor[idx]} onClick={() => openExpertResearchWork(`${expertData?.expert?.app_gen_id}_${parseInt(dco_member?.member_id)}.pdf`, selectedArticle1, idx + 3, selectedExpertMemberID1, parseInt(dco_member?.member_id))}>
                                            {/* {console.log(selectedExpertMemberID1, selectedExpertMemberID2)} */}
                                            <CTableDataCell scope="row" style={{ width: '35%' }}>
                                                <a href="##" onClick={() => memberNameClicked("Google Scholar " + dco_member?.name + " " + dco_member?.designation)}><b>{dco_member?.name}</b></a><br />
                                                {dco_member?.designation}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <b>Des:</b>{" "}{dco_member?.specialization}<br />
                                                <b>Score:</b>{" "}{(dco_member?.score)?.substring(0, 5)}<br />
                                                <b>College</b>{" "}{dco_member?.college}
                                            </CTableDataCell>
                                            {expertData?.expert?.selected_expert === (idx + 4).toString() ? (<img title="Select Expert" src="/check.png" alt="select" width={30} height={30} />) : (<p></p>)}
                                        </CTableRow>
                                    ))}
                                    <br />
                                    <CTableRow>
                                        <CTableDataCell style={{ cursor: "pointer", border: 0 }} onClick={() => {
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
                                        <CTableDataCell style={{ cursor: "pointer", float: "right", border: 0 }} onClick={() => {
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
                            <button style={{ width: "100%", margin: 0, backgroundColor: "#0B7E88", color: "white", borderRadius: "5px" }} onClick={() => UpdateSelectExpert(expertData?.expert?.app_gen_id, selectedExpertMemberID1, selectedExpertMemberID2)}>Select Experts</button>
                        </CCol>
                        <CCol xs={8}>
                            {currentPdf &&
                                // eslint-disable-next-line jsx-a11y/alt-text
                                <object
                                    data={currentPdf}
                                    type="application/pdf"
                                    style={{ width: "98%", height: "95%", borderBottom: "1px solid black" }}
                                ></object>}
                        </CCol>
                        {/* <CCol>
                            { <embed
                                src={pdfFile}
                                id="displayFile"
                                alt="your image"
                                width="100%"
                                height="99%"
                                style={{ borderStyle: "solid" }}
                                type="application/pdf"
                            /> 
                            }
                        </CCol> */}
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

