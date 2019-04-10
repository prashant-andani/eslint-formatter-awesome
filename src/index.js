const { Command, flags } = require('@oclif/command');
//const { spawn } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const chalk = require('chalk');
const emoji = require('node-emoji');
const log = console.log;
const fs = require('fs');
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

  writeToFile(data) {
    fs.truncate('content.json', () => {
      console.log('Content truncated...');
    });

    fs.writeFile('content.json', data, 'utf8', () =>
      console.log('file created')
    );
  }

  async fetchError() {
    console.log('fetching ...');

    try {
      const { stdout, stderr } = await exec('eslint . -f json');
    } catch (e) {
      this.writeToFile(e.stdout);
    }
  }
  async run() {
    const { flags } = this.parse(EslintStatsCommand);
    console.log('Running eslint ...');
    this.fetchError();
  }
}

EslintStatsCommand.description = `Describe the command here
...
Extra documentation goes here
`;

EslintStatsCommand.flags = {
  //   // add --version flag to show CLI version
  //   version: flags.version({ char: 'v' }),
  //   // add --help flag to show CLI version
  //   help: flags.help({ char: 'h' }),
  //   rule: flags.string({ char: 'r', description: 'Group by Rules' })
};

module.exports = EslintStatsCommand;
