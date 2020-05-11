[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/eesayas/mitigate-covid-19) 

# mitigate-covid-19
A website for analyzing COVID-19 data

[Website Link](https://mitigate-covid-19.herokuapp.com/)

## Overview

Through this web app, users can create *timeline reports* from COVID-19 cases.
The user can select any length of timeline (2 days, 30 days etc) and any date 
where there is data. 

The reports will contain the total number of cases during the given timeline. It will
also show a breakdown of these cases from *active*, *recovered*, or *dead* cases.
The report also shows how many new cases were added during the time and show
the *fatality rate*, *recovery rate*, and *rate of increase in cases*.

As a bonus feature, the website also has a page where users can compare the 
*case curve* of countries in a line graph. Users can add/hide countries as 
the please. 

Another small feature is that on first visit, the app will try to obtain the visitor's/user's
country location. And it will redirect the website to show data particular to that
obtained location. *(The app will redirect to show Canada data if it fails to acquire user's location)*
