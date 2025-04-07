import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

// ✅ Auto-detect all .hbs files in /pages/
const pagesDir = './templates/pages';
const pages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.hbs'))
  .map(file => path.parse(file).name);

// Load layout template
const layoutSource = fs.readFileSync('./templates/layout.hbs', 'utf8');
const layoutTemplate = Handlebars.compile(layoutSource);

// Register partials
const partialsDir = './templates/partials';
fs.readdirSync(partialsDir).forEach(file => {
  const name = path.parse(file).name;
  const content = fs.readFileSync(`${partialsDir}/${file}`, 'utf8');
  Handlebars.registerPartial(name, content);
});

// Register helpers
Handlebars.registerHelper('year', () => new Date().getFullYear());

for (const page of pages) {
  const pageSource = fs.readFileSync(`${pagesDir}/${page}.hbs`, 'utf8');
  const pageContent = Handlebars.compile(pageSource)();

  const finalHtml = layoutTemplate({
    title: `Ryan Lemons | ${page.charAt(0).toUpperCase() + page.slice(1)}`,
    body: pageContent,
    year: new Date().getFullYear()
  });

  const outputPath = `./${page}.html`; // all pages go in root
  console.log(`✅ Writing: ${outputPath}`);
  fs.writeFileSync(outputPath, finalHtml);
}
