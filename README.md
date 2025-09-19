# Car Rental App

![GitHub repo size](https://img.shields.io/github/repo-size/clementR97/frontendCarRent)
![GitHub stars](https://img.shields.io/github/stars/clementR97/frontendCarRent?style=social)
![GitHub forks](https://img.shields.io/github/forks/clementR97/frontendCarRent?style=social)

This project is a car rental app consisting of **two parts**:  

1. **Frontend** : Angular Application for users and admin on this repository.  
2. **Backend** : [Node.js API](https://github.com/clementR97/CarLocationBackend.git)Node.js API to manage car data, reservations and users.

---

## Table of contents
- [Description](#description)  
- [Technologies used](#technologies-used)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Launch the application](#launch-the_application)  
- [Licence](#licence)  

---

## Description

This application allows:  
- Browse the catalog of available cars  
- View the details of each vehicle  
- Book a car for a given period  
- Manage your user account (login, registration, profile modification)  
- Admin page
The frontend interacts with the backend via **REST APIs**.

---

## Technologies used

### Frontend
- Angular  
- TypeScript  
- HTML5 / CSS3  
- Bootstrap  
- RxJS for data flow management  
- Angular Router for navigation
- supabase OAuth 


## Installation

1. created a folder and in the folder
2. Clone the repository frontend:  
```bash
git clone https://github.com/clementR97/frontendCarRent.git
cd frontendCarRent
```
3.Install the dependencies for frontend:
```bash
npm install
```
## Configuration
In frontend/src/environments/environment.ts:
```bash
export const ApiUrl = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```
for supabase:
```bash
export const environment = {
    production: false,
    supabase: {
      url: 'your project supabase url',
      anonKey:your project supabase annonKey,      

    }
  };
```
## Launch the application:
   ```bash
   cd frontend
   ng serve
   ```
.Frontend accessible on http://localhost:4200
.The page automatically reloads when you make changes.

## Licence
Ce projet est sous licence MIT.


