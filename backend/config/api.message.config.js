

(function () {

    "use strict";

    module.exports = {
        applicationMessage: {
            alreadyExists: "Database with same name already exists",
            serverError: "OOPS!!! Something went wrong with the server.",
            noContent: "File content cannot be retrieved",
            dbRestoreFail: "Database not restored. It may be because of invalid backup file format or wrong backup configuration. Please check the configuration in database.config.js inside of lib/configs folder",
            dbRestoreError: "Error Occurs while restroing MongoDB backup file. Please Try again to restore the DB backup file"
        }

    };
})();