/* 
!!!!!!! DO NOT MODIFY THIS FILE DIRECTLY!!!!!!!
	Use generate_crop_type_constants.py
*/

const CROP_TYPES ={
    "alfalfa": {
        "crop_class": "Field", 
        "id": 2, 
        "can_schedule": false, 
        "name": "Alfalfa"
    }, 
    "citrus": {
        "crop_class": "Orchard", 
        "id": 9, 
        "can_schedule": true, 
        "name": "Citrus"
    }, 
    "table grapes": {
        "crop_class": "Vine", 
        "id": 6, 
        "can_schedule": true, 
        "name": "Table Grapes"
    }, 
    "olives for table": {
        "crop_class": "Orchard", 
        "id": 11, 
        "can_schedule": true, 
        "name": "Olives for table"
    }, 
    "walnuts": {
        "crop_class": "Orchard", 
        "id": 8, 
        "can_schedule": true, 
        "name": "Walnuts"
    }, 
    "other": {
        "crop_class": "Other", 
        "id": 100, 
        "can_schedule": false, 
        "name": "Other"
    }, 
    "pistachios": {
        "crop_class": "Orchard", 
        "id": 3, 
        "can_schedule": true, 
        "name": "Pistachios"
    }, 
    "almonds": {
        "crop_class": "Orchard", 
        "id": 1, 
        "can_schedule": true, 
        "name": "Almonds"
    }, 
    "wine grapes": {
        "crop_class": "Vine", 
        "id": 5, 
        "can_schedule": true, 
        "name": "Wine Grapes"
    }, 
    "olives for oil": {
        "crop_class": "Orchard", 
        "id": 7, 
        "can_schedule": true, 
        "name": "Olives for oil"
    }, 
    "avocados": {
        "crop_class": "Orchard", 
        "id": 10, 
        "can_schedule": true, 
        "name": "Avocados"
    }, 
    "tomatoes": {
        "crop_class": "Row", 
        "id": 4, 
        "can_schedule": true, 
        "name": "Tomatoes"
    }
};

export default CROP_TYPES;

