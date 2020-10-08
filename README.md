
#Healthpeer NG API

www.healthpeer.ng

Healthpeer NG DOCUMENTATION (HP) 

1.1 Purpose of Document
This document is a documentation of the above-mentioned software application developed for Healthpee NG in 2018.

1.2 Application Overview
Healthpeer is a tool for realtime mobile consultation between medical professionals and their patients. This API was developed to complement the mobile apps already developed for the frontend.

1.3 Scope
The scope of this development was to create the backend APIs for the Healthpeer application. The system was built on the following modules:
• Authentication
• Realtime chat
• Blood bank
• Health threads
• User Manager & Settings

1.4 Tools
Healthpeer API Backend was built using NodeJs (Express Js) and deployed on a private heroku server.
Other dependencies & plugins can be found in the package.json file. It was developed using the IDE - Visual studio code.

1.5 Coding Structure
The back-end code was structured with MVC with Models, Views, Controllers and Routers. It also includes middleware to verify all incoming requests. The config file has been ignored for security reasons and confidentiality of data. This can be recreated on request as its detrimental to the running of this project

1.6 Build Commands
Start: “npm start”
Build: Backend is run with pm2 on the server or batch script.

1.7 Repository
Url: https://github.com/devmuhammad/healthpeer-api
Branch: master

1.8 API/Endpoints
Production: http://BaseURL/healthpeer-api/v1/ Development: http://localhost:3000/healthpeer-api/v1/
   
