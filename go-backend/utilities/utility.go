package utilities

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

//SQLNullStringToString convert sql null string to string
func SQLNullStringToString(s sql.NullString) string {
	if s.Valid {
		return strings.TrimSpace(s.String)
	}

	return ""
}

//SQLNullIntToInt convert sql null int to int
func SQLNullIntToInt(i sql.NullInt64) int64 {
	if i.Valid {
		return i.Int64
	}

	return 0
}

//SQLNullFloatToFloat convert sql null float to float
func SQLNullFloatToFloat(f sql.NullFloat64) float64 {
	if f.Valid {
		return f.Float64
	}

	return 0.0
}

//SQLNullTimeToTime convert sql null time to time
func SQLNullTimeToTime(t sql.NullTime) time.Time {
	if t.Valid {
		return t.Time
	}

	return time.Now()
}

func SQLNullBoolToBool(b sql.NullBool) bool {
	if b.Valid {
		return b.Bool
	}

	return false
}

//VerifyPassword verify password
func VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

//HashPassword create hash
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func ConvertParsedStringIntoTime(s string) time.Time {
	layout := "2006-01-02T15:04:05"
	t, err := time.Parse(layout, s)
	if err != nil {
		log.Println("ConvertParsedStringIntoTime: error ->", err)
	}
	return t
}

func ConvertParsedStringIntoDate(s string) time.Time {
	layout := "2006-01-02"
	t, err := time.Parse(layout, s)
	if err != nil {
		log.Println("ConvertParsedStringIntoTime: error ->", err)
	}
	return t
}

func StringArrayToInt64Array(strArray []string) []int64 {

	str := fmt.Sprint(strArray)
	str = strings.Replace(str, "[", "", 1)
	str = strings.Replace(str, "]", "", 1)
	s := strings.Split(str, ",")

	ary := make([]int64, len(s))
	for i := range ary {
		x, _ := strconv.Atoi(s[i])
		ary[i] = int64(x)
	}
	return ary
}

func StringArrayToInt32Array(strArray []string) []int32 {
	intArray := make([]int32, len(strArray))
	for i, v := range strArray {
		x, _ := strconv.Atoi(v)
		intArray[i] = int32(x)
	}
	return intArray
}
