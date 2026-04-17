const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace string interpolations + currency text
  newContent = newContent.replace(/ ₫/g, '');
  newContent = newContent.replace(/₫/g, '');
  
  // Replace JSX specific <sup>₫</sup> or <span> ₫</span>
  newContent = newContent.replace(/<sup.*?>₫<\/sup>/g, '');
  newContent = newContent.replace(/<span.*?> ₫<\/span>/g, '');

  // Fixing the '15,000,000' or '14,500,000 ' standing alone formatting on dashboard
  newContent = newContent.replace(/\+ 14,500,000  trong/g, '+ 14,500,000 trong');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

// Fix stat card specific logic
const statCardPath = path.join(__dirname, 'src/components/common/StatCard.jsx');
let statCardContent = fs.readFileSync(statCardPath, 'utf8');
statCardContent = statCardContent.replace(
  /\{typeof value === 'string' && \(value\.includes\(''\) || value\.includes\('đ'\)\) \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
  "{value}"
);
// The previous replace removed the ₫ from the file, so it broke the includes logic. Let's just make it render {value}.
// Actually simpler:
statCardContent = `import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, badge }) => {
  return (
    <div className="stat-card fade-in">
      {badge && <div className="stat-badge">{badge}</div>}
      <div className="stat-content">
        <div className="stat-value">
          {value}
        </div>
        <div className="stat-title">{title}</div>
      </div>
      <div className="stat-icon">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;`;
fs.writeFileSync(statCardPath, statCardContent, 'utf8');
console.log('Fixed StatCard.jsx');
