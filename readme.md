# Project Name

BCDT-TRT

## Preconditions

node version: 12+

## Installation

npm install - to pull all the npm packages

## Usage

Run this framework to validate ...


## Execute Automation Framework

npm test

## Available parameters:
#### --report=allure 
to switch between different reporters

possible options: allure, spec; 

default: allure;

#### --clean=all
to clean different report items

possible options: all, html, logs, screenshots and their combinations divided by '/'

default: false

#### --env=atqa
to switch between different environments

possible options: atqa, atdv, d491, q491; 

default: atdv;



# Reporting

#### Logs 
reports/logs

#### HTML report
reports/allure

#### Screenshots
reports/screenshots

### Allure hosting
in additional terminal execute:
##### npm run allure-host
report will be available on http://localhost:1234 or through network on port 1234


