import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

// Register partials
const partialsDir = './templates/partials';
fs.readdirSync(partialsDir).forEach(file => {
  const partialName = path.parse(file).name;
  const partialContent = fs.readFileSync(`${partialsDir}/${file}`, 'utf8');
  Handlebars.registerPartial(partialName, partialContent);
});

// Add helpers (optional)
Handlebars.registerHelper('year', () => new Date().getFullYear());

// Context shared across pages
const context = {
  siteTitle: 'Ryan Lemons | Web Developer'
};

const pages = ['index', 'contact'];
//const pages = ['index', 'portfolio', 'resume', 'contact'];

for (const page of pages) {
  const source = fs.readFileSync(`./templates/${page}.hbs`, 'utf8');
  const template = Handlebars.compile(source);
  const result = template(context);
  fs.writeFileSync(`./${page}.html`, result);
}
