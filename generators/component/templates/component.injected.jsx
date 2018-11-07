import React from 'react';
import { inject, observer } from 'mobx-react';

const <%= name %> = ({ store }) => <div></div>

export default inject("store")(observer(<%= name %>))
