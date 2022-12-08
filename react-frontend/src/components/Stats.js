import React, {useEffect, useState} from 'react';
import axios from "axios";

import { CRow, CWidgetStatsB, CCol } from '@coreui/react';
const API_URL = "http://localhost:5000/";

const ShowStats = () => {

    const [stats, setStats] = useState(null);
    const GetStats = () => {
        axios.get(API_URL + "api/expert/stats")
            .then(response => {
                console.log(response.data?.result);
                setStats(response.data?.result);
            });
    };

    useEffect(() => {
        GetStats();
    }, []);

    return (
        <div style={{ marginLeft: 50, marginRight: 50}}>
        {stats ? (
        <CRow>
            <CCol xs={6}>
                <CWidgetStatsB
                className="mb-3"
                progress={{ color: 'success', value: (stats?.selected / stats?.total).toFixed(2) }}
                text={"Total Experts " + stats?.total}
                title="Selected Experts"
                value={(stats?.selected / stats?.total).toFixed(2) + " %"}
                />
            </CCol>
            <CCol xs={6}>
                <CWidgetStatsB
                className="mb-3"
                progress={{ color: 'danger', value:(100 - (stats?.selected / stats?.total)).toFixed(2) }}
                text={"Total Experts " + stats?.total}
                title="Selection Left"
                value={(100 - (stats?.selected / stats?.total)).toFixed(2) + " %"}
                />
            </CCol>
        </CRow>)
        : (
            <header className="jumbotron" style={{ width: "98vw", overflow: "hidden" }}>
                    <h3>No record Found</h3>
            </header>
        )}</div>
    );
}

export default ShowStats;