const DesignationList = {
    list: [
        {
            id: 1,
            title: "Professor",
        },
        {
            id: 2,
            title: "Associate Professor",
        },
        {
            id: 3,
            title: "Assistant Professor",
        },
        {
            id: 4,
            title: "Lecturer/Teaching Fellow",
        },
    ],
    getList: function() {
        return (
            (localStorage.getItem("designationListOrder") &&
            JSON.parse(localStorage.getItem("designationListOrder"))) ||
            this.list
        );
    },
    saveList: (list) => {
        localStorage.setItem("designationListOrder", JSON.stringify(list));
    },
};

export default DesignationList;
