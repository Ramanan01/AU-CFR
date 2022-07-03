package models

import (
	"database/sql"
	"fmt"
	"go-backend/config"
	"go-backend/utilities"
	"log"
	"time"
)

func GetUser(email string) (User, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("GetUser: config.GetDB error -> ", err)
		return User{}, err
	}
	defer db.Close()

	var ID sql.NullInt64
	var Email sql.NullString
	var Password sql.NullString
	var Name sql.NullString

	query :=
		`
			SELECT 
				id,
				email,
				password,
				name
			FROM 
				account
			WHERE
				email=$1`

	err = db.QueryRow(query, email).Scan(
		&ID,
		&Email,
		&Password,
		&Name,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			// log.Println("GetUser: User doesn't exist.")
			return User{}, nil
		}
		log.Println("GetUser: db.QueryRow error -> ", err)
		return User{}, err
	}
	user := User{
		ID:       utilities.SQLNullIntToInt(ID),
		Email:    utilities.SQLNullStringToString(Email),
		Password: utilities.SQLNullStringToString(Password),
		Name:     utilities.SQLNullStringToString(Name),
	}
	return user, nil
}

// CreateNewSession function to insert user into table
func CreateNewSession(userID int64, token string) error {
	db, err := config.GetDB()
	if err != nil {
		log.Println("CreateNewSession: config.GetDB error -> ", err)
		return err
	}
	defer db.Close()

	sqlInsert := `
	INSERT INTO 
		session (
			user_id,
			user_token, 
			is_expire
		)
	VALUES 
		($1, $2, $3)
	ON CONFLICT
		(user_id)
	DO
		UPDATE
			SET user_token = $4,
			is_expire = $5,
			last_login = $6`

	_, err = db.Exec(sqlInsert, userID, token, false, token, false, time.Now())
	if err != nil {
		log.Println("CreateNewSession: db.Exec error -> ", err)
		return err
	}
	return nil
}

// ExpireSession function to make is_expire false user into table
func ExpireSession(token string) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("ExpireSession: config.GetDB() ERROR -> ", err)
		return
	}
	defer db.Close()

	updateQuery := `
				UPDATE 
					session
				SET 
					is_expire = TRUE 
				WHERE 
					user_token = $1
				returning id`

	_, err = db.Exec(updateQuery, token)
	if err != nil {
		log.Println("ExpireSession: DB.eXEC ERROR -> ", err)
		return
	}
}

//CreateUser create new user
func CreateUser(user *RegisterReq) (int64, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("CreateUser: config.GetDB -> ", err)
		return 0, err
	}
	defer db.Close()

	sqlInsert := `
					INSERT INTO 
						account (
							email, 
							password,
							name
						)
						VALUES 
							($1, $2, $3)
						ON CONFLICT (email) 
							DO NOTHING
						RETURNING id`

	var userID int64
	row := db.QueryRow(sqlInsert,
		user.Email,
		user.Password,
		user.Name,
	)
	err = row.Scan(&userID)

	if err != nil {
		log.Println("CreateUser: failed:", err)
		return 0, err
	}
	return userID, err
}

// CheckSession function to check for login history
func CheckSession(token string) (bool, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("CheckSession: Failed while connecting with the database :", err)
		return false, err
	}
	defer db.Close()

	fmt.Print("tpken", token)
	selectQuery := `
				SELECT 
					is_expire,
					user_id
				FROM
					session
				WHERE
					user_token = $1`

	var flag bool
	var userID string
	err = db.QueryRow(selectQuery, token).Scan(&flag, &userID)
	if err != nil {
		log.Println("CheckSession: failed:", err)
		return false, err
	}
	return !flag, err
}

// GetUserIdByToken function to get User info from session table by Token
func GetUserIdByToken(token string) (int64, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("GetUserIdByToken: Failed while connecting with the database :", err)
		return 0, err
	}
	defer db.Close()

	selectQuery := `
					SELECT
						user_id
					FROM 
						session 
					WHERE 
						user_token = $1`

	var userID int64
	err = db.QueryRow(selectQuery, token).Scan(&userID)

	if err != nil {
		log.Println("GetUserIdByToken: failed:", err)
		return 0, err
	}

	return userID, nil
}

func GetUserProfile(userID int64) (Profile, error) {
	db, err := config.GetDB()
	if err != nil {
		log.Println("GetUserProfile: Failed while connecting with the database -> ", err)
		return Profile{}, err
	}
	defer db.Close()

	query := `
			SELECT 
				id,
				email,
				name			
			FROM
				account
			WHERE id = $1
	`

	var id sql.NullInt64
	var name sql.NullString
	var email sql.NullString

	err = db.QueryRow(query, userID).Scan(
		&id,
		&email,
		&name,
	)

	if err != nil && err != sql.ErrNoRows {
		log.Println("GetUserProfile failed -> ", err)
		return Profile{}, err
	}

	profile := Profile{
		ID:    utilities.SQLNullIntToInt(id),
		Name:  utilities.SQLNullStringToString(name),
		Email: utilities.SQLNullStringToString(email),
	}

	return profile, nil
}
