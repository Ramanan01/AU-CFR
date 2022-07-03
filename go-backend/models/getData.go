package models

import (
	"database/sql"
	"encoding/json"
	"go-backend/config"
	"go-backend/utilities"
	"log"
	"strconv"
	"strings"
)

func GetNextExpert(offset string) (Expert, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("GetNextExpert : Failed while connecting with the database -> ", err)
		return Expert{}, err
	}
	defer db.Close()

	query := `
			SELECT
				id, 
				app_gen_id,
				name,
				title,
				dc_members,
				dco_members,
				selected_member
			FROM
				membersdata
			LIMIT 1
			OFFSET $1`

	var id sql.NullInt64
	var app_gen_id sql.NullString
	var name sql.NullString
	var title sql.NullString
	var dc_members sql.NullString
	var dco_members sql.NullString
	var selected_expert sql.NullString

	err = db.QueryRow(query, offset).Scan(
		&id,
		&app_gen_id,
		&name,
		&title,
		&dc_members,
		&dco_members,
		&selected_expert)

	if err != nil && err != sql.ErrNoRows {
		log.Println("GetNextExpert: failed -> ", err)
		return Expert{}, err
	}

	var dcMemberJsonMap []Member
	json.Unmarshal([]byte(utilities.SQLNullStringToString(dc_members)), &dcMemberJsonMap)
	var dcoMemberJsonMap []Member
	json.Unmarshal([]byte(utilities.SQLNullStringToString(dco_members)), &dcoMemberJsonMap)

	expert := Expert{
		ID:             utilities.SQLNullIntToInt(id),
		AppGenID:       utilities.SQLNullStringToString(app_gen_id),
		Name:           utilities.SQLNullStringToString(name),
		Title:          utilities.SQLNullStringToString(title),
		DcMembers:      dcMemberJsonMap,
		DcoMembers:     dcoMemberJsonMap,
		SelectedExpert: utilities.SQLNullStringToString(selected_expert),
	}

	return expert, nil
}

func UpdateSelectExpert(request SelectExpertReq) error {
	db, err := config.GetDB()
	if err != nil {
		log.Println("UpdateSelectExpert : Failed while connecting with the database -> ", err)
		return err
	}
	defer db.Close()

	query := `
			UPDATE
				membersdata
			SET
				selected_member = $1
			WHERE
				app_gen_id = $2`

	_, err = db.Exec(query,
		request.ExpertID,
		request.AppGenID)

	if err != nil {
		log.Println("UpdateSelectExpert: failed -> ", err)
		return err
	}
	return nil
}

func GetSelectedExpert() ([]SelectedExpertRes, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("GetSelectedExpert : Failed while connecting with the database -> ", err)
		return nil, err
	}
	defer db.Close()

	query := `
		SELECT
			id, 
			app_gen_id,
			name,
			title,
			dc_members,
			dco_members,
			selected_member
		FROM
			membersdata
		WHERE
			selected_member is not null
		ORDER BY
			id
			`

	rows, err := db.Query(query)

	if err != nil && err != sql.ErrNoRows {
		log.Println("GetSelectedExpert: failed -> ", err)
		return nil, err
	}
	defer rows.Close()

	var expert_list []SelectedExpertRes

	for rows.Next() {

		var id sql.NullInt64
		var app_gen_id sql.NullString
		var name sql.NullString
		var title sql.NullString
		var dc_members sql.NullString
		var dco_members sql.NullString
		var selected_member sql.NullString

		err = rows.Scan(
			&id,
			&app_gen_id,
			&name,
			&title,
			&dc_members,
			&dco_members,
			&selected_member,
		)
		if err != nil && err != sql.ErrNoRows {
			log.Println("GetSelectedExpert: failed -> ", err)
			return nil, err
		}
		var ExpertSelected int
		if ExpertSelected, err = strconv.Atoi(utilities.SQLNullStringToString(selected_member)); err != nil {
			log.Println("GetSelectedExpert: failed -> ", err)
			return nil, err
		}

		var dcMemberJsonMap []Member
		json.Unmarshal([]byte(utilities.SQLNullStringToString(dc_members)), &dcMemberJsonMap)
		var dcoMemberJsonMap []Member
		json.Unmarshal([]byte(utilities.SQLNullStringToString(dco_members)), &dcoMemberJsonMap)

		var Expert_Name string
		var Expert_Designation string
		var Expert_Specialization string
		var Expert_Department string
		var Expert_Score string

		if ExpertSelected < 4 {
			Expert_Name = dcMemberJsonMap[ExpertSelected-1].Name
			Expert_Designation = dcMemberJsonMap[ExpertSelected-1].Designation
			Expert_Department = dcMemberJsonMap[ExpertSelected-1].Department
			Expert_Specialization = dcMemberJsonMap[ExpertSelected-1].Specialization
			Expert_Score = dcMemberJsonMap[ExpertSelected-1].Score
		} else {
			Expert_Name = dcMemberJsonMap[ExpertSelected%4].Name
			Expert_Designation = dcMemberJsonMap[ExpertSelected%4].Designation
			Expert_Department = dcMemberJsonMap[ExpertSelected%4].Department
			Expert_Specialization = dcMemberJsonMap[ExpertSelected%4].Specialization
			Expert_Score = dcMemberJsonMap[ExpertSelected%4].Score
		}

		expert_list = append(expert_list, SelectedExpertRes{
			ID:                   utilities.SQLNullIntToInt(id),
			AppGenID:             utilities.SQLNullStringToString(app_gen_id),
			Name:                 utilities.SQLNullStringToString(name),
			Title:                strings.Replace(utilities.SQLNullStringToString(title), ",", "", -1),
			ExpertName:           Expert_Name,
			ExpertDesignation:    strings.Replace(Expert_Designation, ",", "", -1),
			ExpertDepartment:     strings.Replace(Expert_Department, ",", "", -1),
			ExpertSpecialization: strings.Replace(Expert_Specialization, ",", "", -1),
			Score:                Expert_Score,
		})
	}
	return expert_list, nil
}

func GetStats() (Stats, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("GetStats : Failed while connecting with the database -> ", err)
		return Stats{}, err
	}
	defer db.Close()

	query := `
			SELECT
				count(*) as total
			FROM
				membersdata
			`

	var total sql.NullInt64

	err = db.QueryRow(query).Scan(
		&total)

	if err != nil && err != sql.ErrNoRows {
		log.Println("GetStats: failed -> ", err)
		return Stats{}, err
	}

	query = `
			SELECT
				count(*) as total
			FROM
				membersdata
			WHERE
				selected_member is not null
			`

	var selected sql.NullInt64

	err = db.QueryRow(query).Scan(
		&selected)

	if err != nil && err != sql.ErrNoRows {
		log.Println("GetStats: failed -> ", err)
		return Stats{}, err
	}

	stats := Stats{
		Total:    utilities.SQLNullIntToInt(total),
		Selected: utilities.SQLNullIntToInt(selected),
	}

	return stats, nil

}
