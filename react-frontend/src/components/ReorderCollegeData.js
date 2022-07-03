const CollegeList = {
    collegelist: [
        {
            id: 1,
            title: "IITs / IIMs",
        },
        {
            id: 2,
            title: "IIITs / NITs",
        },
        {
            id: 3,
            title: "Central Universities",
        },
        {
            id: 4,
            title: "State Universities",
        },
        {
            id: 5,
            title: "Deemed Universities",
        },
        {
            id: 6,
            title: "Institutes",
        },
    ],
    getCollegeList: function() {
        return (
            (localStorage.getItem("collegeListOrder") &&
            JSON.parse(localStorage.getItem("collegeListOrder"))) ||
            this.collegelist
        );
    },
    saveCollegeList: (collegelist) => {
        localStorage.setItem("collegeListOrder", JSON.stringify(collegelist));
    },
};

export default CollegeList;
