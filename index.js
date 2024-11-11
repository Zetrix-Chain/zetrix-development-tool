#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

function copyTemplate(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      console.error('Template directory does not exist.');
      return;
    }
    fs.copySync(src, dest, { recursive: true, overwrite: false });
    console.log('Template copied successfully!');
  } catch (err) {
    console.error('Error copying template:', err);
  }
}

const templateDir = path.join(__dirname, 'template');

function initProject(projectName) {
  const projectDir = path.resolve(projectName);

  if (fs.existsSync(projectDir)) {
    console.error('Project directory already exists.');
    return;
  }

  copyTemplate(templateDir, projectDir);
}

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.error('Please specify a project name.');
  process.exit(1);
}

initProject(projectName);