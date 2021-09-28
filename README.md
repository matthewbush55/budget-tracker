# Budget Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents:

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Questions](#questions)

## Description

This application allows users to enter budget data into a form and uses CRUD operations to populate a `MongoDB` database, as well as populate the local object store in `IndexedDB` if there is no network connection available. Cached transactions are uploaded to `MongoDB` once the application detects a network connection. Once the user is finished entering transactions, the data is aggregated an displayed in graphs. This app uses `Mongoose` to create the database schema. It also utilizes `node.js`, `JavaScript`, `express.js`, and `MongoDB`. It also utilizes `service-worker.js` to perform data caching.

![Walkthrough](assets/images/Walkthrough.png)

## Installation

After cloning the repository, install necessary dependencies by running `npm i`:

NOTE: You may also want to add `node_modules` to your `.gitignore` file to prevent unnecessary library uploads to your repository.

## Usage

Start the app by running `npm start` in your terminal or CLI. The app is deployed to [http://localhost:3000](http://localhost:3000) by default, but can be changed to your desired port number. It can also be deployed to a hosting service (additional configuration may be required).

## License

This project is licensed under [License: MIT](https://opensource.org/licenses/MIT)

## Contributing

To contribute to this project (or any others), please contact me using the information in the Questions section below or by submitting a pull request.

> For more information on project contribution guidelines, please reference [Contributor Covenant](https://www.contributor-covenant.org/)

## Questions?

If you have any questions, please feel free to reach out. Thanks!

GitHub: https://github.com/matthewbush55

Email: matthewbush55@gmail.com
