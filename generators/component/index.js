var Generator = require('yeoman-generator');
const { getFirstOptionOfType } = require('../../utils');

const types = ['atom', 'molecule', 'organism', 'page', 'template'];
const kinds = ['simple', 'class', 'injected'];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: true });

    this._createTypeOptions();

    kinds.forEach(k => this.option(k, { alias: k.charAt(0) }));
  }

  initializing() {
    if (!this.fs.exists('package.json')) throw console.error('Requires project');

    this.selectedType = getFirstOptionOfType(this.options, types);

    if (!this.selectedType) throw console.error('Requires component type');

    this.selectedKind = getFirstOptionOfType(this.options, kinds) || 'default';
  }

  writing() {
    const path = `src/components/${this.selectedType}s/${this.options.name}/index.jsx`;

    this.fs.copyTpl(this.templatePath(`component.${this.selectedKind}.jsx`), path, {
      name: this.options.name
    });
  }

  _createTypeOptions() {
    types.forEach(type =>
      this.option(type, {
        alias: type.toUpperCase().charAt(0),
        description: `Creates component with type ${type}`
      })
    );
  }
};
