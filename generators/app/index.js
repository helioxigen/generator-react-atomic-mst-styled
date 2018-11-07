const Generator = require('yeoman-generator');
const path = require('path');
const { last } = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('gitRepo', { type: String });
  }

  initializing() {
    const { gitRepo } = this.options;

    if (gitRepo) {
      this.gitRepo = gitRepo;
      this.appname = last(gitRepo.split('/')).replace('.git', '');
    }
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name and path',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'repo',
        message: 'Git repo url',
        default: this.gitRepo
      },
      {
        type: 'input',
        name: 'username',
        message: 'Git username',
        default: this.user.git.name
      }
    ]);
  }

  configuring() {
    const repoURL = new URL(this.answers.repo);
    repoURL.username = this.answers.username;

    const currentDir = path.basename(this.destinationPath());

    if (currentDir !== this.answers.name) {
      this.destinationRoot(this.destinationPath(this.answers.name));
    }

    this.spawnCommand('git', ['clone', repoURL, this.destinationPath('.')]);
  }

  writing() {
    this._createPackageJson();

    this.fs.copy(this.templatePath('webpack'), this.destinationPath('.'));
    this.fs.copy(this.templatePath('configs'), this.destinationPath('.'), {
      globOptions: { dot: true }
    });
  }

  install() {
    const { main, dev } = require('./deps.json');

    const webpackDeps = require(this.templatePath('webpack/.deps.json'));

    this.npmInstall(main);

    this.npmInstall(dev.concat(webpackDeps), { 'save-dev': true });
  }

  _createPackageJson() {
    const { name, repo } = this.answers;

    const pkgJson = {
      name,
      version: '1.0.0',
      main: './src/index.js',
      scripts: {
        dev: 'webpack-dev-server --config webpack.dev.js',
        build: 'webpack --config webpack.prod.js --progress --hide-modules'
      },
      repository: {
        type: 'git',
        url: `git+${repo}`
      },
      author: 'rolling',
      license: 'UNLICENSED'
    };

    this.fs.writeJSON(this.destinationPath('package.json'), pkgJson);
  }
};
