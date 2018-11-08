const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("gitRepo", { type: String, required: true });
  }

  end() {
    this.composeWith(require.resolve("../app/index.js"), {
      gitRepo: this.options.gitRepo,
    });
  }
};
