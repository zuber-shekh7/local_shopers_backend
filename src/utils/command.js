import program from "commander";
import pkg from "inquirer";
import createSuperUser, { questions } from "./createsuperuser.js";

const { prompt } = pkg;

program.version("1.0.0").description("Command-Line Tool");

const createSuperUserCommand = program.command("createsuperuser");

createSuperUserCommand.description("Create super user");

createSuperUserCommand.action(() => {
  prompt(questions)
    .then((answers) => {
      const exec = async () => {
        await createSuperUser(answers);
        process.exit(0);
      };

      exec();
    })
    .catch((err) => {
      console.error(`${err}`.red.bold);
      process.exit(1);
    });
});

program.parse(process.argv);
