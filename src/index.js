const { Command, flags } = require('@oclif/command');
const { spawn } = require('child_process');
const chalk = require('chalk');
const emoji = require('node-emoji');
const log = console.log;

// Combine styled and normal strings
class EslintStatsCommand extends Command {
  groupByRules(data) {
    const list = {};
    JSON.parse(data).forEach(each => {
      each.messages.forEach(msg => {
        if (!list[msg.ruleId]) {
          list[msg.ruleId] = [];
        }
        list[msg.ruleId].push({ file: each.filePath, ...msg });
      });
    });
    return list;
  }
  getTotalCount(data) {
    const result = {
      errors: 0,
      warnings: 0,
      autoFixableErrors: 0,
      autoFixableWarnings: 0
    };
    JSON.parse(data).forEach(each => {
      if (each.errorCount) {
        result.errors = result.errors + each.errorCount;
      } else if (each.warningCount) {
        result.warnings = result.warnings + each.warningCount;
      }
      if (each.fixableErrorCount) {
        result.autoFixableErrors =
          result.autoFixableErrors + each.fixableErrorCount;
      } else if (each.fixableWarningCount) {
        result.autoFixableWarnings =
          result.autoFixableWarnings + each.fixableWarningCount;
      }
    });
    return result;
  }

  displayErrorMessages(data) {
    const errorMessages = [];
    log('');
    log(chalk.red.bold(`Error List`));
    JSON.parse(data).forEach(each => {
      if (each.errorCount) {
        log(chalk.white.bold(each.filePath));
        each.messages.forEach(msg => {
          log(`${msg.line}:${msg.column} ${msg.ruleId} ${msg.message}`);
        });
        log('');
      }
    });
  }
  displayWarningMessages(data) {
    const warningMessages = [];
    log('');
    log(chalk.yellow.bold(`Warning List`));
    JSON.parse(data).forEach(each => {
      if (each.warningCount) {
        log(chalk.white.bold(each.filePath));
        each.messages.forEach(msg => {
          log(`${msg.line}:${msg.column} ${msg.message} - ${msg.ruleId}`);
        });
      }
    });
  }
  displayByType(data) {
    this.displayErrorMessages(data);
    this.displayWarningMessages(data);
  }
  displayByRules(data) {
    const rules = this.groupByRules(data);
    log(chalk.white.bold('****** Grouped by Rules ******'));
    log('\n');
    Object.entries(rules).forEach(rule => {
      log(chalk.white.red(rule[0]));
      rule[1].forEach(issue => {
        log(
          `--> ${issue.line}:${issue.column} ${chalk.white.bold(
            issue.message
          )} in ${issue.file}`
        );
      });
      log('');
    });
  }

  fetchError() {
    const ls = spawn('eslint', ['.', '-f', 'json']);
    ls.stdout.on('data', data => {
      let result = this.getTotalCount(data);
      const total =
        result.errors +
        result.warnings +
        result.autoFixableErrors +
        result.autoFixableWarnings;
      log(
        chalk.bgBlue.bold(
          `********** ${emoji.get('punch')}  ESLint Stats **********`
        )
      );
      log('\n');
      //this.displayByType(data);
      this.displayByRules(data);

      log('');
      log(
        `${emoji.get('fire')} `,
        `${total} problems found`,
        `(${chalk.red.bold('Errors:')} ${result.errors}, ${chalk.yellow.bold(
          'Warnings:'
        )}, ${result.warnings})`,
        `(${chalk.green.bold('Autofixable Errors:')} ${
          result.autoFixableErrors
        },`,
        `${chalk.green.bold('Autofixable Warnings:')} ${
          result.autoFixableWarnings
        })`
      );
    });

    ls.stderr.on('data', data => {
      //log(`${data}`);
    });

    ls.on('close', code => {
      // console.log(`child process exited with code ${code}`);
    });
  }
  async run() {
    const { flags } = this.parse(EslintStatsCommand);
    console.log(flags);
    this.fetchError();
  }
}

EslintStatsCommand.description = `Describe the command here
...
Extra documentation goes here
`;

EslintStatsCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' }),
  rule: flags.string({ char: 'r', description: 'Group by Rules' })
};

module.exports = EslintStatsCommand;
