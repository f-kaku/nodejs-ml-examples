import * as plotly from 'plotly.js';

const trueLabels = ['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c']
const predLabels = ['a', 'b', 'a', 'b', 'b', 'b', 'b', 'b', 'c']
const uniqueTrueLabels = [...new Set(trueLabels)];

console.log(uniqueTrueLabels)